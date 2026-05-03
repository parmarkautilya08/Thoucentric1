import { createRequire } from "module";
import { writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const require = createRequire(import.meta.url);
const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  BorderStyle,
  Table,
  TableRow,
  TableCell,
  WidthType,
  ShadingType,
  PageBreak,
  UnderlineType,
  convertInchesToTwip,
} = require("/tmp/node_modules/docx/dist/index.cjs");

const __dirname = dirname(fileURLToPath(import.meta.url));

// ─── Helpers ───────────────────────────────────────────────────────────────

const BRAND = "#1a1a2e";
const ACCENT = "#4f46e5";
const LIGHT_BG = "F0F0FF";

function h1(text) {
  return new Paragraph({
    text,
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 480, after: 200 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: "4f46e5", space: 6 } },
  });
}

function h2(text) {
  return new Paragraph({
    children: [new TextRun({ text, bold: true, size: 28, color: "1a1a2e" })],
    spacing: { before: 360, after: 120 },
  });
}

function h3(text) {
  return new Paragraph({
    children: [new TextRun({ text, bold: true, size: 24, color: "4f46e5" })],
    spacing: { before: 240, after: 80 },
  });
}

function para(text, opts = {}) {
  return new Paragraph({
    children: [new TextRun({ text, size: 20, color: opts.color || "222222", ...opts })],
    spacing: { after: 100 },
    indent: opts.indent ? { left: convertInchesToTwip(0.3) } : undefined,
  });
}

function bullet(text, level = 0) {
  return new Paragraph({
    children: [new TextRun({ text, size: 20 })],
    bullet: { level },
    spacing: { after: 60 },
  });
}

function codeBlock(lines) {
  const children = typeof lines === "string" ? lines.split("\n") : lines;
  return new Paragraph({
    children: children.map((line, i) => [
      new TextRun({ text: line, font: "Courier New", size: 16, color: "1e1e2e" }),
      ...(i < children.length - 1 ? [new TextRun({ text: "\n", font: "Courier New", size: 16 })] : []),
    ]).flat(),
    shading: { type: ShadingType.CLEAR, fill: "F4F4F8" },
    spacing: { after: 160 },
    border: {
      left: { style: BorderStyle.SINGLE, size: 8, color: "4f46e5", space: 4 },
    },
    indent: { left: convertInchesToTwip(0.2), right: convertInchesToTwip(0.2) },
  });
}

function pageBreak() {
  return new Paragraph({ children: [new PageBreak()] });
}

function sectionBanner(num, title) {
  return new Paragraph({
    children: [
      new TextRun({ text: `SECTION ${num}  `, bold: true, size: 32, color: "ffffff" }),
      new TextRun({ text: title, bold: true, size: 32, color: "ffffff" }),
    ],
    shading: { type: ShadingType.CLEAR, fill: "4f46e5" },
    spacing: { before: 480, after: 240 },
    indent: { left: convertInchesToTwip(0.2) },
  });
}

function infoBox(label, content) {
  return new Paragraph({
    children: [
      new TextRun({ text: `${label}: `, bold: true, size: 20, color: "4f46e5" }),
      new TextRun({ text: content, size: 20, color: "333333" }),
    ],
    shading: { type: ShadingType.CLEAR, fill: LIGHT_BG },
    spacing: { after: 80 },
    indent: { left: convertInchesToTwip(0.15), right: convertInchesToTwip(0.15) },
  });
}

function tableRow2(col1, col2, header = false) {
  return new TableRow({
    children: [
      new TableCell({
        children: [new Paragraph({ children: [new TextRun({ text: col1, bold: header, size: 18, color: header ? "ffffff" : "222222" })] })],
        width: { size: 35, type: WidthType.PERCENTAGE },
        shading: header ? { type: ShadingType.CLEAR, fill: "4f46e5" } : undefined,
      }),
      new TableCell({
        children: [new Paragraph({ children: [new TextRun({ text: col2, bold: header, size: 18, color: header ? "ffffff" : "333333" })] })],
        width: { size: 65, type: WidthType.PERCENTAGE },
        shading: header ? { type: ShadingType.CLEAR, fill: "4f46e5" } : undefined,
      }),
    ],
  });
}

function table2col(rows) {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: rows.map((r, i) => tableRow2(r[0], r[1], i === 0)),
  });
}

// ─── Document assembly ─────────────────────────────────────────────────────

