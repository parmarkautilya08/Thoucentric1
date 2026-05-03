import { useState, useCallback } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Rss, TrendingUp, TrendingDown, Minus, ExternalLink, RefreshCw,
  Newspaper, BarChart3, Building2, ShieldAlert, DollarSign, Globe,
  Zap, Bot, Clock, Tag,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";

const CATEGORIES = [
  { value: "all", label: "All", icon: Globe },
  { value: "FMCG_INDIA", label: "FMCG India", icon: Building2 },
  { value: "FMCG_GLOBAL", label: "FMCG Global", icon: Globe },
  { value: "COMPANY", label: "Company", icon: Building2 },
  { value: "REGULATORY", label: "Regulatory", icon: ShieldAlert },
  { value: "FINANCIAL", label: "Earnings & Financial", icon: DollarSign },
  { value: "COMMODITY", label: "Commodity News", icon: BarChart3 },
];

const CAT_COLOR: Record<string, string> = {
  FMCG_INDIA: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  FMCG_GLOBAL: "bg-violet-500/20 text-violet-400 border-violet-500/30",
  COMPANY: "bg-primary/20 text-primary border-primary/30",
  REGULATORY: "bg-red-500/20 text-red-400 border-red-500/30",
  FINANCIAL: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  COMMODITY: "bg-amber-500/20 text-amber-400 border-amber-500/30",
};

interface Article {
  id: string;
  title: string;
  link: string;
  source: string;
  feedLabel: string;
  category: string;
  publishedAt: string;
  summary: string;
}

interface Commodity {
  symbol: string;
  name: string;
  unit: string;
  relevance: string;
  flag: string;
  price: string | null;
  change: string | null;
  changePct: string | null;
  currency: string | null;
  marketTime: string | null;
  isStale: boolean;
}

