import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  BorderStyle,
  ShadingType,
  Table,
  TableRow,
  TableCell,
  WidthType,
  PageBreak,
} from "docx";
import { writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

function heading1(text: string): Paragraph {
  return new Paragraph({
    text,
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 400, after: 200 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: "7c3aed" } },
  });
}

function heading2(text: string): Paragraph {
  return new Paragraph({
    text,
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 300, after: 150 },
  });
}

function heading3(text: string): Paragraph {
  return new Paragraph({
    text,
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 200, after: 100 },
  });
}

function para(text: string, bold = false): Paragraph {
  return new Paragraph({
    children: [new TextRun({ text, bold, size: 22 })],
    spacing: { before: 80, after: 80 },
  });
}

function bullet(text: string, level = 0): Paragraph {
  return new Paragraph({
    children: [new TextRun({ text, size: 22 })],
    bullet: { level },
    spacing: { before: 60, after: 60 },
  });
}

function code(text: string): Paragraph {
  return new Paragraph({
    children: [new TextRun({ text, font: "Courier New", size: 18, color: "1e1b4b" })],
    shading: { type: ShadingType.SOLID, color: "f0f0f8", fill: "f0f0f8" },
    spacing: { before: 60, after: 60 },
    indent: { left: 360 },
  });
}

function codeBlock(lines: string[]): Paragraph[] {
  return lines.map(line => code(line));
}

function sep(): Paragraph {
  return new Paragraph({ text: "", spacing: { before: 100, after: 100 } });
}