const doc = new Document({
  creator: "Thoucentric",
  title: "Industry Research Pod — Full Technical Blueprint",
  description: "Complete system documentation for rebuild-from-scratch",
  styles: {
    default: {
      document: { run: { font: "Calibri", size: 20 } },
    },
  },
  sections: [
    {
      properties: {
        page: {
          margin: {
            top: convertInchesToTwip(1),
            bottom: convertInchesToTwip(1),
            left: convertInchesToTwip(1.1),
            right: convertInchesToTwip(1.1),
          },
        },
      },
      children: [

        // ─── COVER PAGE ───────────────────────────────────────────────────
        new Paragraph({ children: [new TextRun({ text: "", size: 1 })], spacing: { before: 2400 } }),
        new Paragraph({
          children: [new TextRun({ text: "INDUSTRY RESEARCH POD", bold: true, size: 72, color: "4f46e5" })],
          alignment: AlignmentType.CENTER,
          spacing: { after: 160 },
        }),
        new Paragraph({
          children: [new TextRun({ text: "Full Technical Blueprint & System Documentation", bold: true, size: 32, color: "333333" })],
          alignment: AlignmentType.CENTER,
          spacing: { after: 120 },
        }),
        new Paragraph({
          children: [new TextRun({ text: "Thoucentric FMCG Intelligence Platform", size: 24, color: "666666" })],
          alignment: AlignmentType.CENTER,
          spacing: { after: 80 },
        }),
        new Paragraph({
          children: [new TextRun({ text: "Consulting-Grade Signal Intelligence for FMCG India & Global", italics: true, size: 22, color: "888888" })],
          alignment: AlignmentType.CENTER,
          spacing: { after: 600 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "Version 1.0  ·  May 2026  ·  Confidential — Internal Use Only", size: 18, color: "aaaaaa" }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { after: 80 },
        }),
        new Paragraph({
          children: [new TextRun({ text: "Contains: Architecture · Source Code · DB Schema · Prompts · Setup Guide · Execution Flow", size: 18, color: "aaaaaa" })],
          alignment: AlignmentType.CENTER,
        }),
        pageBreak(),

        // ─── TABLE OF CONTENTS ────────────────────────────────────────────
        h1("Table of Contents"),
        ...[
          ["Section 1", "System Overview & Architecture"],
          ["Section 2", "Complete File Tree"],
          ["Section 3", "Full Source Code — Backend"],
          ["Section 4", "Full Source Code — Frontend"],
          ["Section 5", "Database Schema (Drizzle ORM)"],
          ["Section 6", "AI Prompt System"],
          ["Section 7", "Data Pipeline & Seeding"],
          ["Section 8", "Knowledge Graph & Data Relationships"],
          ["Section 9", "Environment Configuration & Setup Guide"],
          ["Section 10", "Execution Flow & Request Lifecycle"],
        ].map(([sec, title]) =>
          new Paragraph({
            children: [
              new TextRun({ text: sec, bold: true, size: 20, color: "4f46e5" }),
              new TextRun({ text: `  —  ${title}`, size: 20, color: "333333" }),
            ],
            spacing: { after: 80 },
          })
        ),
        pageBreak(),

        // ═══════════════════════════════════════════════════════════════════
        // SECTION 1 — SYSTEM OVERVIEW
        // ═══════════════════════════════════════════════════════════════════
        sectionBanner("1", "System Overview & Architecture"),

        h2("1.1  Platform Purpose"),
        para("Industry Research Pod is a consulting-grade FMCG intelligence platform built exclusively for Thoucentric consultants. It provides real-time signal tracking, structured hypothesis management, KPI benchmarking, live news feeds, AI-powered analysis, and meeting-preparation tools — all focused on the India and global FMCG sector."),
        para("The platform applies the proprietary SHEI framework (Signal → Hypothesis → Evidence → Implication) to convert raw market data into CXO-ready consulting intelligence."),

        h2("1.2  Architectural Overview"),
        para("The system is a pnpm monorepo with two main deployable artifacts communicating through a shared reverse proxy. All traffic enters through a path-based router on port 80."),

        codeBlock([
          "┌────────────────────────────────────────────────────────────┐",
          "│                  Replit Shared Proxy (port 80)             │",
          "│         Path-based routing  (most-specific-first)          │",
          "├────────────────────────────────┬───────────────────────────┤",
          "│  /api/*  →  api-server :8080   │  /*  →  research-pod :3000│",
          "└────────────────────────────────┴───────────────────────────┘",
          "         │                                    │",
          "         ▼                                    ▼",
          "┌────────────────────┐          ┌────────────────────────────┐",
          "│  Express 5 Server  │          │  React 19 + Vite SPA       │",
          "│  TypeScript ESM    │          │  TailwindCSS v4            │",
          "│  Drizzle ORM       │          │  TanStack Query            │",
          "│  OpenAI GPT-4o SSE │          │  Wouter routing            │",
          "│  pino logging      │          │  Recharts + Radix UI       │",
          "└────────┬───────────┘          └────────────────────────────┘",
          "         │",
          "         ▼",
          "┌────────────────────┐",
          "│  PostgreSQL DB     │",
          "│  @workspace/db     │",
          "│  (Drizzle schema)  │",
          "└────────────────────┘",
        ]),

        h2("1.3  Monorepo Package Graph"),
        table2col([
          ["Package", "Purpose"],
          ["@workspace/api-server", "Express backend — all REST routes, AI proxy, RSS feed aggregation"],
          ["@workspace/research-pod", "React SPA — all 13 pages, sidebar navigation, data visualisation"],
          ["@workspace/db", "Drizzle ORM schema, PostgreSQL pool, type exports"],
          ["@workspace/api-spec", "OpenAPI 3.x spec (contract-first source of truth)"],
          ["@workspace/api-zod", "Zod schemas generated from OpenAPI spec (request/response validation)"],
          ["@workspace/api-client-react", "TanStack Query hooks generated from OpenAPI spec"],
          ["@workspace/integrations-openai-ai-server", "OpenAI SDK singleton with Replit AI Integration proxy"],
          ["@workspace/scripts", "Utility scripts (doc gen, migrations, etc.)"],
        ]),

        h2("1.4  Technology Stack"),
        table2col([
          ["Technology", "Version / Detail"],
          ["Node.js runtime", "LTS 20+ (NixOS, Linux x64)"],
          ["Package manager", "pnpm 9 with workspace catalog pinning"],
          ["Backend framework", "Express 5 (ESM, TypeScript strict mode)"],
          ["Frontend framework", "React 19.1.0 + Vite 7 + TailwindCSS 4"],
          ["Database ORM", "Drizzle ORM 0.45 on node-postgres pool"],
          ["Database", "PostgreSQL (Replit-provisioned, accessed via DATABASE_URL)"],
          ["AI provider", "OpenAI GPT-4o via Replit AI Integrations proxy"],
          ["AI streaming", "Server-Sent Events (SSE) — text/event-stream"],
          ["HTTP client hooks", "TanStack React Query 5 (generated)"],
          ["Component library", "shadcn/ui (Radix UI primitives + Tailwind CVA)"],
          ["Routing (frontend)", "Wouter 3 (path-based, BASE_PATH aware)"],
          ["Charts", "Recharts 2"],
          ["Icons", "Lucide React 0.545, React Icons 5"],
          ["Logging (backend)", "Pino 9 + pino-http 10 (structured JSON, pino-pretty in dev)"],
          ["RSS parsing", "rss-parser 3.13"],
          ["Commodity prices", "Yahoo Finance chart API (v8, no key required)"],
          ["Build (backend)", "esbuild 0.27 (custom build.mjs, esm output)"],
          ["Animations", "Framer Motion 12"],
          ["Markdown rendering", "react-markdown 10"],
        ]),

        h2("1.5  Key Design Decisions"),
        bullet("Contract-first API: OpenAPI spec drives Zod schemas and React Query hooks via Orval codegen. Server validates with Zod; client consumes typed hooks."),
        bullet("Name-based routing for stable URLs: Companies resolved by name string (not numeric id) so URLs never break when data is re-seeded."),
        bullet("SHEI cards resolved by cardId string for same reason."),
        bullet("SSE streaming for AI: GPT-4o responses stream token-by-token through Server-Sent Events — no WebSocket overhead."),
        bullet("Auto-seed on startup: seedDatabase() is called in app.ts on every server start — idempotent (truncate + reinsert). Consultants always see consistent curated data."),
        bullet("No auth: Platform is internal-only; auth intentionally omitted for frictionless use."),
        bullet("Dark-first UI: document.documentElement.classList.add('dark') applied in App.tsx on mount — no theme toggle needed."),
        bullet("15-minute RSS cache: withCache() in feeds.ts prevents Google News rate-limiting on rapid page refreshes."),
        pageBreak(),

        // ═══════════════════════════════════════════════════════════════════
        // SECTION 2 — FILE TREE
        // ═══════════════════════════════════════════════════════════════════
        sectionBanner("2", "Complete File Tree"),

        codeBlock([
          "artifacts-monorepo/",
          "├── pnpm-workspace.yaml          # Workspace catalog, package discovery, overrides",
          "├── tsconfig.base.json           # Shared strict TS defaults",
          "├── tsconfig.json                # Solution file (libs only)",
          "├── package.json                 # Root tooling (typescript, eslint, prettier)",
          "│",
          "├── artifacts/",
          "│   ├── api-server/              # @workspace/api-server",
          "│   │   ├── package.json",
          "│   │   ├── tsconfig.json",
          "│   │   ├── build.mjs            # esbuild bundler script",
          "│   │   └── src/",
          "│   │       ├── index.ts         # HTTP server entry — reads PORT, calls app.listen()",
          "│   │       ├── app.ts           # Express app — middleware, /api router, auto-seed",
          "│   │       ├── lib/",
          "│   │       │   └── logger.ts    # Pino singleton (pretty in dev, JSON in prod)",
          "│   │       └── routes/",
          "│   │           ├── index.ts     # Router composition (all sub-routers)",
          "│   │           ├── health.ts    # GET /api/healthz",
          "│   │           ├── companies.ts # CRUD /api/companies",
          "│   │           ├── shei_cards.ts# CRUD /api/shei-cards",
          "│   │           ├── signals.ts   # CRUD /api/signals",
          "│   │           ├── benchmarks.ts# CRUD /api/benchmarks",
          "│   │           ├── playbooks.ts # CRUD /api/playbooks",
          "│   │           ├── dashboard.ts # GET /api/dashboard/* (4 summary endpoints)",
          "│   │           ├── admin.ts     # POST /api/admin/reseed",
          "│   │           ├── ask.ts       # POST /api/ask — GPT-4o SSE with master system prompt",
          "│   │           ├── feeds.ts     # GET /api/feeds/news|sources|commodities",
          "│   │           └── seed.ts      # seedDatabase() — 2700-line curated dataset",
          "│",
          "│   ├── research-pod/            # @workspace/research-pod",
          "│   │   ├── package.json",
          "│   │   ├── tsconfig.json",
          "│   │   ├── vite.config.ts       # Vite config — reads PORT + BASE_PATH from env",
          "│   │   ├── index.html",
          "│   │   └── src/",
          "│   │       ├── main.tsx         # React DOM root",
          "│   │       ├── App.tsx          # QueryClient + Router + Layout wiring",
          "│   │       ├── components/",
          "│   │       │   ├── layout.tsx   # Sidebar navigation + refresh button + NEW badges",
          "│   │       │   └── ui/          # shadcn/ui primitives (card, badge, button, etc.)",
          "│   │       └── pages/",
          "│   │           ├── dashboard.tsx      # Command Centre (5 stat cards + 2 live panels)",
          "│   │           ├── companies.tsx      # Company roster with tier/geo filters",
          "│   │           ├── company-detail.tsx # Full company profile + linked SHEI + signals",
          "│   │           ├── shei-cards.tsx     # Hypothesis library with urgency filters",
          "│   │           ├── shei-card-detail.tsx # Full SHEI hypothesis card",
          "│   │           ├── signals.tsx        # Signal tracker + Add Signal modal (58 signals)",
          "│   │           ├── timeline.tsx       # Chronological signal timeline",
          "│   │           ├── benchmarks.tsx     # KPI benchmark table + positioning bar",
          "│   │           ├── playbooks.tsx      # Consulting playbook sections",
          "│   │           ├── actions.tsx        # Priority action recommendations",
          "│   │           ├── ask.tsx            # Chat interface → /api/ask SSE stream",
          "│   │           ├── feeds.tsx          # Live RSS feeds + commodity price ticker",
          "│   │           ├── meeting-prep.tsx   # AI pre-meeting brief generator",
          "│   │           └── not-found.tsx      # 404 page",
          "│",
          "├── lib/",
          "│   ├── db/                      # @workspace/db",
          "│   │   ├── package.json",
          "│   │   ├── tsconfig.json",
          "│   │   └── src/",
          "│   │       ├── index.ts         # Drizzle pool + db export, re-exports schema",
          "│   │       └── schema/",
          "│   │           ├── index.ts     # Barrel export",
          "│   │           ├── companies.ts # companies table",
          "│   │           ├── shei_cards.ts# shei_cards table",
          "│   │           ├── signals.ts   # signals table",
          "│   │           ├── benchmarks.ts# benchmarks table",
          "│   │           ├── playbooks.ts # playbook_sections table",
          "│   │           ├── conversations.ts # conversations table (scaffold)",
          "│   │           └── messages.ts  # messages table (scaffold)",
          "│   ├── api-spec/                # @workspace/api-spec  (OpenAPI YAML)",
          "│   ├── api-zod/                 # @workspace/api-zod   (Zod schemas, codegen output)",
          "│   └── api-client-react/        # @workspace/api-client-react (React Query hooks)",
          "│",
          "├── scripts/                     # @workspace/scripts",
          "│   └── src/                     # Utility scripts",
          "│",
          "└── exports/                     # Generated deliverable files",
          "    ├── Industry_Research_Pod_Build_Log.docx",
          "    ├── App_Screenshots_Gallery.html",
          "    └── Industry_Research_Pod_Deliverables.zip",
        ]),
        pageBreak(),

        // ═══════════════════════════════════════════════════════════════════
        // SECTION 3 — BACKEND SOURCE CODE
        // ═══════════════════════════════════════════════════════════════════
        sectionBanner("3", "Full Source Code — Backend"),

        h2("3.1  artifacts/api-server/src/index.ts"),
        codeBlock([
          `import app from "./app";`,
          `import { logger } from "./lib/logger";`,
          ``,
          `const rawPort = process.env["PORT"];`,
          `if (!rawPort) throw new Error("PORT environment variable is required.");`,
          `const port = Number(rawPort);`,
          `if (Number.isNaN(port) || port <= 0) throw new Error(\`Invalid PORT: "\${rawPort}"\`);`,
          ``,
          `app.listen(port, (err) => {`,
          `  if (err) { logger.error({ err }, "Error listening on port"); process.exit(1); }`,
          `  logger.info({ port }, "Server listening");`,
          `});`,
        ]),

        h2("3.2  artifacts/api-server/src/app.ts"),
        codeBlock([
          `import express, { type Express } from "express";`,
          `import cors from "cors";`,
          `import pinoHttp from "pino-http";`,
          `import router from "./routes";`,
          `import { logger } from "./lib/logger";`,
          `import { seedDatabase } from "./routes/seed";`,
          ``,
          `const app: Express = express();`,
          ``,
          `app.use(pinoHttp({`,
          `  logger,`,
          `  serializers: {`,
          `    req(req) { return { id: req.id, method: req.method, url: req.url?.split("?")[0] }; },`,
          `    res(res) { return { statusCode: res.statusCode }; },`,
          `  },`,
          `}));`,
          `app.use(cors());`,
          `app.use(express.json());`,
          `app.use(express.urlencoded({ extended: true }));`,
          ``,
          `app.use("/api", router);`,
          ``,
          `// Auto-seed on startup — idempotent (truncate + reinsert)`,
          `seedDatabase().catch((err) => {`,
          `  logger.error({ err }, "Failed to seed database");`,
          `});`,
          ``,
          `export default app;`,
        ]),

        h2("3.3  artifacts/api-server/src/lib/logger.ts"),
        codeBlock([
          `import pino from "pino";`,
          ``,
          `const isProduction = process.env.NODE_ENV === "production";`,
          ``,
          `export const logger = pino({`,
          `  level: process.env.LOG_LEVEL ?? "info",`,
          `  redact: ["req.headers.authorization", "req.headers.cookie", "res.headers['set-cookie']"],`,
          `  ...(isProduction ? {} : {`,
          `    transport: { target: "pino-pretty", options: { colorize: true } },`,
          `  }),`,
          `});`,
        ]),

        h2("3.4  artifacts/api-server/src/routes/index.ts"),
        codeBlock([
          `import { Router, type IRouter } from "express";`,
          `import healthRouter from "./health";`,
          `import companiesRouter from "./companies";`,
          `import sheiCardsRouter from "./shei_cards";`,
          `import signalsRouter from "./signals";`,
          `import benchmarksRouter from "./benchmarks";`,
          `import playbooksRouter from "./playbooks";`,
          `import dashboardRouter from "./dashboard";`,
          `import adminRouter from "./admin";`,
          `import askRouter from "./ask";`,
          `import feedsRouter from "./feeds";`,
          ``,
          `const router: IRouter = Router();`,
          ``,
          `router.use(healthRouter);`,
          `router.use(companiesRouter);`,
          `router.use(sheiCardsRouter);`,
          `router.use(signalsRouter);`,
          `router.use(benchmarksRouter);`,
          `router.use(playbooksRouter);`,
          `router.use(dashboardRouter);`,
          `router.use(adminRouter);`,
          `router.use(askRouter);`,
          `router.use(feedsRouter);`,
          ``,
          `export default router;`,
        ]),

        h2("3.5  routes/companies.ts — Dual-lookup (ID or name string)"),
        para("Key design: GET /api/companies/:id accepts either a numeric database ID or the company's short name string (e.g. 'HUL'), allowing stable URL-based navigation without knowing internal IDs."),
        codeBlock([
          `router.get("/companies/:id", async (req, res) => {`,
          `  const rawId = req.params.id;`,
          `  const numId = Number(rawId);`,
          `  let company;`,
          `  if (!isNaN(numId) && Number.isInteger(numId) && numId > 0) {`,
          `    // numeric lookup`,
          `    [company] = await db.select().from(companiesTable).where(eq(companiesTable.id, numId));`,
          `  } else {`,
          `    // name-string lookup — stable across re-seeds`,
          `    [company] = await db.select().from(companiesTable).where(eq(companiesTable.name, rawId));`,
          `  }`,
          `  if (!company) { res.status(404).json({ error: "Company not found" }); return; }`,
          `  res.json(company);`,
          `});`,
        ]),

        h2("3.6  routes/signals.ts — Filter & Reverse Sort"),
        codeBlock([
          `router.get("/signals", async (req, res) => {`,
          `  let signals = await db.select().from(signalsTable).orderBy(signalsTable.createdAt);`,
          `  if (query.data.companyId) signals = signals.filter(s => s.companyId === query.data.companyId);`,
          `  if (query.data.strength)  signals = signals.filter(s => s.strength === query.data.strength);`,
          `  if (query.data.category)  signals = signals.filter(s => s.category === query.data.category);`,
          `  res.json(signals.reverse()); // most recent first`,
          `});`,
        ]),

        h2("3.7  routes/dashboard.ts — 4 Aggregate Endpoints"),
        codeBlock([
          `// GET /api/dashboard/summary — counts across all tables`,
          `// GET /api/dashboard/recent-signals — all signals ordered by createdAt DESC`,
          `// GET /api/dashboard/signal-breakdown — { category, count }[] aggregation`,
          `// GET /api/dashboard/shei-by-urgency — { urgency, count }[] aggregation`,
        ]),

        h2("3.8  routes/admin.ts — Manual Reseed"),
        codeBlock([
          `router.post("/admin/reseed", async (_req, res) => {`,
          `  try {`,
          `    await seedDatabase();`,
          `    res.json({ success: true, message: "Database re-seeded successfully" });`,
          `  } catch (err) {`,
          `    res.status(500).json({ success: false, message: String(err) });`,
          `  }`,
          `});`,
        ]),

        h2("3.9  routes/feeds.ts — RSS + Commodity Prices"),
        para("The feeds route has three endpoints:"),
        bullet("GET /api/feeds/news?category=all|COMPANY|FMCG_INDIA|... — fetches Google News RSS for 16 configured sources, merges, sorts by date, returns max 8 items per feed. 15-minute in-memory cache."),
        bullet("GET /api/feeds/sources — returns the source manifest (id, label, category)"),
        bullet("GET /api/feeds/commodities — fetches live prices for 6 FMCG-relevant commodities (Cocoa, Palm Oil, Sugar, Wheat, Coffee, Milk) from Yahoo Finance chart API. 15-minute cache. Marks prices as 'stale' if >14 days old."),
        para("16 RSS Sources configured:"),
        codeBlock([
          `FMCG India (Google News), HUL, ITC, Nestlé India, Marico, Dabur,`,
          `Britannia, Godrej CP, Colgate India, Reckitt India, P&G India,`,
          `Emami, FMCG Global, Regulatory & Policy (FSSAI/EPR),`,
          `Earnings & Financial, Commodity News`,
        ]),
        para("6 Commodity Symbols:"),
        codeBlock([
          `CC=F    — Cocoa (USD/MT)       → Mondelez, Nestlé margin`,
          `FCPO.KLS— Palm Oil CPO (MYR/MT) → HUL, Marico, P&G India`,
          `SB=F    — Raw Sugar (USD/lb)    → Varun Beverages, ITC`,
          `ZW=F    — Wheat (USD/bu)        → Britannia, ITC Aashirvaad`,
          `KC=F    — Arabica Coffee (USD/lb)→ Tata Consumer, Nestlé`,
          `DC=F    — Milk Class III (USD/cwt)→ Nestlé India, Heritage`,
        ]),
        pageBreak(),

        // ═══════════════════════════════════════════════════════════════════
        // SECTION 4 — FRONTEND SOURCE CODE
        // ═══════════════════════════════════════════════════════════════════
        sectionBanner("4", "Full Source Code — Frontend"),

        h2("4.1  artifacts/research-pod/vite.config.ts"),
        para("Vite reads PORT and BASE_PATH from environment variables — both are required. Fails fast if either is missing. allowedHosts: true enables the Replit iframe proxy."),
        codeBlock([
          `export default defineConfig({`,
          `  base: basePath,              // e.g. "/" in dev`,
          `  plugins: [react(), tailwindcss(), runtimeErrorOverlay(), ...cartographerAndBanner],`,
          `  resolve: {`,
          `    alias: {`,
          `      "@": path.resolve(import.meta.dirname, "src"),`,
          `      "@assets": path.resolve(..., "attached_assets"),`,
          `    },`,
          `    dedupe: ["react", "react-dom"],`,
          `  },`,
          `  server: { port, strictPort: true, host: "0.0.0.0", allowedHosts: true },`,
          `  build: { outDir: path.resolve(import.meta.dirname, "dist/public") },`,
          `});`,
        ]),

        h2("4.2  src/App.tsx — Root Component"),
        codeBlock([
          `// QueryClient: retry 1, staleTime 30s`,
          `// WouterRouter: base = BASE_URL (strips trailing slash)`,
          `// Layout wraps all routes — sidebar + main content`,
          `// Dark mode: document.documentElement.classList.add('dark') on mount`,
          ``,
          `Routes:`,
          `  /              → Dashboard (Command Centre)`,
          `  /companies     → Companies roster`,
          `  /companies/:id → Company detail (name or numeric ID)`,
          `  /shei-cards    → SHEI hypothesis library`,
          `  /shei-cards/:id→ SHEI card detail`,
          `  /signals       → Signal tracker + Add Signal modal`,
          `  /timeline      → Chronological timeline`,
          `  /benchmarks    → KPI benchmark table`,
          `  /playbooks     → Consulting playbooks`,
          `  /actions       → Priority actions`,
          `  /ask           → AI chat (SSE stream)`,
          `  /feeds         → Live RSS + commodity prices`,
          `  /meeting-prep  → AI pre-meeting brief generator`,
        ]),

        h2("4.3  src/components/layout.tsx — Sidebar"),
        para("The sidebar is divided into three nav sections:"),
        table2col([
          ["Section", "Routes"],
          ["Intelligence", "Dashboard, Companies, SHEI Cards, Benchmarks"],
          ["Signals", "Signal Tracker, Timeline, Live Feed"],
          ["Activation", "Actions (NEW badge), Meeting Prep (NEW badge), Ask Anything (AI badge), Playbooks"],
        ]),
        para("NEW badge logic: localStorage keys rp_actions_seen and rp_meeting_prep_seen control visibility. Badge clears on first visit using useEffect watching the current location."),
        para("Refresh Data button: calls POST /api/admin/reseed then reloads window. Shows spinner while running, then green 'Done!' or red 'Failed' with auto-reset after 1.5–3s."),

        h2("4.4  src/pages/dashboard.tsx — Command Centre"),
        para("Five stat cards (Companies, SHEI Hypotheses, Signals, Benchmarks, Playbooks) using useGetDashboardSummary hook. Each card is a clickable Link to the detail page. Two live panels: Recent Signals (last 8) and Active Hypotheses. Colour-coded badges by urgency and strength. Animated with animate-in fade-in zoom-in-95."),

        h2("4.5  src/pages/signals.tsx — Signal Tracker"),
        para("Lists all 58+ seeded signals with filters for company, strength, and category. Includes Add Signal modal (Radix Dialog) allowing consultants to add new signals at runtime via POST /api/signals. Each signal card shows trajectory badge (IMPROVING/DETERIORATING/STABLE), scope tag, financial impact, and SC relevance."),

        h2("4.6  src/pages/benchmarks.tsx — KPI Benchmark Positioning"),
        para("Lists all KPI benchmarks with a visual positioning bar showing Best-in-Class / Median / Laggard on a spectrum. Includes consulting angle, improvement levers, and India context for each KPI. Filter by function tag."),

        h2("4.7  src/pages/ask.tsx — AI Chat Interface"),
        para("Full conversational interface connecting to POST /api/ask. Messages rendered with ReactMarkdown. Quick-prompt buttons for common consulting questions. sessionStorage key rp_ask_prefill allows other pages to pre-populate the query (cross-module linking from SHEI cards, signals, company profiles). Supports multi-turn conversation history."),

        h2("4.8  src/pages/meeting-prep.tsx — AI Pre-Meeting Brief"),
        para("Four inputs: Company (select from DB), Executive Role (text), Meeting Date (date picker), Focus Area (Supply Chain / Procurement / Digital / Distribution / Financial / Full Pre-Read)."),
        para("On Generate: assembles a structured prompt from DB intelligence (company profile + linked SHEI hypotheses + linked signals) and sends to POST /api/ask SSE stream. Output rendered in real-time with ReactMarkdown skeleton loading states."),
        para("The generated brief has 7 mandatory sections: Company Snapshot, Top 3 Themes, SHEI Intelligence Brief, Benchmark Gaps, Thoucentric Entry Points, CXO Questions, Watch-Outs."),

        h2("4.9  src/pages/feeds.tsx — Live Feed"),
        para("Commodity price ticker at the top (6 commodities, real-time from Yahoo Finance). Category tab filter (All / FMCG India / Company / Global / Regulatory / Financial / Commodity). Articles displayed as cards with publication, date, summary, and external link. Auto-refreshes with 15-min server cache."),

        h2("4.10  Cross-Module Linking Pattern"),
        para("Pages link to related data using sessionStorage and URL parameters:"),
        codeBlock([
          `// From SHEI Card detail → Ask AI:`,
          `sessionStorage.setItem("rp_ask_prefill", "Analyse the SHEI hypothesis: " + card.title + "...");`,
          `navigate("/ask");`,
          ``,
          `// Ask page reads on mount:`,
          `const prefill = sessionStorage.getItem("rp_ask_prefill");`,
          `if (prefill) { setInput(prefill); sessionStorage.removeItem("rp_ask_prefill"); }`,
          ``,
          `// Company detail → linked SHEI cards:`,
          `sheiCards.filter(s => s.relatedCompanies?.toLowerCase().includes(company.name.toLowerCase()))`,
          ``,
          `// Company detail → linked signals:`,
          `signals.filter(s => s.companyName?.toLowerCase().includes(company.name.toLowerCase()))`,
        ]),
        pageBreak(),

        // ═══════════════════════════════════════════════════════════════════
        // SECTION 5 — DATABASE SCHEMA
        // ═══════════════════════════════════════════════════════════════════
        sectionBanner("5", "Database Schema (Drizzle ORM)"),

        h2("5.1  lib/db/src/index.ts — Pool & Connection"),
        codeBlock([
          `import { drizzle } from "drizzle-orm/node-postgres";`,
          `import pg from "pg";`,
          `import * as schema from "./schema";`,
          ``,
          `const { Pool } = pg;`,
          ``,
          `if (!process.env.DATABASE_URL)`,
          `  throw new Error("DATABASE_URL must be set. Did you forget to provision a database?");`,
          ``,
          `export const pool = new Pool({ connectionString: process.env.DATABASE_URL });`,
          `export const db = drizzle(pool, { schema });`,
          ``,
          `export * from "./schema"; // re-export all table definitions & types`,
        ]),

        h2("5.2  Table: companies"),
        table2col([
          ["Column", "Type / Constraints"],
          ["id", "SERIAL PRIMARY KEY"],
          ["name", "TEXT NOT NULL — short name (e.g. 'HUL', 'ITC') — used as URL slug"],
          ["full_name", "TEXT NOT NULL — full legal name"],
          ["tier", "INTEGER NOT NULL DEFAULT 1 — 1=priority, 2=tracked"],
          ["geography", "TEXT NOT NULL DEFAULT 'GLOBAL'"],
          ["exchange", "TEXT — e.g. 'BSE:HINDUNILVR'"],
          ["ir_page", "TEXT — investor relations URL"],
          ["earnings_cadence", "TEXT — e.g. 'Q4 FY25 due May 2025'"],
          ["revenue", "TEXT — formatted string e.g. '₹59,579 Cr'"],
          ["revenue_growth", "TEXT — e.g. '+2.3% YoY'"],
          ["ebitda_margin", "TEXT — e.g. '23.4%'"],
          ["market_cap", "TEXT — e.g. '₹5.8L Cr'"],
          ["categories", "TEXT — product category tags"],
          ["strategic_priorities", "TEXT — free-text strategic narrative"],
          ["sc_intelligence", "TEXT — supply chain intelligence summary"],
          ["tech_intelligence", "TEXT — technology landscape summary"],
          ["open_problems", "TEXT — consulting entry points"],
          ["quick_take", "TEXT — 2-sentence analyst summary"],
          ["confidence", "TEXT NOT NULL DEFAULT 'MEDIUM' — HIGH/MEDIUM/LOW"],
          ["version", "TEXT NOT NULL DEFAULT '1.0'"],
          ["next_refresh", "TEXT — scheduled review date"],
          ["created_at", "TIMESTAMP NOT NULL DEFAULT NOW()"],
          ["updated_at", "TIMESTAMP NOT NULL DEFAULT NOW()"],
        ]),

        h2("5.3  Table: shei_cards"),
        table2col([
          ["Column", "Type / Constraints"],
          ["id", "SERIAL PRIMARY KEY"],
          ["card_id", "TEXT NOT NULL UNIQUE — stable string ID (e.g. 'SHEI-SC-001')"],
          ["title", "TEXT NOT NULL — headline hypothesis title"],
          ["function_tag", "TEXT NOT NULL — SUPPLY_CHAIN | PROCUREMENT | DIGITAL | GTM | FINANCE"],
          ["geography_tag", "TEXT NOT NULL DEFAULT 'BOTH'"],
          ["urgency", "TEXT NOT NULL DEFAULT 'MEDIUM_TERM' — IMMEDIATE | MEDIUM_TERM | LONG_TERM"],
          ["signal", "TEXT NOT NULL — observed signal that triggered this SHEI"],
          ["hypothesis", "TEXT NOT NULL — testable structural statement"],
          ["evidence", "TEXT NOT NULL — supporting data points"],
          ["contradictions", "TEXT — data contradictions calling out mismatches"],
          ["client_implication", "TEXT NOT NULL — what this means for the client"],
          ["thoucentriq_angle", "TEXT NOT NULL — Thoucentric consulting angle"],
          ["kpi_linkage", "TEXT — which KPI benchmarks this affects"],
          ["signal_cluster", "TEXT — which signals triggered this SHEI"],
          ["trajectory_context", "TEXT — past → current → direction → inflection narrative"],
          ["pitch_anchor", "TEXT — one-line pitch anchor for BD"],
          ["provoc_question", "TEXT — provocative question to ask the CXO"],
          ["pov_paragraph", "TEXT — Thoucentric point of view paragraph"],
          ["financial_impact", "TEXT — quantified revenue/margin/WC impact"],
          ["why_now", "TEXT — urgency trigger (regulatory / competitive / financial)"],
          ["related_companies", "TEXT — comma-separated company names"],
          ["status", "TEXT NOT NULL DEFAULT 'ACTIVE'"],
          ["version", "TEXT NOT NULL DEFAULT '1.0'"],
          ["next_review", "TEXT — scheduled review date"],
          ["created_at", "TIMESTAMP NOT NULL DEFAULT NOW()"],
          ["updated_at", "TIMESTAMP NOT NULL DEFAULT NOW()"],
        ]),

        h2("5.4  Table: signals"),
        table2col([
          ["Column", "Type / Constraints"],
          ["id", "SERIAL PRIMARY KEY"],
          ["company_id", "INTEGER — optional FK to companies.id"],
          ["company_name", "TEXT — denormalised for display (may be 'All FMCG' for industry-wide)"],
          ["category", "TEXT NOT NULL — SUPPLY_CHAIN | DEMAND | PRICING | REGULATORY | FINANCIAL | TECHNOLOGY | SUSTAINABILITY | M_AND_A | CHANNEL | MACRO"],
          ["scope", "TEXT — COMPANY_SPECIFIC | INDUSTRY_WIDE | MACRO"],
          ["summary", "TEXT NOT NULL — signal description"],
          ["strength", "TEXT NOT NULL DEFAULT 'MEDIUM' — HIGH | MEDIUM | LOW"],
          ["action", "TEXT NOT NULL DEFAULT 'MONITOR' — MONITOR | INVESTIGATE | ESCALATE | ACT"],
          ["source", "TEXT — origin tag e.g. 'EARNINGS_CALL', 'ANALYST_REPORT'"],
          ["event_type", "TEXT — e.g. 'EARNINGS', 'ANNOUNCEMENT', 'REGULATORY'"],
          ["financial_impact", "TEXT — quantified impact string"],
          ["published_date", "TEXT — signal date string"],
          ["news_url", "TEXT — source URL"],
          ["quarter", "TEXT — e.g. 'Q3 FY25'"],
          ["sc_relevance", "TEXT — supply chain specific relevance note"],
          ["past_state", "TEXT — what was true 6-12 months ago (for trajectory)"],
          ["trajectory_dir", "TEXT — IMPROVING | DETERIORATING | STABLE"],
          ["created_at", "TIMESTAMP NOT NULL DEFAULT NOW()"],
        ]),

        h2("5.5  Table: benchmarks"),
        table2col([
          ["Column", "Type / Constraints"],
          ["id", "SERIAL PRIMARY KEY"],
          ["kpi_name", "TEXT NOT NULL — e.g. 'Forecast Accuracy (MAPE)'"],
          ["definition", "TEXT NOT NULL — what this KPI measures"],
          ["function_tag", "TEXT NOT NULL — SUPPLY_CHAIN | PROCUREMENT | DIGITAL | GTM | FINANCE"],
          ["best_in_class", "TEXT NOT NULL — best value e.g. '8-10%'"],
          ["industry_median", "TEXT NOT NULL — median value"],
          ["laggard", "TEXT NOT NULL — laggard value"],
          ["unit", "TEXT — unit of measurement"],
          ["source_period", "TEXT — data vintage"],
          ["india_context", "TEXT — India-specific benchmarking notes"],
          ["calculation_logic", "TEXT — how to compute this KPI"],
          ["shei_annotation", "TEXT — which SHEI cards reference this KPI"],
          ["company_examples", "TEXT — real company examples at each tier"],
          ["why_it_matters", "TEXT — consulting relevance"],
          ["consulting_angle", "TEXT — Thoucentric service angle"],
          ["improvement_levers", "TEXT — how to move from laggard to best-in-class"],
          ["version", "TEXT NOT NULL DEFAULT '1.0'"],
          ["created_at", "TIMESTAMP NOT NULL DEFAULT NOW()"],
          ["updated_at", "TIMESTAMP NOT NULL DEFAULT NOW()"],
        ]),

        h2("5.6  Table: playbook_sections"),
        table2col([
          ["Column", "Type / Constraints"],
          ["id", "SERIAL PRIMARY KEY"],
          ["title", "TEXT NOT NULL — section title"],
          ["function_tag", "TEXT NOT NULL"],
          ["section_number", "INTEGER NOT NULL"],
          ["why_it_matters", "TEXT NOT NULL"],
          ["industry_landscape", "TEXT"],
          ["failure_modes", "TEXT — common client failure patterns"],
          ["what_good_looks_like", "TEXT — best practice description"],
          ["technology_enablers", "TEXT — relevant technology platforms"],
          ["consulting_entry_points", "TEXT — specific SOW entry points"],
          ["trigger_signals", "TEXT — which signal types activate this playbook"],
          ["status", "TEXT NOT NULL DEFAULT 'STARTER'"],
          ["version", "TEXT NOT NULL DEFAULT '1.0'"],
          ["created_at", "TIMESTAMP NOT NULL DEFAULT NOW()"],
          ["updated_at", "TIMESTAMP NOT NULL DEFAULT NOW()"],
        ]),

        h2("5.7  Scaffold Tables (conversations & messages)"),
        para("Two additional scaffold tables exist for potential future conversation persistence. Currently the Ask interface is stateless (conversation history stored in React state only)."),
        codeBlock([
          `conversations: id, title, created_at`,
          `messages: id, conversation_id (FK → conversations.id CASCADE), role, content, created_at`,
        ]),
        pageBreak(),

        // ═══════════════════════════════════════════════════════════════════
        // SECTION 6 — AI PROMPT SYSTEM
        // ═══════════════════════════════════════════════════════════════════
        sectionBanner("6", "AI Prompt System"),

        h2("6.1  Architecture: Dynamic Context Injection"),
        para("Unlike a static system prompt, every call to POST /api/ask first executes 4 parallel database queries to pull the latest companies, SHEI cards, signals, and benchmarks. This live data is injected directly into the system prompt, ensuring the AI always has fresh context without relying on stale training data."),
        codeBlock([
          `// ask.ts — AGENT 1: Pull fresh DB context for system prompt`,
          `const [companies, sheiCards, signals, benchmarks] = await Promise.all([`,
          `  db.select({ name, fullName, geography, revenue, ebitdaMargin, quickTake, openProblems, scIntelligence }).from(companiesTable),`,
          `  db.select({ title, functionTag, urgency, signal, hypothesis, financialImpact, whyNow, contradictions, kpiLinkage, trajectoryContext }).from(sheiCardsTable),`,
          `  db.select({ companyName, category, scope, summary, strength, action, financialImpact, quarter, scRelevance, pastState, trajectoryDir, eventType }).from(signalsTable),`,
          `  db.select({ kpiName, functionTag, bestInClass, industryMedian, laggard, whyItMatters, indiaContext, calculationLogic }).from(benchmarksTable),`,
          `]);`,
        ]),

        h2("6.2  Multi-Agent Identity Model"),
        para("The system prompt establishes a 4-agent identity:"),
        table2col([
          ["Agent", "Role & Persona"],
          ["AGENT 1 — Signal Intelligence Agent", "MBB Partner + Hedge Fund Analyst: detects and classifies signals"],
          ["AGENT 2 — SHEI Insight Agent", "McKinsey Partner: forms and validates structural hypotheses"],
          ["AGENT 3 — KPI & Quant Validation Agent", "CFO + Benchmarking Engine: validates every insight against KPIs"],
          ["AGENT 4 — Decision & BD Activation Agent", "Consulting BD Leader: converts intelligence into CXO decisions and Thoucentric opportunities"],
        ]),

        h2("6.3  Data Priority Hierarchy"),
        para("The system prompt explicitly orders data sources so the AI knows what to trust first:"),
        codeBlock([
          `DATA PRIORITY (descending):`,
          `1. Latest real-world knowledge (last 12 months)`,
          `2. Live signals from DB (time-aware, classified by scope)`,
          `3. KPI benchmarks (quantified, comparative)`,
          `4. SHEI patterns (auto-generated > static)`,
          `5. DB company profiles (supporting context)`,
        ]),

        h2("6.4  Mandatory 6-Step Reasoning Pipeline"),
        para("Before generating any output, the AI must execute this reasoning pipeline internally:"),
        codeBlock([
          `STEP 1 — SIGNAL EXTRACTION:`,
          `  Identify 3-6 relevant signals.`,
          `  Classify each: COMPANY_SPECIFIC | INDUSTRY_WIDE | MACRO`,
          `  Assign strength: HIGH / MEDIUM / LOW`,
          `  Check: do 2+ signals align? → Auto-generate SHEI.`,
          ``,
          `STEP 2 — PATTERN DETECTION:`,
          `  Cluster into 1-2 themes:`,
          `  demand volatility / cost inflation / channel shift / regulatory pressure / capacity gap`,
          ``,
          `STEP 3 — HYPOTHESIS FORMATION:`,
          `  One testable structural statement.`,
          `  Non-obvious standard: if a junior analyst could write it, reject and deepen.`,
          ``,
          `STEP 4 — VALIDATION:`,
          `  Check against KPI benchmarks (best / median / laggard)`,
          `  Compare 2-3 peer companies minimum`,
          `  Flag contradictions: Revenue↑ Margin↓ | Inventory↑ low demand | Strategy vs execution mismatch`,
          ``,
          `STEP 5 — IMPACT ESTIMATION:`,
          `  Revenue (₹Cr/$M), Margin (bps), Working Capital (days)`,
          `  Include calculation logic`,
          ``,
          `STEP 6 — DECISION LAYER:`,
          `  Immediate (0-3 months) + Programme (6-12 months) + Thoucentric engagement`,
        ]),

        h2("6.5  Mandatory 8-Section Output Structure"),
        para("Every AI response must follow this exact structure — no exceptions:"),
        codeBlock([
          `**SIGNALS** (What is happening)`,
          `  3-5 data-backed events — ₹/$/€ values, %, days`,
          `  Classify each: [COMPANY] / [INDUSTRY] / [MACRO] · Strength: HIGH/MEDIUM/LOW`,
          `  Show trajectory: past state → current state → direction`,
          ``,
          `**PATTERN & INSIGHT** (What it means)`,
          `  Non-obvious interpretation — the 'so what' a junior analyst would miss`,
          `  Cross-company pattern if signals overlap`,
          `  Contradictions called out explicitly`,
          `  Trajectory: Past (6-12M ago) → Current → Direction → Inflection point`,
          ``,
          `**INDUSTRY COMPARISON**`,
          `  2-3 peer companies — quantified leader vs. laggard`,
          `  WHY the leader is ahead (capability / investment / execution decision)`,
          ``,
          `**KPI VALIDATION**`,
          `  Explicit KPI reference | Best-in-class (named) | Industry Median | Laggard`,
          `  Subject company's position on spectrum`,
          ``,
          `**FINANCIAL IMPACT**`,
          `  Revenue impact (₹Cr/$M with calculation logic)`,
          `  Margin impact (bps or %)`,
          `  Working capital impact (days or ₹Cr)`,
          ``,
          `**DECISIONS REQUIRED**`,
          `  Immediate (0-3 months): what must be decided NOW before window closes`,
          `  Medium-term (6-12 months): what programme must be initiated`,
          `  "The company must choose between X and Y by [timing] because [consequence]"`,
          ``,
          `**THOUCENTRIC OPPORTUNITY**`,
          `  Named engagement (e.g. "Demand Sensing Transformation")`,
          `  Entry point: which executive, which pain, which trigger event`,
          `  Engagement type: Diagnostic (6-8 weeks) | Transformation (6-18 months) | Advisory`,
          `  Value creation estimate for client`,
          ``,
          `**CONFIDENCE**`,
          `  HIGH / MEDIUM / LOW with explicit missing data statement`,
          ``,
          `**CXO QUESTIONS**`,
          `  2 provocative questions: "Given [data point], what is your plan to [action] by [deadline]?"`,
        ]),

        h2("6.6  Intelligence Quality Rules"),
        para("Hard rules encoded in the system prompt:"),
        bullet("REJECT any insight a junior analyst could write — enforce non-obvious standard"),
        bullet("CONTRADICTION DETECTION: Revenue↑ Margin↓ | Volume↑ Inventory↑ | Strategy vs execution — flag EVERY contradiction"),
        bullet("TRAJECTORY: Always show past → current → direction → inflection. Never static analysis."),
        bullet("QUANTIFY: If insight has no quantitative grounding → mark confidence LOW"),
        bullet("INDIA CONTEXT: GT vs MT vs Q-commerce | Rural vs urban | EPR / FSSAI / BIS regulatory"),
        bullet("GLOBAL CONTEXT: Commodity cycles | Channel shifts | Tech maturity | M&A patterns"),
        bullet("BE OPINIONATED: State clear views. No 'it depends'. No generic consulting language."),
        bullet("FINAL TEST: 'Does this change a CXO decision?' If not → improve output."),

        h2("6.7  Meeting Prep Prompt Structure"),
        para("The Meeting Prep page constructs a separate structured prompt (not the master prompt) that is sent to POST /api/ask. It assembles:"),
        codeBlock([
          `1. Company context: full_name, geography, tier, revenue, EBITDA, strategic priorities, SC intelligence, tech intelligence, open problems`,
          `2. SHEI hypotheses: all hypotheses where relatedCompanies contains the selected company`,
          `3. Recent signals: up to 8 signals where companyName matches`,
          ``,
          `Requests 7 sections:`,
          `  1. COMPANY SNAPSHOT`,
          `  2. TOP 3 THEMES FOR THIS MEETING`,
          `  3. SHEI INTELLIGENCE BRIEF`,
          `  4. BENCHMARK GAPS`,
          `  5. THOUCENTRIC ENTRY POINTS`,
          `  6. CXO QUESTIONS`,
          `  7. WATCH-OUTS`,
        ]),

        h2("6.8  OpenAI API Parameters"),
        codeBlock([
          `model: "gpt-4o"`,
          `max_completion_tokens: 2500`,
          `stream: true`,
          `messages: [ { role: "system", content: systemPrompt }, ...conversationHistory ]`,
        ]),
        pageBreak(),

        // ═══════════════════════════════════════════════════════════════════
        // SECTION 7 — DATA PIPELINE & SEEDING
        // ═══════════════════════════════════════════════════════════════════
        sectionBanner("7", "Data Pipeline & Seeding"),

        h2("7.1  Seed Strategy"),
        para("The platform uses a curated-seed approach rather than live data ingestion. All intelligence content is authored by Thoucentric analysts and stored in seed.ts (~2700 lines). This ensures consistency, auditability, and offline operation."),
        para("The seedDatabase() function is:"),
        bullet("Called automatically on every server start (app.ts line 35)"),
        bullet("Called manually via POST /api/admin/reseed (admin.ts)"),
        bullet("Called by the 'Refresh Data' sidebar button in the frontend"),
        bullet("Idempotent: truncates all tables before inserting"),

        h2("7.2  Seeding Process"),
        codeBlock([
          `async function seedDatabase() {`,
          `  // 1. Truncate all tables in dependency order`,
          `  await db.delete(messagesTable);`,
          `  await db.delete(conversationsTable);`,
          `  await db.delete(signalsTable);`,
          `  await db.delete(sheiCardsTable);`,
          `  await db.delete(benchmarksTable);`,
          `  await db.delete(playbookSectionsTable);`,
          `  await db.delete(companiesTable);`,
          ``,
          `  // 2. Insert in order (companies first, then references)`,
          `  await db.insert(companiesTable).values(companies);`,
          `  await db.insert(sheiCardsTable).values(sheiCards);`,
          `  await db.insert(signalsTable).values(signals);`,
          `  await db.insert(benchmarksTable).values(benchmarks);`,
          `  await db.insert(playbookSectionsTable).values(playbookSections);`,
          `}`,
        ]),

        h2("7.3  Seeded Data Inventory"),
        table2col([
          ["Entity", "Count & Description"],
          ["Companies", "8 companies — HUL, ITC, Nestlé India, Marico, Dabur, Britannia, Godrej CP, Varun Beverages. Tier 1 (priority) + Tier 2 (tracked). Full intelligence profiles."],
          ["SHEI Cards", "20+ hypothesis cards across SUPPLY_CHAIN, PROCUREMENT, DIGITAL, GTM, FINANCE function tags. 3 urgency levels. Full trajectory context, financial impact, provoc questions."],
          ["Signals", "58+ signals covering all 8 companies + industry-wide. 10 category types, 3 scope levels, trajectory direction, SC relevance."],
          ["Benchmarks", "40+ KPI benchmarks with best-in-class / median / laggard values. India context, consulting angle, calculation logic, improvement levers."],
          ["Playbook Sections", "8+ playbook sections for supply chain, procurement, digital transformation. Trigger signals, failure modes, technology enablers."],
        ]),

        h2("7.4  Signal Categories"),
        codeBlock([
          `SUPPLY_CHAIN     — SC network, inventory, logistics, manufacturing`,
          `DEMAND           — Consumer demand, volume shifts, mix changes`,
          `PRICING          — Price increases, promotional intensity, RGM`,
          `REGULATORY       — EPR, FSSAI, BIS, compliance requirements`,
          `FINANCIAL        — Revenue, margin, working capital, earnings`,
          `TECHNOLOGY       — ERP, AI/ML, digital transformation initiatives`,
          `SUSTAINABILITY   — ESG, packaging, emissions, circular economy`,
          `M_AND_A          — Acquisitions, divestitures, JVs`,
          `CHANNEL          — GT vs MT vs Q-commerce, distribution shifts`,
          `MACRO            — Commodity prices, forex, interest rates, monsoon`,
        ]),

        h2("7.5  Live Data Pipeline (RSS + Commodities)"),
        para("In addition to the seeded database, two live data sources are aggregated at query time:"),
        bullet("RSS feeds: 16 Google News search feeds polled per request (15-min server cache). No API key required. Articles returned sorted by publication date."),
        bullet("Commodity prices: Yahoo Finance chart API (v8) polled for 6 symbols. 15-min server cache. Staleness detection: prices older than 14 days flagged as isStale."),
        pageBreak(),

        // ═══════════════════════════════════════════════════════════════════
        // SECTION 8 — KNOWLEDGE GRAPH & DATA RELATIONSHIPS
        // ═══════════════════════════════════════════════════════════════════
        sectionBanner("8", "Knowledge Graph & Data Relationships"),

        h2("8.1  Entity Relationship Overview"),
        codeBlock([
          `Companies (8)`,
          `    │`,
          `    ├── Signals (58+)  ─── companyName string match (denormalised)`,
          `    │                      companyId optional FK`,
          `    │`,
          `    └── SHEI Cards (20+) ─ relatedCompanies string contains company name`,
          `             │`,
          `             ├── Benchmarks ─── kpiLinkage string reference`,
          `             └── Signals ────── signalCluster string reference`,
          ``,
          `Benchmarks (40+)`,
          `    └── function_tag groups KPIs by domain (same as SHEI functionTag)`,
          ``,
          `Playbook Sections (8+)`,
          `    └── triggerSignals links to signal category types`,
        ]),

        h2("8.2  Cross-Entity Linking Strategy"),
        para("The platform uses string-based soft linking rather than strict foreign keys for most relationships. This allows:"),
        bullet("Re-seeding without breaking links (IDs change, names don't)"),
        bullet("Many-to-many relationships without junction tables"),
        bullet("Fuzzy matching (case-insensitive contains) for resilient lookups"),

        h3("Company ↔ Signals"),
        codeBlock([
          `// Signals linked to companies by name string match:`,
          `signals.filter(s =>`,
          `  s.companyName?.toLowerCase().includes(company.name.toLowerCase()) ||`,
          `  s.companyName === "All FMCG"  // industry-wide signals appear on all company pages`,
          `)`,
        ]),

        h3("Company ↔ SHEI Cards"),
        codeBlock([
          `// SHEI cards linked to companies via relatedCompanies CSV string:`,
          `sheiCards.filter(s =>`,
          `  s.relatedCompanies?.toLowerCase().includes(company.name.toLowerCase())`,
          `)`,
        ]),

        h3("SHEI Card ↔ Benchmarks"),
        codeBlock([
          `// SHEI cards reference KPI benchmarks via kpiLinkage string:`,
          `// e.g. kpiLinkage: "Forecast Accuracy (MAPE), Days of Inventory Outstanding"`,
          `// Frontend resolves this to show the full benchmark detail`,
        ]),

        h2("8.3  Function Tag Taxonomy"),
        para("All five entity types use the same function_tag values, enabling cross-entity filtering:"),
        codeBlock([
          `SUPPLY_CHAIN    → SC network, inventory, demand sensing, logistics`,
          `PROCUREMENT     → Category management, supplier risk, spend analytics`,
          `DIGITAL         → ERP, AI/ML, data platforms, tech stack`,
          `GTM             → Route to market, channel strategy, distribution`,
          `FINANCE         → Working capital, margin management, cost structure`,
        ]),

        h2("8.4  Urgency × Strength Signal Priority Model"),
        table2col([
          ["Signal Strength / SHEI Urgency", "Meaning"],
          ["HIGH / IMMEDIATE", "Requires board-level decision within 0-3 months. Escalate to CXO immediately."],
          ["MEDIUM / MEDIUM_TERM", "Programme-level initiative required within 6-12 months."],
          ["LOW / LONG_TERM", "Monitor and include in annual strategic review."],
        ]),
        pageBreak(),

        // ═══════════════════════════════════════════════════════════════════
        // SECTION 9 — ENVIRONMENT CONFIG & SETUP GUIDE
        // ═══════════════════════════════════════════════════════════════════
        sectionBanner("9", "Environment Configuration & Setup Guide"),

        h2("9.1  Required Environment Variables"),
        table2col([
          ["Variable", "Where Used / Description"],
          ["DATABASE_URL", "api-server — PostgreSQL connection string. Provisioned by Replit."],
          ["PORT", "api-server + research-pod — Injected by Replit workflow runner. Never hardcode."],
          ["BASE_PATH", "research-pod Vite config — URL base path for SPA (e.g. '/'). Injected by Replit."],
          ["NODE_ENV", "api-server — 'development' → pino-pretty logging. 'production' → JSON logging."],
          ["SESSION_SECRET", "Available secret — set but not actively used by current routes."],
          ["OPENAI_API_KEY", "Injected via Replit AI Integrations proxy — NOT a manual secret. See Section 9.3."],
          ["LOG_LEVEL", "api-server logger — optional, defaults to 'info'."],
        ]),

        h2("9.2  Workflow Configuration"),
        para("Three Replit workflows are registered:"),
        table2col([
          ["Workflow Name", "Command"],
          ["artifacts/api-server: API Server", "pnpm --filter @workspace/api-server run dev"],
          ["artifacts/research-pod: web", "pnpm --filter @workspace/research-pod run dev"],
          ["artifacts/mockup-sandbox: Component Preview Server", "pnpm --filter @workspace/mockup-sandbox run dev"],
        ]),
        para("The api-server dev script: export NODE_ENV=development && pnpm run build && pnpm run start"),
        para("This runs esbuild (build.mjs) to bundle to dist/index.mjs, then starts the bundled server."),

        h2("9.3  OpenAI Integration Setup"),
        para("OpenAI is accessed via the Replit AI Integrations proxy — NO API key is needed in environment variables:"),
        codeBlock([
          `// lib/integrations/openai-ai-server/src/index.ts`,
          `import OpenAI from "openai";`,
          ``,
          `export const openai = new OpenAI({`,
          `  // Replit proxy: REPLIT_AI_INTEGRATIONS_BASE_URL replaces api.openai.com`,
          `  // API key is injected automatically by the Replit platform`,
          `});`,
          ``,
          `// Usage in ask.ts:`,
          `import { openai } from "@workspace/integrations-openai-ai-server";`,
          `const stream = await openai.chat.completions.create({`,
          `  model: "gpt-4o",`,
          `  max_completion_tokens: 2500,`,
          `  stream: true,`,
          `  messages: conversationMessages,`,
          `});`,
        ]),

        h2("9.4  Database Setup"),
        para("Replit provisions PostgreSQL automatically when the database integration is enabled. The DATABASE_URL environment variable is set automatically."),
        para("Schema migration: The platform uses Drizzle ORM but does NOT use drizzle-kit migrations in production. Instead, seedDatabase() performs a truncate + insert on every startup — the schema is assumed to already exist (created by Drizzle's schema sync or prior migrations)."),
        para("To apply schema to a fresh database:"),
        codeBlock([
          `# Option 1: Use drizzle-kit push (development)`,
          `pnpm --filter @workspace/db run db:push`,
          ``,
          `# Option 2: Run the migration SQL directly`,
          `# Connect to PostgreSQL and run the CREATE TABLE statements matching the schema`,
        ]),

        h2("9.5  Full Local Setup Guide (Rebuild from Scratch)"),
        para("To rebuild this platform in a fresh Replit environment:"),
        codeBlock([
          `STEP 1: Create a new Replit project with Node.js (blank)`,
          ``,
          `STEP 2: Enable integrations`,
          `  - Replit Database (PostgreSQL) → sets DATABASE_URL automatically`,
          `  - Replit OpenAI AI Integration → provides GPT-4o proxy`,
          ``,
          `STEP 3: Restore the monorepo structure`,
          `  - Copy all files maintaining the pnpm workspace structure`,
          `  - pnpm-workspace.yaml must list: artifacts/*, lib/*, lib/integrations/*, scripts`,
          ``,
          `STEP 4: Install dependencies`,
          `  pnpm install`,
          ``,
          `STEP 5: Run OpenAPI codegen (generates Zod schemas + React Query hooks)`,
          `  pnpm --filter @workspace/api-spec run codegen`,
          ``,
          `STEP 6: Apply database schema`,
          `  pnpm --filter @workspace/db run db:push`,
          `  (or run migrations SQL manually)`,
          ``,
          `STEP 7: Configure Replit workflows`,
          `  api-server workflow: pnpm --filter @workspace/api-server run dev`,
          `  research-pod workflow: pnpm --filter @workspace/research-pod run dev`,
          ``,
          `STEP 8: Start workflows — database auto-seeds on first api-server start`,
          ``,
          `STEP 9: Verify at /api/healthz → { status: "ok" }`,
          `  Then open the research-pod preview to see the full UI`,
        ]),

        h2("9.6  pnpm Catalog Versions (Key Dependencies)"),
        table2col([
          ["Package", "Pinned Version"],
          ["vite", "^7.3.2"],
          ["react / react-dom", "19.1.0 (exact — Expo compatibility)"],
          ["@tanstack/react-query", "^5.90.21"],
          ["drizzle-orm", "^0.45.2"],
          ["tailwindcss", "^4.1.14"],
          ["typescript", "(root devDependency, latest LTS)"],
          ["esbuild", "0.27.3 (exact — pinned via overrides)"],
          ["zod", "^3.25.76"],
          ["lucide-react", "^0.545.0"],
          ["framer-motion", "^12.23.24"],
        ]),
        pageBreak(),

        // ═══════════════════════════════════════════════════════════════════
        // SECTION 10 — EXECUTION FLOW
        // ═══════════════════════════════════════════════════════════════════
        sectionBanner("10", "Execution Flow & Request Lifecycle"),

        h2("10.1  Server Startup Sequence"),
        codeBlock([
          `1. Replit workflow injects PORT, BASE_PATH, DATABASE_URL, NODE_ENV`,
          `2. api-server: esbuild bundles src/ → dist/index.mjs`,
          `3. Node executes dist/index.mjs`,
          `4. index.ts: validates PORT → calls app.listen(port)`,
          `5. app.ts: registers middleware (pino-http → cors → json parser → /api router)`,
          `6. app.ts: calls seedDatabase() asynchronously (non-blocking)`,
          `7. seedDatabase(): truncates all tables → inserts ~2700 rows of curated data`,
          `8. Server ready — logs: { port: 8080, msg: "Server listening" }`,
          ``,
          `9. research-pod: Vite dev server starts on PORT`,
          `10. React app served at / path`,
          ``,
          `11. Shared proxy routes:  /api/* → :8080  |  /* → :3000`,
        ]),

        h2("10.2  Typical Page Load Flow"),
        codeBlock([
          `Browser → GET /  → Vite SPA → React app mounts`,
          `  ↓`,
          `App.tsx: QueryClient initialised, WouterRouter with base="/"`,
          `  ↓`,
          `Layout.tsx: sidebar renders, checks localStorage for NEW badge state`,
          `  ↓`,
          `Dashboard.tsx mounts:`,
          `  useGetDashboardSummary() → GET /api/dashboard/summary`,
          `  useListSignals()         → GET /api/signals`,
          `  useListSheiCards()       → GET /api/shei-cards`,
          `  ↓`,
          `TanStack Query: fetch → cache (staleTime: 30s) → re-render`,
        ]),

        h2("10.3  AI Ask Flow (SSE Streaming)"),
        codeBlock([
          `User types query → clicks Send`,
          `  ↓`,
          `ask.tsx: fetch POST /api/ask { messages: [...history, { role: "user", content }] }`,
          `  ↓`,
          `ask.ts route handler:`,
          `  1. Validate messages array`,
          `  2. Run 4 parallel DB queries (companies, sheiCards, signals, benchmarks)`,
          `  3. Build dynamic system prompt with live DB data injected`,
          `  4. Set headers: Content-Type: text/event-stream, Cache-Control: no-cache`,
          `  5. Call openai.chat.completions.create({ model: "gpt-4o", stream: true, ... })`,
          `  6. for await (chunk of stream) → res.write("data: " + JSON.stringify({content}) + "\\n\\n")`,
          `  7. res.write("data: [DONE]\\n\\n") → res.end()`,
          `  ↓`,
          `ask.tsx SSE reader:`,
          `  reader.read() loop → parse "data: {...}" lines → extract delta.content`,
          `  → setBrief(prev => prev + token) — streaming render`,
          `  ↓`,
          `ReactMarkdown renders streaming markdown in real-time`,
        ]),

        h2("10.4  Meeting Prep Flow"),
        codeBlock([
          `User selects company + role + date + focus area`,
          `  ↓`,
          `meeting-prep.tsx:`,
          `  1. Filter sheiCards where relatedCompanies contains company name`,
          `  2. Filter signals where companyName matches or = "All FMCG"`,
          `  3. Build structured prompt (company context + SHEI + signals + 7 section request)`,
          `  4. Send to POST /api/ask (same SSE endpoint as Ask page)`,
          `  5. Stream response → setBrief(prev + token)`,
          `  6. ReactMarkdown renders final brief`,
        ]),

        h2("10.5  Admin Reseed Flow"),
        codeBlock([
          `User clicks "Refresh Data" in sidebar`,
          `  ↓`,
          `layout.tsx: setRefreshing(true) → fetch POST /api/admin/reseed`,
          `  ↓`,
          `admin.ts: calls seedDatabase()`,
          `  ↓`,
          `seed.ts: truncate all tables → reinsert ~2700 rows`,
          `  ↓`,
          `admin.ts: res.json({ success: true })`,
          `  ↓`,
          `layout.tsx: setRefreshStatus("ok") → setTimeout 1.5s → window.location.reload()`,
          `  ↓`,
          `All TanStack Query caches invalidated by page reload`,
        ]),

        h2("10.6  RSS Live Feed Flow"),
        codeBlock([
          `User visits /feeds page`,
          `  ↓`,
          `feeds.tsx: GET /api/feeds/news?category=all`,
          `         + GET /api/feeds/commodities`,
          `  ↓`,
          `feeds.ts: check in-memory cache (15-min TTL)`,
          `  Cache hit → return cached response immediately`,
          `  Cache miss → Promise.all(16 feeds.map(fetchOneFeed))`,
          `    each fetchOneFeed: parser.parseURL(googleNewsUrl) → max 8 items`,
          `    flat + sort by publishedAt DESC → cache → return`,
          `  ↓`,
          `commodities: Promise.all(6 Yahoo Finance chart API calls)`,
          `  stale check: isStale = ageMs > 14 days`,
          `  ↓`,
          `feeds.tsx: render category tabs + article cards + commodity ticker`,
        ]),

        h2("10.7  Add Signal Flow"),
        codeBlock([
          `User clicks "+ Add Signal" on Signals page`,
          `  ↓`,
          `signals.tsx: opens Radix Dialog modal`,
          `  Form fields: company, category, scope, summary, strength, action,`,
          `               source, financial_impact, sc_relevance, trajectory_dir`,
          `  ↓`,
          `Submit: POST /api/signals { ...formData }`,
          `  ↓`,
          `signals.ts: CreateSignalBody.safeParse(req.body) → insert → return 201`,
          `  ↓`,
          `TanStack Query: invalidateQueries("signals") → re-fetch → new signal appears`,
        ]),

        h2("10.8  Cross-Module Navigation Flow"),
        codeBlock([
          `From Company Detail page:`,
          `  "Ask AI about HUL" button:`,
          `    sessionStorage.setItem("rp_ask_prefill", "Analyse HUL supply chain...")`,
          `    navigate("/ask")`,
          `  ↓`,
          `Ask page mounts:`,
          `    useEffect → reads sessionStorage.getItem("rp_ask_prefill")`,
          `    → setInput(prefill) → sessionStorage.removeItem("rp_ask_prefill")`,
          `    Prefilled query ready to send`,
          ``,
          `From SHEI Card Detail:`,
          `  Similar pattern — prefills with SHEI-specific analysis prompt`,
          ``,
          `From Signals page:`,
          `  "Ask AI about signal" → prefills with signal summary context`,
        ]),

        // ─── CLOSING ─────────────────────────────────────────────────────
        pageBreak(),
        new Paragraph({
          children: [new TextRun({ text: "END OF DOCUMENT", bold: true, size: 28, color: "4f46e5" })],
          alignment: AlignmentType.CENTER,
          spacing: { before: 480, after: 240 },
        }),
        new Paragraph({
          children: [new TextRun({
            text: "Industry Research Pod · Full Technical Blueprint · Version 1.0 · May 2026",
            size: 18, color: "aaaaaa",
          })],
          alignment: AlignmentType.CENTER,
          spacing: { after: 80 },
        }),
        new Paragraph({
          children: [new TextRun({
            text: "Confidential — Thoucentric Internal Use Only",
            italics: true, size: 18, color: "aaaaaa",
          })],
          alignment: AlignmentType.CENTER,
        }),
      ],
    },
  ],
});

// ─── Write file ────────────────────────────────────────────────────────────

const outDir = join(__dirname, "..", "exports");
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "Industry_Research_Pod_Technical_Blueprint.docx");

const buffer = await Packer.toBuffer(doc);
writeFileSync(outPath, buffer);
console.log(`Blueprint written: ${outPath} (${(buffer.length / 1024).toFixed(0)} KB)`);