function useNews(category: string) {
  return useQuery<{ articles: Article[]; cachedAt: string }>({
    queryKey: ["feeds-news", category],
    queryFn: () =>
      fetch(`/api/feeds/news?category=${category}`).then((r) => {
        if (!r.ok) throw new Error("Failed to fetch news");
        return r.json();
      }),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}

function useCommodities() {
  return useQuery<{ commodities: Commodity[]; cachedAt: string }>({
    queryKey: ["feeds-commodities"],
    queryFn: () =>
      fetch("/api/feeds/commodities").then((r) => {
        if (!r.ok) throw new Error("Failed to fetch commodities");
        return r.json();
      }),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}

function timeAgo(iso: string) {
  try {
    const diff = (Date.now() - new Date(iso).getTime()) / 1000;
    if (diff < 60) return "just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  } catch {
    return "—";
  }
}

function ArticleCard({ article, onAnalyze }: { article: Article; onAnalyze: (a: Article) => void }) {
  return (
    <Card className="border border-border hover:border-primary/40 transition-all group">
      <CardContent className="py-4 space-y-2.5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className={`text-xs shrink-0 ${CAT_COLOR[article.category] ?? ""}`}>
              <Tag className="h-2.5 w-2.5 mr-1" />
              {article.feedLabel}
            </Badge>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {timeAgo(article.publishedAt)}
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onAnalyze(article)}
              className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 border border-primary/30 hover:border-primary/60 bg-primary/5 hover:bg-primary/10 px-2 py-1 rounded-md transition-all font-medium"
            >
              <Bot className="h-3 w-3" />
              Analyze
            </button>
            {article.link && (
              <a
                href={article.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
          </div>
        </div>
        <p className="text-sm font-medium leading-snug group-hover:text-primary transition-colors line-clamp-2">
          {article.title}
        </p>
        {article.summary && (
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
            {article.summary}
          </p>
        )}
        <p className="text-xs text-muted-foreground/60 truncate">
          {article.source}
        </p>
      </CardContent>
    </Card>
  );
}

function CommodityCard({ c }: { c: Commodity }) {
  const pct = c.changePct ? parseFloat(c.changePct) : null;
  const isUp = pct !== null && pct > 0;
  const isDown = pct !== null && pct < 0;

  return (
    <Card className={`border border-border border-l-4 ${isUp ? "border-l-red-500" : isDown ? "border-l-emerald-500" : "border-l-border"}`}>
      <CardContent className="pt-4 pb-4 space-y-2">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">{c.flag}</span>
              <div>
                <div className="font-semibold text-sm font-mono">{c.name}</div>
                <div className="text-xs text-muted-foreground">{c.unit}</div>
              </div>
            </div>
          </div>
          <div className="text-right">
            {c.price ? (
              <>
                <div className="text-lg font-bold font-mono">{c.price}</div>
                <div className={`text-xs font-medium flex items-center justify-end gap-1 ${isUp ? "text-red-400" : isDown ? "text-emerald-400" : "text-muted-foreground"}`}>
                  {isUp ? <TrendingUp className="h-3 w-3" /> : isDown ? <TrendingDown className="h-3 w-3" /> : <Minus className="h-3 w-3" />}
                  {pct !== null ? `${pct > 0 ? "+" : ""}${c.changePct}%` : "—"}
                </div>
              </>
            ) : (
              <div className="text-xs text-muted-foreground italic">Unavailable</div>
            )}
          </div>
        </div>
        <p className="text-xs text-muted-foreground leading-snug border-t border-border/50 pt-2">
          {c.relevance}
        </p>
        {c.marketTime && (
          <p className={`text-[10px] ${c.isStale ? "text-amber-500/70" : "text-muted-foreground/50"}`}>
            {c.isStale ? "⚠ Stale data · " : ""}Updated {timeAgo(c.marketTime)}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export default function Feeds() {
  const [, navigate] = useLocation();
  const [tab, setTab] = useState<"news" | "commodities">("news");
  const [category, setCategory] = useState("all");

  const { data: newsData, isLoading: newsLoading, refetch: refetchNews, isFetching: newsFetching } = useNews(category);
  const { data: commData, isLoading: commLoading, refetch: refetchComm, isFetching: commFetching } = useCommodities();

  const isFetching = tab === "news" ? newsFetching : commFetching;

  const handleRefresh = useCallback(() => {
    if (tab === "news") refetchNews();
    else refetchComm();
  }, [tab, refetchNews, refetchComm]);

  const handleAnalyze = useCallback((article: Article) => {
    const prompt = `Analyze this FMCG news signal and give me a full SHEI framework analysis:

Headline: ${article.title}
Source: ${article.source} (${article.feedLabel})
Published: ${new Date(article.publishedAt).toLocaleDateString("en-IN")}
${article.summary ? `\nSummary: ${article.summary}` : ""}

Please apply the full 9-section pipeline: Signal classification → Pattern → Hypothesis → KPI validation → Financial impact → Decisions required → Thoucentric opportunity → Confidence → CXO questions.`;

    sessionStorage.setItem("rp_ask_prefill", prompt);
    navigate("/ask");
  }, [navigate]);

  const articles = newsData?.articles ?? [];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold font-mono tracking-tight">Live Intelligence Feed</h1>
            <Badge variant="outline" className="border-primary/40 text-primary text-xs gap-1">
              <Rss className="h-3 w-3" /> Live
            </Badge>
          </div>
          <p className="text-muted-foreground mt-1 text-sm">
            Real-time FMCG news · Commodity prices · Company events · Synthesise with AI
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isFetching}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground border border-border rounded-lg px-3 py-2 transition-colors hover:border-border/80 disabled:opacity-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isFetching ? "animate-spin" : ""}`} />
          {isFetching ? "Loading…" : "Refresh"}
        </button>
      </div>

      {/* Tab switcher */}
      <div className="flex gap-1 bg-muted/30 p-1 rounded-lg w-fit border border-border">
        <button
          onClick={() => setTab("news")}
          className={`flex items-center gap-1.5 px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
            tab === "news" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Newspaper className="h-3.5 w-3.5" />
          News & Signals
        </button>
        <button
          onClick={() => setTab("commodities")}
          className={`flex items-center gap-1.5 px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
            tab === "commodities" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <BarChart3 className="h-3.5 w-3.5" />
          Commodity Prices
        </button>
      </div>

      {/* News Tab */}
      {tab === "news" && (
        <div className="space-y-4">
          {/* Category filter chips */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setCategory(cat.value)}
                className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border transition-all font-medium ${
                  category === cat.value
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground bg-card"
                }`}
              >
                <cat.icon className="h-3 w-3" />
                {cat.label}
              </button>
            ))}
          </div>

          {/* Analyze tip */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground bg-primary/5 border border-primary/20 rounded-lg px-3 py-2">
            <Zap className="h-3.5 w-3.5 text-primary shrink-0" />
            Click <span className="text-primary font-semibold mx-1">Analyze</span> on any article to run it through the full SHEI framework via the AI engine.
          </div>

          {newsLoading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => <Skeleton key={i} className="h-28 rounded-xl" />)}
            </div>
          ) : articles.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Rss className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
              <p className="text-muted-foreground">No articles found — try refreshing or changing the category filter</p>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-xs text-muted-foreground">
                {articles.length} articles · Last refreshed{" "}
                {newsData?.cachedAt ? timeAgo(newsData.cachedAt) : "—"}
                {" "}· Cache refreshes every 15 minutes
              </p>
              {articles.map((article) => (
                <ArticleCard key={article.id} article={article} onAnalyze={handleAnalyze} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Commodities Tab */}
      {tab === "commodities" && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground bg-amber-500/5 border border-amber-500/20 rounded-lg px-3 py-2">
            <BarChart3 className="h-3.5 w-3.5 text-amber-400 shrink-0" />
            Live commodity futures via Yahoo Finance · <span className="text-red-400 font-medium">Red border = price rising (cost pressure)</span> · <span className="text-emerald-400 font-medium">Green = falling (margin relief)</span>
          </div>

          {commLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => <Skeleton key={i} className="h-36 rounded-xl" />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {(commData?.commodities ?? []).map((c) => (
                <CommodityCard key={c.symbol} c={c} />
              ))}
            </div>
          )}

          {commData && (
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-mono font-semibold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                <Bot className="h-3.5 w-3.5 text-primary" /> Commodity Intelligence — Analyze with AI
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  "What is the current impact of cocoa and palm oil price movements on India FMCG margins? Which companies are most exposed?",
                  "Wheat and sugar prices are moving — what is the downstream impact on Britannia, ITC, and Varun Beverages supply chains?",
                  "Coffee prices are at multi-year highs — how does this affect Tata Consumer Products and Nestlé India? What should Thoucentric pitch?",
                  "Build a commodity procurement risk matrix for India FMCG across palm oil, cocoa, wheat, and sugar. Which companies are most vulnerable?",
                ].map((q) => (
                  <button
                    key={q}
                    onClick={() => {
                      sessionStorage.setItem("rp_ask_prefill", q);
                      navigate("/ask");
                    }}
                    className="text-left text-xs px-3 py-2.5 rounded-lg border border-border bg-card hover:border-primary/50 hover:bg-primary/5 text-muted-foreground hover:text-foreground transition-all flex items-start gap-2"
                  >
                    <Zap className="h-3 w-3 text-primary shrink-0 mt-0.5" />
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