const doc = new Document({
  creator: "Thoucentric",
  title: "Industry Research Pod — Master Build Prompt",
  description: "Complete engineering specification to rebuild the FMCG Intelligence Platform",
  styles: {
    default: {
      document: {
        run: { font: "Calibri", size: 22, color: "1a1a2e" },
      },
    },
  },
  sections: [
    {
      children: [
        // ─── TITLE PAGE ──────────────────────────────────────────────────
        new Paragraph({
          children: [
            new TextRun({
              text: "INDUSTRY RESEARCH POD",
              bold: true,
              size: 56,
              color: "7c3aed",
              font: "Courier New",
            }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { before: 1200, after: 200 },
        }),
        new Paragraph({
          children: [new TextRun({ text: "Master Build Prompt & Engineering Specification", size: 32, color: "4a4a6a" })],
          alignment: AlignmentType.CENTER,
          spacing: { before: 0, after: 200 },
        }),
        new Paragraph({
          children: [new TextRun({ text: "Thoucentric FMCG Intelligence Platform", size: 26, color: "7c3aed", bold: true })],
          alignment: AlignmentType.CENTER,
          spacing: { before: 0, after: 100 },
        }),
        new Paragraph({
          children: [new TextRun({ text: "Version: Production · Data Baseline: May 2025 · Grade: Top 0.001% Prompt Engineering", size: 20, color: "888888" })],
          alignment: AlignmentType.CENTER,
          spacing: { before: 0, after: 2000 },
        }),

        // ─── SECTION 1: PROJECT IDENTITY ─────────────────────────────────
        heading1("1. PROJECT IDENTITY"),
        para(
          "Build a consulting-grade FMCG market intelligence platform called Industry Research Pod " +
          "for Thoucentric, a supply chain and procurement consulting firm. The platform is used " +
          "exclusively by Thoucentric consultants to prepare for CXO client meetings at FMCG companies. " +
          "Every number, insight, benchmark, and signal must be grounded — no vague language, no filler, " +
          'no "it depends" answers. Think McKinsey Horizon meets Bloomberg terminal.'
        ),
        para("Tone: authoritative, dense, data-heavy. Aesthetic: Bloomberg/Palantir dark terminal."),

        // ─── SECTION 2: TECH STACK ───────────────────────────────────────
        heading1("2. TECH STACK (non-negotiable)"),
        bullet("Monorepo: pnpm workspaces (pnpm-workspace.yaml)"),
        bullet("Frontend: React 18 + Vite, TypeScript, Tailwind CSS v3, shadcn/ui components"),
        bullet("Backend: Express.js, TypeScript, Zod input validation"),
        bullet("Database: PostgreSQL + Drizzle ORM (schema-first, migrations via drizzle-kit push)"),
        bullet("AI: OpenAI GPT-4o via streaming SSE (text/event-stream)"),
        bullet("State/Fetching: TanStack React Query v5"),
        bullet("API Contract: OpenAPI 3.0 spec → Orval codegen (React Query hooks + Zod schemas)"),
        bullet("Markdown rendering: react-markdown (for AI chat responses)"),
        bullet("Routing: React Router v6"),
        bullet("Icons: lucide-react"),
        bullet("Fonts: JetBrains Mono (headings, badges, labels) + system sans (body)"),
        sep(),
        heading3("Package Structure:"),
        ...codeBlock([
          "/",
          "├── artifacts/",
          "│   ├── api-server/          # Express API (@workspace/api-server)",
          "│   └── research-pod/        # React+Vite frontend (@workspace/research-pod)",
          "├── lib/",
          "│   ├── db/                  # Drizzle schema + client (@workspace/db)",
          "│   ├── api-spec/            # OpenAPI spec + Orval codegen (@workspace/api-spec)",
          "│   └── integrations-openai-ai-server/  # OpenAI client",
          "├── pnpm-workspace.yaml",
          "└── tsconfig.base.json",
        ]),
        sep(),
        para("Each artifact binds to the PORT env variable (never hard-code ports). " +
             "The proxy routes /api → api-server. Frontend uses relative URLs only (never localhost)."),

        // ─── SECTION 3: DATABASE SCHEMA ──────────────────────────────────
        heading1("3. DATABASE SCHEMA"),
        para("All tables live in lib/db/src/schema/. Export everything via lib/db/src/index.ts. " +
             "Use Drizzle ORM with pgTable, text, integer, boolean, timestamp, jsonb."),

        heading2("3a. companies table"),
        ...codeBlock([
          "id: serial PK",
          "name: text NOT NULL           // short ticker-style: 'HUL', 'NESTLE', 'ITC'",
          "fullName: text NOT NULL       // 'Hindustan Unilever Limited'",
          "geography: text NOT NULL      // 'India', 'India / Global', 'Global'",
          "revenue: text                 // '₹59,579 Cr (FY24)'",
          "revenueGrowth: text           // '+2.8% YoY'",
          "ebitdaMargin: text            // '23.4%'",
          "marketCap: text              // '₹5.2L Cr'",
          "categories: text             // 'Home Care · Personal Care · Foods & Refreshment'",
          "quickTake: text              // 2-sentence consulting summary",
          "openProblems: text           // 'Demand sensing failure in q-comm (₹400 Cr WC impact)...'",
          "scIntelligence: text         // SC-specific intelligence paragraph",
          "strategicPriorities: text    // FY26 strategic priorities paragraph",
          "consultingAngle: text        // How Thoucentric can engage",
          "sheiScore: integer           // 0-100 composite SHEI readiness score",
          "lastUpdated: text            // 'Q4 FY25'",
        ]),

        heading2("3b. shei_cards table (SHEI = Supply chain, Human capital, ESG, Innovation)"),
        ...codeBlock([
          "id: serial PK",
          "title: text NOT NULL",
          "functionTag: text NOT NULL   // 'SUPPLY_CHAIN'|'PROCUREMENT'|'DISTRIBUTION'|'ESG'|'DIGITAL'",
          "urgency: text NOT NULL       // 'CRITICAL'|'HIGH'|'MEDIUM'",
          "signal: text NOT NULL        // The observable trend (2-3 sentences, with numbers)",
          "hypothesis: text NOT NULL    // Consulting hypothesis statement",
          "evidence: text NOT NULL      // Specific data points, company examples, financials",
          "clientImplication: text NOT NULL",
          "financialImpact: text NOT NULL  // ₹Cr or % impact, quantified",
          "thoucentriqAngle: text NOT NULL // Specific Thoucentric service line entry point",
          "relatedCompanies: text[]     // ['HUL', 'Marico', 'Nestlé India']",
          "whyNow: text NOT NULL        // Why this hypothesis is urgent NOW",
          "quarter: text                // 'Q1 FY26'",
          "nextReview: text             // '2025-07-01'",
        ]),

        heading2("3c. signals table"),
        ...codeBlock([
          "id: serial PK",
          "summary: text NOT NULL       // Headline: '[Company]: [Event] — [Impact]'",
          "category: text NOT NULL      // 'SUPPLY_CHAIN'|'PROCUREMENT'|'DISTRIBUTION_GTM'|'DIGITAL'|'ESG'",
          "action: text NOT NULL DEFAULT 'MONITOR'  // 'ACT_NOW'|'INVESTIGATE'|'MONITOR'",
          "source: text                 // 'HUL Q4 FY25 Earnings Call / BSE Filing April 24, 2025'",
          "publishedDate: text          // '2025-04-24' — always recent (Q4 FY25 / Q1 FY26)",
          "quarter: text                // 'Q4 FY25' or 'Q1 FY26'",
          "eventType: text              // 'EARNINGS_SIGNAL'|'MACRO_EVENT'|'INDUSTRY_REPORT'|'REGULATION'|'DISRUPTION'",
          "strength: text               // 'HIGH'|'MEDIUM'|'LOW'",
          "companyName: text            // 'HUL' or 'All FMCG' for sector-wide signals",
          "financialImpact: text        // Quantified financial impact paragraph",
          "scRelevance: text            // Why this matters for SC/procurement consulting",
        ]),

        heading2("3d. benchmarks table"),
        ...codeBlock([
          "id: serial PK",
          "kpiName: text NOT NULL       // 'Forecast Accuracy (MAPE)'",
          "functionTag: text NOT NULL   // 'SUPPLY_CHAIN'|'PROCUREMENT'|'DISTRIBUTION'|'DIGITAL'",
          "bestInClass: text NOT NULL   // 'MAPE 8% (HUL, Nestlé India)'",
          "industryMedian: text NOT NULL // '18–22% MAPE'",
          "laggard: text NOT NULL       // '>30% MAPE'",
          "unit: text                   // '%', 'days', 'x', '₹Cr'",
          "whyItMatters: text NOT NULL",
          "companyExamples: text NOT NULL",
          "indiaContext: text NOT NULL  // India-specific context",
          "thoucentricBenchmark: text   // Thoucentric's proprietary benchmark if available",
        ]),

        heading2("3e. playbook_sections table"),
        ...codeBlock([
          "id: serial PK",
          "title: text NOT NULL",
          "functionTag: text NOT NULL",
          "sectionNumber: integer NOT NULL",
          "status: text NOT NULL        // 'ACTIVE'|'DRAFT'|'ARCHIVED'",
          "whyItMatters: text NOT NULL",
          "targetClient: text",
          "entryPoint: text",
          "deliverables: text",
          "timeline: text",
          "valueCapture: text",
        ]),

        // ─── SECTION 4: DATA SEEDING ──────────────────────────────────────
        heading1("4. DATA SEEDING STRATEGY"),
        para("Seed runs on every API server startup via seedDatabase(force=true). It clears all tables " +
             "(companies → shei_cards → signals → benchmarks → playbooks) and reseeds the full dataset. " +
             "This ensures data is always current. No conditional skip — always force reseed."),

        heading2("Companies — seed exactly 35:"),
        bullet("India-listed FMCG (18): HUL, Nestlé India, ITC, Marico, Dabur, Britannia, Godrej Consumer, " +
               "Colgate-Palmolive India, Emami, Tata Consumer Products, Bikaji Foods, Honasa/Mamaearth, " +
               "Patanjali Foods, Varun Beverages, Jyothy Labs, Zydus Wellness, CCL Products, Heritage Foods"),
        bullet("India unlisted / co-operative (4): Amul (GCMMF), Haldiram's, Wagh Bakri, MDH Spices"),
        bullet("Global majors with India ops (8): P&G India, Mars India, Reckitt India, Kellogg India (now Mars), " +
               "Mondelez India, PepsiCo India, Coca-Cola India, Perfetti Van Melle India"),
        bullet("Global FMCG (5): Unilever (global), Nestlé S.A. (global), Ekaterra/Lipton, Goodricke Group, Kraft Heinz"),
        para("Fill ALL fields for every company: revenue (FY25 actuals), ebitdaMargin, marketCap, categories, " +
             "quickTake (exactly 2 sentences, consulting grade), openProblems (specific gaps with ₹Cr impact), " +
             "scIntelligence, strategicPriorities (FY26), consultingAngle, sheiScore, lastUpdated: 'Q4 FY25'."),

        heading2("SHEI Cards — seed exactly 7:"),
        bullet("Quick-Commerce SC Architecture (CRITICAL)"),
        bullet("Cocoa/Commodity Procurement Crisis (HIGH)"),
        bullet("India EPR Compliance Programme (HIGH)"),
        bullet("D2C to Omnichannel Distribution Transformation (HIGH)"),
        bullet("Post-Carve-Out SC Independence (HIGH)"),
        bullet("Tea Origin Diversification (MEDIUM)"),
        bullet("AI Demand Sensing Adoption (MEDIUM)"),
        para("Each card must have specific financialImpact (₹Cr or €M), company examples with numbers, " +
             "and a sharp whyNow reason tied to Q4 FY25 / Q1 FY26 events."),

        heading2("Signals — seed exactly 15:"),
        para("All publishedDate values must be in range 2025-04-05 to 2025-05-09. Quarter: 'Q4 FY25' or 'Q1 FY26'."),
        bullet("Mondelez cocoa crisis ($9,200/ton sustained — 330bps gross margin compression)"),
        bullet("Quick-commerce ₹5,000 Cr GMV milestone crossed (55%+ YoY, Blinkit 1,000+ dark stores)"),
        bullet("HUL Q4 FY25 earnings (₹800 Cr SC modernisation capex, ₹400 Cr WC tied in q-comm buffer)"),
        bullet("Marico Q4 FY25 (Parachute recovery, inventory days 54 vs 48-day target)"),
        bullet("Mars India pet food ₹5,200 Cr category, Royal Canin vet-clinic SC network expansion"),
        bullet("Ekaterra SAP go-live delayed 6 months (TSA extension cost €50–80M)"),
        bullet("Kenya 2025 tea crop at 73% of historical (Mombasa auction prices still elevated)"),
        bullet("Darjeeling first flush 2025 -25% yield (second consecutive year — structural climate risk confirmed)"),
        bullet("Wagh Bakri national expansion capex ₹200 Cr announced"),
        bullet("Tata Consumer Q4 FY25: Tetley UK SAP integration complete, £12–18M synergies still unrealised"),
        bullet("Amul ice cream FY25 ₹5,200 Cr, ₹700–900 Cr cold chain investment needed"),
        bullet("India EPR enforcement: 147 FMCG companies issued show-cause notices Q4 FY25"),
        bullet("Bikaji Foods Q4 FY25: 3.1M outlets, frozen snack cold chain pilot launched"),
        bullet("Honasa/Mamaearth Q4 FY25: 1.05M offline outlets, EBITDA recovering to 8.2%"),
        bullet("Unilever Ice Cream Company separated April 2025 (€580M one-time cost, 18-month TSA)"),

        heading2("Benchmarks — seed exactly 15:"),
        para("KPIs across supply chain, procurement, distribution, and digital. Include for each: " +
             "bestInClass (with company name), industryMedian, laggard, indiaContext."),
        bullet("Forecast Accuracy (MAPE %) | Inventory Days (DSI) | Perfect Order Rate (%)"),
        bullet("Procurement Cost as % Revenue | Supplier Lead Time (days) | Cash-to-Cash Cycle (days)"),
        bullet("Distribution Reach (% outlets) | On-Shelf Availability (%) | Demand Planning Cycle Time"),
        bullet("SC Cost as % Revenue | Order Fill Rate (%) | Return Rate (%)"),
        bullet("Digital Order Penetration (%) | ESG Scope 3 Intensity | Working Capital as % Revenue"),

        heading2("Playbooks — seed exactly 5:"),
        bullet("Q-Commerce SC Readiness"),
        bullet("Procurement Transformation (Commodity-Led)"),
        bullet("D2C to Omnichannel GTM"),
        bullet("ESG & EPR Compliance SC"),
        bullet("Post-Carve-Out SC Independence"),

        // ─── SECTION 5: API ENDPOINTS ─────────────────────────────────────
        heading1("5. API ENDPOINTS"),
        para("All routes mounted under /api. Define OpenAPI spec FIRST, then generate client hooks with Orval."),
        ...codeBlock([
          "GET  /api/healthz",
          "GET  /api/companies          — filters: geography, category",
          "GET  /api/companies/:id",
          "GET  /api/shei-cards         — filters: urgency, functionTag",
          "GET  /api/shei-cards/:id",
          "GET  /api/signals            — filters: strength, category, action",
          "GET  /api/benchmarks         — filter: functionTag",
          "GET  /api/playbooks",
          "POST /api/ask                — AI chat (streaming SSE)",
          "POST /api/admin/reseed       — manual reseed trigger",
        ]),
        sep(),
        heading3("POST /api/ask — Streaming SSE Specification:"),
        ...codeBlock([
          "// Request body:",
          '{ messages: Array<{ role: "user" | "assistant", content: string }> }',
          "",
          "// Response headers:",
          "Content-Type: text/event-stream",
          "Cache-Control: no-cache",
          "Connection: keep-alive",
          "X-Accel-Buffering: no",
          "",
          "// Each token chunk:",
          'data: {"content": "token"}\n\n',
          "",
          "// On completion:",
          "data: [DONE]\n\n",
          "",
          "// Server implementation:",
          "// 1. Query DB (companies, shei_cards, signals, benchmarks) in parallel Promise.all",
          "// 2. Build system prompt with live DB data injected",
          "// 3. openai.chat.completions.create({ model: 'gpt-4o', stream: true, max_completion_tokens: 2000 })",
          "// 4. for await (const chunk of stream) → res.write()",
          "// 5. Error: if headers not sent → 500 JSON; else write error chunk and end",
        ]),

        // ─── SECTION 6: FRONTEND MODULES ─────────────────────────────────
        heading1("6. FRONTEND MODULES (9 pages + layout)"),

        heading2("Layout (persistent sidebar):"),
        bullet('App name: "INDUSTRY POD" (mono font, green/purple accent)'),
        bullet('Subtitle: "Thoucentric FMCG Intelligence"'),
        bullet("Navigation groups: INTELLIGENCE (Dashboard, Companies, SHEI Cards, Benchmarks) | SIGNALS (Signal Tracker, Timeline) | ACTIVATION (Actions, Ask Anything [AI badge], Playbooks)"),
        bullet('"Refresh Data" button at sidebar bottom (triggers POST /api/admin/reseed + React Query invalidation)'),
        bullet("Sidebar width: 240px fixed. Background: #0d0d14. Main content: flex-1 overflow-y-auto"),

        heading2("Page 1: Dashboard (/)"),
        bullet("Stats row: total companies, active SHEI hypotheses, live signals, benchmarks"),
        bullet("Top Signals This Week: 3 highest-strength signals with action badges"),
        bullet("SHEI card carousel (3-wide): urgency badge, title, financialImpact snippet"),
        bullet("Quick links to all modules"),

        heading2("Page 2: Companies (/companies)"),
        bullet("Filter bar: Geography, Category search, SHEI score sort"),
        bullet("Company cards grid (3-wide): name, geography, revenue, ebitdaMargin, quickTake"),
        bullet("Click → Detail modal with tabs: Overview | SC Intelligence | Strategic Priorities | Open Problems | Consulting Angle"),
        bullet("Related signals and SHEI cards shown in detail view"),

        heading2("Page 3: SHEI Cards (/shei)"),
        bullet("Filter: urgency (CRITICAL/HIGH/MEDIUM), functionTag, quarter"),
        bullet("Expanded card: signal → hypothesis → evidence → financialImpact → thoucentriqAngle → whyNow"),
        bullet("Each section prefixed with icon (signal, hypothesis, evidence, impact, angle)"),

        heading2("Page 4: Benchmarks (/benchmarks)"),
        bullet("Filter: functionTag"),
        bullet("Table: KPI Name | Best-in-Class (green) | Industry Median (amber) | Laggard (red) | India Context"),
        bullet("Expandable row: full whyItMatters + companyExamples"),

        heading2("Page 5: Signal Tracker (/signals)"),
        bullet("Filter: strength, category, eventType"),
        bullet("Signal cards: strength badge, category pill, eventType pill, company, quarter, date"),
        bullet("Card body: summary headline, financialImpact (green $ box), scRelevance (blue trend box)"),
        bullet("ACTION badge: ACT_NOW (red border), INVESTIGATE (amber border), MONITOR (blue border)"),

        heading2("Page 6: Trend Timeline (/timeline)"),
        bullet("Vertical timeline sorted by publishedDate descending"),
        bullet("Left axis: months/quarters (Q4 FY25, Q1 FY26)"),
        bullet("Filter: category, strength"),

        heading2("Page 7: Actions & Activation (/actions)"),
        bullet("Derived from signals where action ≠ MONITOR (ACT_NOW + INVESTIGATE only)"),
        bullet("Grouped by action type (ACT_NOW first, then INVESTIGATE)"),
        bullet('"NEW" badge on sidebar nav item'),

        heading2("Page 8: Ask Anything (/ask) — AI STREAMING CHAT"),
        bullet('Header: "Ask Anything" + "Global FMCG" badge (green globe icon)'),
        bullet("Starter questions grid (10 questions, 2-column): cover global companies (Kraft Heinz, Coca-Cola, Diageo, AB InBev, Reckitt, Danone, Nestlé global) AND India companies AND functional topics"),
        bullet("AI typing: skeleton loader while connecting, live token-by-token rendering with cursor blink"),
        bullet('"New chat" button (appears when messages exist, resets conversation)'),
        bullet("Full conversation history passed to API on every request (in-memory, session only)"),
        bullet("AbortController: cancels stream on New Chat or component unmount"),
        bullet('Footer: "Streaming · Conversation memory within session · Grounded in Thoucentric FMCG intelligence"'),

        heading2("Page 9: Playbooks (/playbooks)"),
        bullet("Card grid: title, functionTag, status badge, targetClient"),
        bullet("Expandable: entryPoint, deliverables, timeline, valueCapture"),

        // ─── SECTION 7: AI SYSTEM PROMPT ─────────────────────────────────
        heading1("7. AI SYSTEM PROMPT SPECIFICATION"),
        para("The system prompt must be injected with live DB data on every request. Build it server-side " +
             "from the parallel DB query results before calling OpenAI."),
        sep(),
        ...codeBlock([
          "You are an elite consulting-grade FMCG intelligence engine built for Thoucentric.",
          "You are equivalent to an MBB senior partner with deep FMCG expertise.",
          "",
          "TODAY'S DATE: [inject current date]",
          "",
          "YOUR SCOPE: Answer about ANY FMCG company worldwide — use your full knowledge.",
          "Do not limit to DB companies only. DB data is additional context, not scope limit.",
          "",
          "YOU HAVE ACCESS TO THOUCENTRIC'S PROPRIETARY INTELLIGENCE DATABASE:",
          "",
          "▸ COMPANIES TRACKED ({N} companies):",
          "• {name} | {geography} | Rev: {revenue} | EBITDA: {ebitdaMargin} | Categories: {80 chars} | Open Problems: {120 chars}",
          "",
          "▸ SHEI HYPOTHESIS CARDS ({N} active):",
          "• [{urgency}] {title} ({functionTag})",
          "  Signal: {signal 180 chars}",
          "  Financial Impact: {120 chars}",
          "  Why Now: {100 chars}",
          "",
          "▸ LIVE SIGNALS ({N} signals):",
          "• [{strength}/{eventType}] {companyName} — {summary 120 chars} | SC Angle: {scRelevance 80 chars}",
          "",
          "▸ KPI BENCHMARKS ({N} benchmarks):",
          "• {kpiName} ({functionTag}): Best {bestInClass} | Median {industryMedian} | Laggard {laggard}",
          "",
          "RESPONSE RULES:",
          "1. Answer like an MBB senior partner briefing a FMCG CXO — authoritative, specific, no filler",
          "2. Every insight MUST be data-backed: specific numbers (₹Cr, %, days, $M), names, time periods",
          "3. Use clear markdown: **Bold headers**, bullet points, numbered lists",
          "4. For any company: Revenue/margin context → Supply chain gap → Consulting entry point",
          "5. Always connect insights to Thoucentric consulting opportunities",
          "6. When relevant, compare to best-in-class / median / laggard benchmarks",
          "7. End EVERY response with 2 sharply-worded provocative CXO meeting questions",
          "8. For companies not in DB: use your broad knowledge freely, same analytical depth",
          "9. India queries: add GT vs. MT, rural-urban dynamics, regulatory landscape",
          "10. Be opinionated. State clear views. No wishy-washy 'it depends'",
        ]),

        // ─── SECTION 8: DESIGN SYSTEM ────────────────────────────────────
        heading1("8. DESIGN SYSTEM"),
        ...codeBlock([
          "Background:    #0a0a0f (page), #0d0d14 (sidebar), #13131f (card)",
          "Border:        #1e1e2e (default), #2a2a3d (hover)",
          "Text:          #e2e8f0 (primary), #94a3b8 (muted), #64748b (placeholder)",
          "Primary:       #7c3aed (purple) — buttons, active states, badges",
          "Success/GREEN: #22c55e — ACT_NOW, positive metrics",
          "Warning/AMBER: #f59e0b — INVESTIGATE, MEDIUM urgency",
          "Danger/RED:    #ef4444 — CRITICAL, HIGH strength",
          "Info/BLUE:     #3b82f6 — MONITOR, general info",
          "",
          "Fonts:",
          "  Headings + labels + badges: font-mono (JetBrains Mono)",
          "  Body: system sans-serif",
          "",
          "Key Tailwind classes:",
          "  Cards:   bg-card border border-border rounded-xl p-4",
          "  Hover:   hover:border-primary/50 hover:bg-primary/5 transition-all",
          "  AI cursor blink: inline-block w-1.5 h-3.5 bg-primary/70 animate-pulse rounded-sm",
          "  Page load: animate-in fade-in duration-300",
          "",
          "shadcn/ui components used:",
          "  Badge, Button, Card, Dialog, Drawer, Input, Select, Separator,",
          "  Skeleton, Tabs, Textarea, Tooltip",
        ]),

        // ─── SECTION 9: CONSTRAINTS ───────────────────────────────────────
        heading1("9. HARD CONSTRAINTS"),

        heading2("Data Constraints:"),
        bullet("NEVER use mock or placeholder data. Every number must be a real estimate grounded in public sources (earnings reports, analyst research, industry reports)."),
        bullet("All signal publishedDate values must be in Q4 FY25 / Q1 FY26 (Jan–May 2025)."),
        bullet("All revenue/EBITDA figures must reference FY24 or FY25 actuals with FY26 guidance where disclosed."),
        bullet("Financial impact estimates must include calculation logic (e.g. 'at $9,200/ton cocoa vs $2,600 baseline, every $1,000/ton = ~₹40–60 Cr EBIT')."),

        heading2("Architecture Constraints:"),
        bullet("Define OpenAPI spec BEFORE writing route handlers. Generate client hooks via Orval."),
        bullet("Use Zod schemas (from OpenAPI codegen) to validate all API inputs and outputs."),
        bullet("Use React Query hooks (from OpenAPI codegen) for all data fetching. No raw fetch except in the SSE streaming handler."),
        bullet("Never call service ports directly in application code. Use relative URLs only."),
        bullet("Seed runs force=true on every startup — idempotent clear+reseed. No conditional skip."),

        heading2("AI Constraints:"),
        bullet("Model: gpt-4o specifically (not gpt-3.5, not gpt-4-turbo)."),
        bullet("max_completion_tokens: 2000 — sufficient for consulting-grade answers."),
        bullet("Stream via 'for await (const chunk of stream)' — never buffer and return all at once."),
        bullet("Always inject fresh DB data into system prompt on every request (never cached)."),
        bullet("Pass full conversation history from frontend on every request for multi-turn context."),
        bullet("Handle AbortController gracefully — frontend can cancel mid-stream."),

        heading2("Frontend Constraints:"),
        bullet("All pages: max-w-4xl or max-w-6xl constrained width within main content area."),
        bullet("Skeleton loaders for every async state (never spinners, never blank screens)."),
        bullet("Empty states: icon + headline + subtext (never a blank container)."),
        bullet("All monetary values: ₹ for INR, $ for USD, € for EUR — never abbreviate currency."),
        bullet("Large numbers: '₹59,579 Cr' not '₹59579Cr' — Indian number formatting with Cr/L Cr."),

        heading2("Consulting Framing Constraints:"),
        bullet("Every module must surface a consulting angle — what diagnostic, transformation, or advisory programme does this data support?"),
        bullet("'Thoucentric' must appear in: sidebar subtitle, Ask Anything footer, system prompt, and any about/context visible to users."),
        bullet("Avoid generic language ('synergies', 'leverage', 'best practices') — replace with specific named programmes, quantified impacts, named companies."),

        // ─── SECTION 10: ENVIRONMENT ──────────────────────────────────────
        heading1("10. ENVIRONMENT & DEPLOYMENT"),
        ...codeBlock([
          "Environment variables required:",
          "  PORT                              — assigned by runtime per artifact",
          "  DATABASE_URL                      — PostgreSQL connection string",
          "  SESSION_SECRET                    — for session middleware",
          "  AI_INTEGRATIONS_OPENAI_BASE_URL   — OpenAI proxy base URL",
          "  AI_INTEGRATIONS_OPENAI_API_KEY    — OpenAI proxy API key",
          "",
          "Services:",
          "  api-server   — paths: ['/api'],  port: $PORT",
          "  research-pod — paths: ['/'],     port: $PORT",
          "",
          "DB migration: run 'drizzle-kit push' before first startup.",
          "Seed: triggered automatically on api-server startup (force=true).",
          "Manual reseed: POST /api/admin/reseed or 'Refresh Data' button in sidebar.",
        ]),

        // ─── SECTION 11: QUALITY BAR ──────────────────────────────────────
        heading1("11. PRE-DELIVERY QUALITY CHECKLIST"),
        bullet("[ ] All 35 companies load with full detail (no empty fields visible to user)"),
        bullet("[ ] All 15 signals show with dates in 2025 range and correct action badges"),
        bullet("[ ] All 7 SHEI cards render all sections (signal → hypothesis → evidence → impact → angle)"),
        bullet("[ ] All 15 benchmarks show best/median/laggard with colour coding"),
        bullet("[ ] Ask Anything streams token-by-token (test with a multi-paragraph question)"),
        bullet("[ ] Multi-turn conversation works (follow-up referencing previous answer)"),
        bullet("[ ] Starter questions cover at least 4 global (non-India) FMCG companies"),
        bullet("[ ] Dashboard shows live counts from DB (not hardcoded numbers)"),
        bullet("[ ] Signal Tracker filter works (test ACT_NOW filter — should show ≤5 signals)"),
        bullet("[ ] Empty state displays if filters return 0 results"),
        bullet("[ ] 'Refresh Data' triggers reseed and UI auto-refreshes via React Query invalidation"),
        bullet("[ ] pnpm run typecheck passes clean (zero TypeScript errors)"),
        bullet("[ ] No browser console errors on any page"),
        bullet("[ ] Mobile layout does not break (sidebar scrolls or collapses on narrow viewport)"),

        sep(),
        new Paragraph({
          children: [
            new TextRun({
              text: "— End of Master Build Prompt —",
              bold: true,
              size: 22,
              color: "7c3aed",
              font: "Courier New",
            }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { before: 400 },
        }),
        new Paragraph({
          children: [new TextRun({ text: "Built by Thoucentric × Replit Agent · May 2025", size: 18, color: "888888" })],
          alignment: AlignmentType.CENTER,
        }),
      ],
    },
  ],
});

const buffer = await Packer.toBuffer(doc);
const outputPath = resolve(__dirname, "../../master-prompt-thoucentric.docx");
writeFileSync(outputPath, buffer);
console.log("Written to:", outputPath);
