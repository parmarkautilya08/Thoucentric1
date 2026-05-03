import { Router } from "express";
import Parser from "rss-parser";

const router = Router();

const parser = new Parser({
  timeout: 10000,
  headers: {
    "User-Agent": "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
    "Accept": "application/rss+xml, application/xml, text/xml, */*",
  },
  customFields: {
    item: [
      ["media:content", "mediaContent"],
      ["dc:creator", "creator"],
      ["source", "sourceInfo"],
    ],
  },
});

const CACHE_TTL = 15 * 60 * 1000;
const cache = new Map<string, { data: unknown; ts: number }>();

async function withCache<T>(key: string, fn: () => Promise<T>): Promise<T> {
  const hit = cache.get(key);
  if (hit && Date.now() - hit.ts < CACHE_TTL) return hit.data as T;
  const data = await fn();
  cache.set(key, { data, ts: Date.now() });
  return data;
}

function getPublicationName(item: Record<string, unknown>, feedLabel: string): string {
  const src = item.sourceInfo as Record<string, unknown> | string | undefined;
  if (src) {
    if (typeof src === "string" && src.trim()) return src.trim();
    if (typeof src === "object" && src._ && typeof src._ === "string") return src._.trim();
  }
  const creator = item.creator as string | undefined;
  if (creator && typeof creator === "string" && creator.trim()) return creator.trim();
  return feedLabel;
}

const FEED_SOURCES = [
  {
    id: "fmcg-india",
    label: "FMCG India",
    category: "FMCG_INDIA",
    url: "https://news.google.com/rss/search?q=FMCG+India+consumer+goods+supply+chain&hl=en-IN&gl=IN&ceid=IN:en",
  },
  {
    id: "hul",
    label: "HUL",
    category: "COMPANY",
    url: "https://news.google.com/rss/search?q=%22Hindustan+Unilever%22+OR+%22HUL%22+earnings+supply&hl=en-IN&gl=IN&ceid=IN:en",
  },
  {
    id: "itc",
    label: "ITC",
    category: "COMPANY",
    url: "https://news.google.com/rss/search?q=%22ITC+Limited%22+FMCG+earnings&hl=en-IN&gl=IN&ceid=IN:en",
  },
  {
    id: "nestle-india",
    label: "Nestlé India",
    category: "COMPANY",
    url: "https://news.google.com/rss/search?q=%22Nestle+India%22+OR+%22Nestl%C3%A9+India%22&hl=en-IN&gl=IN&ceid=IN:en",
  },
  {
    id: "marico",
    label: "Marico",
    category: "COMPANY",
    url: "https://news.google.com/rss/search?q=Marico+India+FMCG&hl=en-IN&gl=IN&ceid=IN:en",
  },
  {
    id: "dabur",
    label: "Dabur",
    category: "COMPANY",
    url: "https://news.google.com/rss/search?q=Dabur+India+FMCG+results&hl=en-IN&gl=IN&ceid=IN:en",
  },
  {
    id: "britannia",
    label: "Britannia",
    category: "COMPANY",
    url: "https://news.google.com/rss/search?q=Britannia+Industries+FMCG&hl=en-IN&gl=IN&ceid=IN:en",
  },
  {
    id: "godrej-cp",
    label: "Godrej CP",
    category: "COMPANY",
    url: "https://news.google.com/rss/search?q=%22Godrej+Consumer+Products%22+FMCG&hl=en-IN&gl=IN&ceid=IN:en",
  },
  {
    id: "colgate-india",
    label: "Colgate India",
    category: "COMPANY",
    url: "https://news.google.com/rss/search?q=%22Colgate+Palmolive+India%22+OR+%22Colgate+India%22&hl=en-IN&gl=IN&ceid=IN:en",
  },
  {
    id: "reckitt-india",
    label: "Reckitt India",
    category: "COMPANY",
    url: "https://news.google.com/rss/search?q=%22Reckitt+India%22+OR+%22Reckitt+Benckiser+India%22&hl=en-IN&gl=IN&ceid=IN:en",
  },
  {
    id: "pg-india",
    label: "P&G India",
    category: "COMPANY",
    url: "https://news.google.com/rss/search?q=%22Procter+%26+Gamble+India%22+OR+%22P%26G+India%22&hl=en-IN&gl=IN&ceid=IN:en",
  },
  {
    id: "emami",
    label: "Emami",
    category: "COMPANY",
    url: "https://news.google.com/rss/search?q=Emami+FMCG+India&hl=en-IN&gl=IN&ceid=IN:en",
  },
  {
    id: "fmcg-global",
    label: "FMCG Global",
    category: "FMCG_GLOBAL",
    url: "https://news.google.com/rss/search?q=Unilever+Nestle+PG+Danone+FMCG+global+supply+chain&hl=en&gl=US&ceid=US:en",
  },
  {
    id: "regulatory",
    label: "Regulatory & Policy",
    category: "REGULATORY",
    url: "https://news.google.com/rss/search?q=FSSAI+India+food+packaging+EPR+regulation+compliance&hl=en-IN&gl=IN&ceid=IN:en",
  },
  {
    id: "earnings",
    label: "Earnings & Financial",
    category: "FINANCIAL",
    url: "https://news.google.com/rss/search?q=India+FMCG+quarterly+results+earnings+margin+revenue&hl=en-IN&gl=IN&ceid=IN:en",
  },
  {
    id: "commodity-news",
    label: "Commodity News",
    category: "COMMODITY",
    url: "https://news.google.com/rss/search?q=palm+oil+cocoa+tea+price+commodity+FMCG+India&hl=en&gl=US&ceid=US:en",
  },
];

interface FeedArticle {
  id: string;
  title: string;
  link: string;
  source: string;
  feedLabel: string;
  category: string;
  publishedAt: string;
  summary: string;
}

async function fetchOneFeed(source: (typeof FEED_SOURCES)[0]): Promise<FeedArticle[]> {
  try {
    const feed = await parser.parseURL(source.url);
    return (feed.items ?? []).slice(0, 8).map((item, i) => ({
      id: `${source.id}-${i}-${Date.now()}`,
      title: (item.title ?? "").replace(/<[^>]+>/g, "").trim(),
      link: item.link ?? "",
      source: getPublicationName(item as Record<string, unknown>, source.label),
      feedLabel: source.label,
      category: source.category,
      publishedAt: item.isoDate ?? item.pubDate ?? new Date().toISOString(),
      summary: (item.contentSnippet ?? item.summary ?? "")
        .replace(/<[^>]+>/g, "")
        .trim()
        .slice(0, 240),
    }));
  } catch {
    return [];
  }
}

router.get("/feeds/news", async (req, res) => {
  const category = (req.query.category as string) || "all";
  const sources =
    category === "all" ? FEED_SOURCES : FEED_SOURCES.filter((s) => s.category === category);

  try {
    const articles = await withCache(`news:${category}`, async () => {
      const batches = await Promise.all(sources.map(fetchOneFeed));
      const flat = batches.flat();
      flat.sort(
        (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      );
      return flat;
    });
    res.json({ articles, cachedAt: new Date().toISOString() });
  } catch {
    res.status(500).json({ error: "Failed to fetch news feeds" });
  }
});

router.get("/feeds/sources", (_req, res) => {
  res.json({
    sources: FEED_SOURCES.map(({ id, label, category }) => ({ id, label, category })),
  });
});

const COMMODITIES = [
  {
    symbol: "CC=F",
    name: "Cocoa",
    unit: "USD/MT",
    relevance: "Chocolate & confectionery input — Mondelez, Nestlé margin impact",
    flag: "🍫",
  },
  {
    symbol: "FCPO.KLS",
    name: "Palm Oil (CPO)",
    unit: "MYR/MT",
    relevance: "Soap, shampoo, edible oil — HUL, Marico, P&G India",
    flag: "🌴",
  },
  {
    symbol: "SB=F",
    name: "Raw Sugar",
    unit: "USD/lb",
    relevance: "Beverages, confectionery — Varun Beverages, ITC",
    flag: "🍬",
  },
  {
    symbol: "ZW=F",
    name: "Wheat",
    unit: "USD/bu",
    relevance: "Biscuits, noodles, flour FMCG — Britannia, ITC Aashirvaad",
    flag: "🌾",
  },
  {
    symbol: "KC=F",
    name: "Arabica Coffee",
    unit: "USD/lb",
    relevance: "Instant coffee, RTD — Tata Consumer, Nestlé Nescafé",
    flag: "☕",
  },
  {
    symbol: "DC=F",
    name: "Milk (US Class III)",
    unit: "USD/cwt",
    relevance: "Dairy FMCG — Nestlé India, Heritage Foods, Amul",
    flag: "🥛",
  },
];

const STALE_THRESHOLD_DAYS = 14;

async function fetchCommodityChart(symbol: string): Promise<{
  price: number | null;
  prevClose: number | null;
  currency: string | null;
  marketTime: string | null;
  isStale: boolean;
}> {
  try {
    const url = `https://query2.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=5d`;
    const resp = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0", "Accept": "application/json" },
    });
    if (!resp.ok) return { price: null, prevClose: null, currency: null, marketTime: null, isStale: false };
    const json = (await resp.json()) as {
      chart: {
        result: Array<{
          meta: {
            regularMarketPrice?: number;
            chartPreviousClose?: number;
            currency?: string;
            regularMarketTime?: number;
          };
        }>;
      };
    };
    const meta = json.chart?.result?.[0]?.meta ?? {};
    const marketTime = meta.regularMarketTime
      ? new Date(meta.regularMarketTime * 1000).toISOString()
      : null;
    const ageMs = marketTime ? Date.now() - new Date(marketTime).getTime() : Infinity;
    const isStale = ageMs > STALE_THRESHOLD_DAYS * 24 * 60 * 60 * 1000;
    return {
      price: meta.regularMarketPrice ?? null,
      prevClose: meta.chartPreviousClose ?? null,
      currency: meta.currency ?? null,
      marketTime,
      isStale,
    };
  } catch {
    return { price: null, prevClose: null, currency: null, marketTime: null, isStale: false };
  }
}

router.get("/feeds/commodities", async (_req, res) => {
  try {
    const data = await withCache("commodities", async () => {
      const quotes = await Promise.all(COMMODITIES.map((c) => fetchCommodityChart(c.symbol)));
      return COMMODITIES.map((c, i) => {
        const q = quotes[i];
        const change =
          q.price != null && q.prevClose != null && !q.isStale ? q.price - q.prevClose : null;
        const changePct =
          change != null && q.prevClose != null && q.prevClose !== 0
            ? (change / q.prevClose) * 100
            : null;
        return {
          ...c,
          price: q.price != null ? q.price.toFixed(2) : null,
          change: change != null ? change.toFixed(2) : null,
          changePct: changePct != null ? changePct.toFixed(2) : null,
          currency: q.currency,
          marketTime: q.marketTime,
          isStale: q.isStale,
        };
      });
    });
    res.json({ commodities: data, cachedAt: new Date().toISOString() });
  } catch {
    res.status(500).json({ error: "Failed to fetch commodity data" });
  }
});

export default router;
