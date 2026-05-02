import {
  Document, Packer, Paragraph, TextRun, HeadingLevel,
  AlignmentType, BorderStyle, ShadingType, WidthType,
  Table, TableRow, TableCell, TableBorders, convertInchesToTwip,
} from "docx";
import { writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// ── Helpers ─────────────────────────────────────────────────────────────────

const PURPLE  = "7c3aed";
const GREEN   = "16a34a";
const AMBER   = "d97706";
const RED     = "dc2626";
const BLUE    = "2563eb";
const DARK    = "1e1b4b";
const MUTED   = "6b7280";

function h1(text: string): Paragraph {
  return new Paragraph({
    children: [new TextRun({ text, bold: true, size: 36, color: PURPLE, font: "Courier New" })],
    spacing: { before: 500, after: 160 },
    border: { bottom: { style: BorderStyle.THICK, size: 8, color: PURPLE } },
  });
}

function h2(text: string): Paragraph {
  return new Paragraph({
    children: [new TextRun({ text, bold: true, size: 28, color: DARK })],
    spacing: { before: 320, after: 120 },
    border: { left: { style: BorderStyle.THICK, size: 12, color: PURPLE } },
    indent: { left: 160 },
  });
}

function h3(text: string, color = DARK): Paragraph {
  return new Paragraph({
    children: [new TextRun({ text, bold: true, size: 24, color })],
    spacing: { before: 200, after: 80 },
  });
}

function p(text: string, opts: { bold?: boolean; color?: string; size?: number } = {}): Paragraph {
  return new Paragraph({
    children: [new TextRun({ text, bold: opts.bold, color: opts.color ?? DARK, size: opts.size ?? 22 })],
    spacing: { before: 80, after: 80 },
  });
}

function b(text: string, level = 0): Paragraph {
  return new Paragraph({
    children: [new TextRun({ text, size: 21, color: DARK })],
    bullet: { level },
    spacing: { before: 50, after: 50 },
    indent: { left: 360 + level * 360 },
  });
}

function nb(text: string, num: number): Paragraph {
  return new Paragraph({
    children: [new TextRun({ text: `${num}.  ${text}`, size: 21, color: DARK })],
    spacing: { before: 60, after: 60 },
    indent: { left: 360 },
  });
}

function code(line: string): Paragraph {
  return new Paragraph({
    children: [new TextRun({ text: line, font: "Courier New", size: 18, color: "1e1b4b" })],
    shading: { type: ShadingType.SOLID, color: "f3f0ff", fill: "f3f0ff" },
    spacing: { before: 40, after: 40 },
    indent: { left: 360 },
  });
}

function codeBlock(lines: string[]): Paragraph[] {
  return lines.map(l => code(l));
}

function rule(text: string, color = RED): Paragraph {
  return new Paragraph({
    children: [new TextRun({ text: `  ${text}  `, bold: true, size: 22, color: "ffffff" })],
    shading: { type: ShadingType.SOLID, color, fill: color },
    spacing: { before: 120, after: 80 },
    alignment: AlignmentType.LEFT,
  });
}

const CALLOUT_BG: Record<string, string> = {
  [PURPLE]: "ede9fe",
  [GREEN]:  "dcfce7",
  [AMBER]:  "fef9c3",
  [RED]:    "fee2e2",
  [BLUE]:   "dbeafe",
  [DARK]:   "f3f4f6",
};

function callout(label: string, text: string, color = PURPLE): Paragraph[] {
  const bg = CALLOUT_BG[color] ?? "f3f0ff";
  return [
    new Paragraph({
      children: [
        new TextRun({ text: `  ${label}  `, bold: true, size: 20, color: "ffffff" }),
        new TextRun({ text: `  ${text}`, size: 21, color: DARK }),
      ],
      shading: { type: ShadingType.SOLID, color: bg, fill: bg },
      border: { left: { style: BorderStyle.THICK, size: 10, color } },
      spacing: { before: 80, after: 80 },
      indent: { left: 120 },
    }),
  ];
}

function sep(n = 1): Paragraph[] {
  return Array.from({ length: n }, () => new Paragraph({ text: "", spacing: { before: 60, after: 60 } }));
}

function divider(): Paragraph {
  return new Paragraph({
    text: "",
    border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: "e2e0f0" } },
    spacing: { before: 160, after: 160 },
  });
}

function agentBox(icon: string, name: string, role: string, color: string, items: string[]): Paragraph[] {
  const bg = CALLOUT_BG[color] ?? "f3f0ff";
  return [
    new Paragraph({
      children: [new TextRun({ text: `${icon}  ${name}`, bold: true, size: 26, color })],
      shading: { type: ShadingType.SOLID, color: bg, fill: bg },
      border: {
        top: { style: BorderStyle.SINGLE, size: 6, color },
        bottom: { style: BorderStyle.SINGLE, size: 2, color: "e2e0f0" },
        left: { style: BorderStyle.THICK, size: 14, color },
        right: { style: BorderStyle.SINGLE, size: 2, color: "e2e0f0" },
      },
      spacing: { before: 160, after: 60 },
      indent: { left: 160 },
    }),
    new Paragraph({
      children: [new TextRun({ text: `Role: ${role}`, size: 20, italics: true, color: MUTED })],
      spacing: { before: 0, after: 80 },
      indent: { left: 240 },
    }),
    ...items.map(i =>
      new Paragraph({
        children: [new TextRun({ text: `    • ${i}`, size: 20, color: DARK })],
        spacing: { before: 40, after: 40 },
        indent: { left: 240 },
      })
    ),
    ...sep(1),
  ];
}

// ── Document ─────────────────────────────────────────────────────────────────

const doc = new Document({
  creator: "Thoucentric",
  title: "Industry Research Pod — Unbeatable Master Build Prompt v3",
  description: "Complete intelligence OS specification: Bloomberg × McKinsey × Consulting BD Engine",
  styles: {
    default: {
      document: { run: { font: "Calibri", size: 22, color: DARK } },
    },
  },
  sections: [{
    properties: { page: { margin: { top: 900, bottom: 900, left: 1100, right: 1100 } } },
    children: [

      // ══════════════════════════════════════════════════════════════
      // COVER
      // ══════════════════════════════════════════════════════════════
      new Paragraph({
        children: [new TextRun({ text: "INDUSTRY RESEARCH POD", bold: true, size: 72, color: PURPLE, font: "Courier New" })],
        alignment: AlignmentType.CENTER, spacing: { before: 800, after: 160 },
      }),
      new Paragraph({
        children: [new TextRun({ text: "UNBEATABLE MASTER BUILD PROMPT", bold: true, size: 36, color: DARK })],
        alignment: AlignmentType.CENTER, spacing: { before: 0, after: 120 },
      }),
      new Paragraph({
        children: [new TextRun({ text: "Bloomberg × McKinsey × Consulting BD Engine", size: 28, color: MUTED, italics: true })],
        alignment: AlignmentType.CENTER, spacing: { before: 0, after: 120 },
      }),
      new Paragraph({
        children: [new TextRun({ text: "Thoucentric FMCG Intelligence Platform  ·  Version 3.0 Production+  ·  Grade: Top 0.001%", size: 20, color: MUTED })],
        alignment: AlignmentType.CENTER, spacing: { before: 0, after: 400 },
      }),
      ...callout("FINAL TEST", "If the output cannot be used in a CXO meeting tomorrow → it is not acceptable.", RED),
      ...callout("IDENTITY", "This is NOT a dashboard. This is Bloomberg (signals) + McKinsey (insight) + Consulting action engine.", PURPLE),
      divider(),

      // ══════════════════════════════════════════════════════════════
      // PART I — INTELLIGENCE OS
      // ══════════════════════════════════════════════════════════════
      new Paragraph({
        children: [new TextRun({ text: "PART I  —  INTELLIGENCE OPERATING SYSTEM", bold: true, size: 32, color: PURPLE, font: "Courier New" })],
        spacing: { before: 400, after: 200 },
      }),

      // ── 1. PROJECT IDENTITY ────────────────────────────────────────
      h1("1.  PROJECT IDENTITY"),
      p("Build a consulting-grade FMCG market intelligence platform called Industry Research Pod for Thoucentric, a supply chain and procurement consulting firm. The platform is used exclusively by Thoucentric consultants to:"),
      b("Prepare for CXO client meetings at FMCG companies"),
      b("Identify structural supply chain and procurement opportunities"),
      b("Convert intelligence patterns into consulting engagements"),
      ...sep(),
      p("Every number, insight, benchmark, and signal must be grounded — no vague language, no filler, no 'it depends'. Every output must answer: Would a CXO change a decision based on this?"),
      divider(),

      // ── 2. INTELLIGENCE ARCHITECTURE ──────────────────────────────
      h1("2.  INTELLIGENCE ARCHITECTURE  (Multi-Agent OS)"),
      p("The system operates as a multi-agent intelligence OS. It does NOT answer questions. It:"),
      ...codeBlock([
        "Signal → Pattern → Hypothesis → Validation → Impact → Decision → Opportunity",
        "Company → KPI Gap → Industry Comparison → Consulting Opportunity",
      ]),
      ...sep(),
      ...agentBox("AGENT 1", "Signal Intelligence Agent", "MBB Partner + Hedge Fund Analyst", "2563eb", [
        "Simulate continuous ingestion from: earnings transcripts, news, regulatory updates, commodity prices (cocoa, palm oil, tea, edible oils), channel trend reports (GT / MT / Q-commerce), competitor announcements",
        "Extract 3–6 relevant signals per query",
        "Classify every signal: Company-specific | Industry-wide | Macro (geopolitical / commodity / regulatory)",
        "Assign strength: HIGH (structural shift) | MEDIUM (emerging trend) | LOW (noise / isolated)",
        "Surface latest signals first — never rely only on static knowledge",
        "Identify cross-company signal overlaps (same signal appearing at 2+ companies = pattern)",
      ]),
      ...agentBox("AGENT 2", "SHEI Insight Agent", "McKinsey Partner + Structural Analyst", "7c3aed", [
        "TRIGGER: When 2+ signals align → auto-generate a SHEI hypothesis card",
        "SHEI structure: Signal Cluster → Hypothesis (testable) → Evidence (multi-company) → Contradictions → KPI Linkage → Financial Impact → Consulting Angle",
        "Prefer auto-generated SHEI over static DB templates — dynamic synthesis is higher value",
        "Every SHEI must be validated against minimum 2–3 peer companies",
        "SHEI is only valid if: non-obvious, testable, quantified, actionable",
      ]),
      ...agentBox("AGENT 3", "KPI & Quant Validation Agent", "CFO + Benchmarking Engine", GREEN, [
        "Validate EVERY insight against: Forecast Accuracy (MAPE), Inventory Days (DSI), Margin %, Revenue Growth %, Perfect Order Rate, Cash-to-Cash Cycle, SC Cost as % Revenue",
        "For every KPI referenced: output Best-in-Class | Industry Median | Laggard (with company names)",
        "FAILURE RULE: If an insight has no quantitative grounding → mark INVALID, do not surface it",
        "Quantify directional or numeric impact: Revenue (₹Cr / $M), Margin (bps or %), Working Capital (days)",
        "Include calculation logic (e.g. 'at $9,200/ton cocoa vs $2,600 baseline: every $1,000 = ~₹40–60 Cr EBIT for mid-size India confectionery')",
      ]),
      ...agentBox("AGENT 4", "Decision & BD Activation Agent", "Consulting BD Leader + CXO Advisor", AMBER, [
        "Convert every validated insight into: 2–3 specific CXO decisions with timeline",
        "Timeline: Immediate (0–3 months) | Medium-term (6–12 months)",
        "Thoucentric engagement definition: entry point, engagement type (diagnostic / transformation / advisory), value creation estimate",
        "Generate 2 sharply-worded provocative CXO questions for the meeting",
        "Assign Confidence Level: HIGH | MEDIUM | LOW with explicit reasoning",
      ]),
      divider(),

      // ── 3. MANDATORY REASONING PIPELINE ──────────────────────────
      h1("3.  MANDATORY REASONING PIPELINE  (Non-Negotiable)"),
      rule("EXECUTE THIS PIPELINE INTERNALLY BEFORE GENERATING ANY OUTPUT", RED),
      ...sep(),
      ...codeBlock([
        "STEP 1: SIGNAL EXTRACTION",
        "  Identify 3–6 relevant signals (company + industry + macro)",
        "  Classify and assign strength (HIGH / MEDIUM / LOW)",
        "  Check: any 2 signals aligning? → Trigger SHEI auto-generation",
        "",
        "STEP 2: PATTERN DETECTION",
        "  Cluster signals into 1–2 themes:",
        "  Demand volatility | Cost inflation | Channel shift | Regulatory pressure | Capacity gap",
        "",
        "STEP 3: HYPOTHESIS FORMATION",
        "  Define the structural problem or opportunity in one testable sentence",
        "  Must be non-obvious — if a junior analyst could write it, reject and deepen",
        "",
        "STEP 4: VALIDATION",
        "  Validate against KPI benchmarks (best-in-class / median / laggard)",
        "  Compare against 2–3 peer companies minimum",
        "  Check for contradictions: Revenue↑ but Margin↓ | Inventory↑ with low demand | Strategy vs execution mismatch",
        "",
        "STEP 5: IMPACT ESTIMATION",
        "  Quantify: Revenue (₹Cr / $M) | Margin (bps) | Working capital (days) | Capex required",
        "  Include directional impact if exact numbers unavailable",
        "",
        "STEP 6: DECISION LAYER",
        "  Define: What CXO must decide immediately (0–3 months)",
        "  Define: What programme must be initiated (6–12 months)",
        "  Define: Thoucentric entry point (specific, named engagement)",
        "",
        "ONLY THEN → generate formatted output",
      ]),
      divider(),

      // ── 4. MANDATORY OUTPUT STRUCTURE ─────────────────────────────
      h1("4.  MANDATORY OUTPUT STRUCTURE  (Every AI Response)"),
      p("Every response from the Ask Anything module must follow this exact structure. No exceptions."),
      ...sep(),
      h3("SECTION 1 — SIGNALS (What is happening)", BLUE),
      b("3–5 data-backed events with ₹ / % / days / $M values"),
      b("Source: earnings, news, commodity prices, channel data"),
      b("Classify each: [COMPANY] / [INDUSTRY] / [MACRO]  ·  Strength: HIGH / MEDIUM / LOW"),
      b("Time-aware: show trend direction, not just current state"),
      ...sep(),
      h3("SECTION 2 — PATTERN & INSIGHT (What it means)", PURPLE),
      b("Non-obvious interpretation — the 'so what' a junior analyst would miss"),
      b("Identify cross-company pattern if signals overlap"),
      b("Call out contradictions explicitly (Revenue↑ Margin↓ = efficiency problem, not growth success)"),
      b("Show TRAJECTORY: Past state (6–12 months ago) → Current state → Direction → Inflection point"),
      ...sep(),
      h3("SECTION 3 — INDUSTRY COMPARISON", GREEN),
      b("2–3 peer companies minimum — who is ahead, who is lagging, WHY (capability / investment / execution)"),
      b("Comparison must be quantified: not 'Company A is better' but 'Company A MAPE 9% vs Company B MAPE 22%'"),
      b("Identify the leader's specific practice that creates the advantage"),
      ...sep(),
      h3("SECTION 4 — KPI VALIDATION", AMBER),
      b("Explicit KPI reference (Forecast Accuracy / Inventory Days / Margin % / Fill Rate / etc.)"),
      b("Benchmark range: Best-in-class (named company) | Industry Median | Laggard"),
      b("Subject company's position on this spectrum"),
      b("If no quantitative grounding available → state confidence level and directional estimate"),
      ...sep(),
      h3("SECTION 5 — FINANCIAL IMPACT", RED),
      b("Revenue impact (₹Cr or $M, with calculation logic)"),
      b("Margin impact (bps or % points)"),
      b("Working capital impact (days or ₹Cr)"),
      b("Capex or investment required if a programme is triggered"),
      ...sep(),
      h3("SECTION 6 — DECISIONS REQUIRED", DARK),
      b("2–3 specific CXO decisions — not recommendations, DECISIONS"),
      b("Immediate (0–3 months): what must be done NOW before the window closes"),
      b("Medium-term (6–12 months): what programme must be initiated"),
      b("Decision framing: 'The company must choose between X and Y by [date] because [consequence]'"),
      ...sep(),
      h3("SECTION 7 — THOUCENTRIC OPPORTUNITY", PURPLE),
      b("Specific engagement name (e.g. 'Demand Sensing Transformation', 'EPR Compliance SC Programme')"),
      b("Entry point: which executive, which pain, which trigger event"),
      b("Engagement type: Diagnostic (6-8 weeks) | Transformation (6-18 months) | Advisory (retainer)"),
      b("Estimated value creation for client (₹Cr or $M) — makes the business case"),
      ...sep(),
      h3("SECTION 8 — CONFIDENCE & INTELLIGENCE QUALITY", MUTED),
      b("Confidence: HIGH (strong data + peer validation) | MEDIUM (directional) | LOW (hypothesis only)"),
      b("Intelligence quality check: Non-obvious? Actionable? Quantified? Would CXO act? If any = NO → refine"),
      ...sep(),
      h3("SECTION 9 — CXO QUESTIONS", RED),
      b("2 sharply-worded questions that create discomfort and provoke honest answers"),
      b("Format: 'Given that [data point], what is your plan to [action] before [deadline]?'"),
      divider(),

      // ── 5. SIGNAL INGESTION ENGINE ─────────────────────────────────
      h1("5.  REAL-TIME SIGNAL INGESTION ENGINE"),
      p("The system simulates continuous ingestion from multiple source types. Every DB-stored signal must match this classification standard."),
      ...sep(),
      h2("5a. Signal Source Types"),
      b("Earnings transcripts — quarterly results, management commentary, analyst Q&A"),
      b("News & regulatory updates — SEBI filings, MoEFCC circulars, FSSAI, BIS, import/export policy"),
      b("Commodity price movements — cocoa (ICE), palm oil (BMD), crude (Brent), wheat, soybean, tea auctions (Guwahati, Mombasa, Colombo)"),
      b("Channel trends — Q-commerce GMV, GT outlet coverage growth, MT shelf-space allocation, e-commerce penetration"),
      b("Competitor announcements — capex, M&A, new product launches, pricing moves, distribution expansion"),
      ...sep(),
      h2("5b. Signal Classification (mandatory tags)"),
      b("Scope: COMPANY_SPECIFIC | INDUSTRY_WIDE | MACRO"),
      b("Category: SUPPLY_CHAIN | PROCUREMENT | DISTRIBUTION_GTM | DIGITAL | ESG | REGULATORY"),
      b("Strength: HIGH (structural shift — lasting >12 months) | MEDIUM (emerging trend — 6–12 months) | LOW (noise — <3 months)"),
      b("Action: ACT_NOW (window <3 months) | INVESTIGATE (window 3–9 months) | MONITOR (watch)"),
      b("EventType: EARNINGS_SIGNAL | MACRO_EVENT | INDUSTRY_REPORT | REGULATION | DISRUPTION | COMPETITIVE_MOVE"),
      ...sep(),
      h2("5c. Auto-SHEI Trigger Rule"),
      rule("When 2+ signals with the same theme align across different companies → auto-generate SHEI card", PURPLE),
      b("Example: Cocoa price signal (Mondelez) + Margin compression signal (Nestlé) + Volume decline signal (ITC Chocolates) → SHEI: 'India confectionery margin floor event — recipe reformulation or price increase is now unavoidable'"),
      b("Auto-SHEI takes priority over static DB SHEI cards in AI output"),
      b("Auto-SHEI must be validated: hypothesis testable? 2+ companies? financial impact quantified?"),
      divider(),

      // ── 6. HISTORICAL TREND MEMORY ────────────────────────────────
      h1("6.  HISTORICAL TREND MEMORY  (Trajectory Thinking)"),
      rule("NEVER give static analysis. Always show trajectory.", PURPLE),
      ...sep(),
      p("For every analysis, the system must output temporal context:"),
      ...codeBlock([
        "1. PAST STATE    — What was true 6–12 months ago (with data)",
        "2. CURRENT STATE — What is true now (with data)",
        "3. DIRECTION     — Improving / Deteriorating / Stable (with velocity)",
        "4. INFLECTION PT — Was there a specific event that changed the trajectory?",
        "5. PROJECTION    — Where does this go in next 6–12 months if nothing changes?",
      ]),
      ...sep(),
      p("Example trajectory for HUL Forecast Accuracy:"),
      b("Past (Q2 FY24): MAPE 16%, monthly S&OP, GT-dominant model"),
      b("Current (Q1 FY26): MAPE 19% (deteriorated), q-comm now 17% of revenue but forecast model unchanged"),
      b("Direction: Deteriorating — q-comm velocity 6–8x faster than GT disrupts monthly planning cycle"),
      b("Inflection: Q1 FY25 when q-comm crossed 10% of HUL revenue — S&OP model never adapted"),
      b("Projection: MAPE reaches 24–26% by Q3 FY26 if separate q-comm planning not implemented"),
      divider(),

      // ── 7. INTELLIGENCE DIFFERENTIATION RULES ─────────────────────
      h1("7.  INTELLIGENCE DIFFERENTIATION RULES"),
      rule("If a junior analyst could write this insight → REJECT IT", RED),
      ...sep(),
      h2("7a. Non-Obvious Pattern Test"),
      b("Surface cross-company differences that are structurally driven — not accidental"),
      b("Identify when industry consensus is WRONG (e.g. 'everyone says premiumisation is working — but 3 companies show volume-value inversion in rural Tier 3')"),
      b("Detect leading indicators before they show up in quarterly results"),
      b("Call out when a company's stated strategy contradicts its operational metrics"),
      ...sep(),
      h2("7b. Contradiction Detection (Mandatory)"),
      b("Revenue ↑ but Margin ↓ → cost structure problem or channel mix deterioration"),
      b("Volume ↑ but Inventory ↑ → demand sensing failure, not demand strength"),
      b("Growth ↑ but Distribution reach flat → urban/online concentration, rural stagnation"),
      b("Stated 'premiumisation strategy' but ASP declining → execution gap"),
      b("Management claims 'SC efficiency' but Cash-to-Cash cycle worsening → working capital trap"),
      ...sep(),
      h2("7c. The CXO Standard"),
      ...callout("QUALITY GATE", "Before every output: Is it non-obvious? Is it actionable? Is it quantified? Would a CXO change a decision? If any answer is NO → refine before surfacing.", RED),
      divider(),

      // ══════════════════════════════════════════════════════════════
      // PART II — ENGINEERING SPECIFICATION
      // ══════════════════════════════════════════════════════════════
      new Paragraph({
        children: [new TextRun({ text: "PART II  —  ENGINEERING SPECIFICATION", bold: true, size: 32, color: PURPLE, font: "Courier New" })],
        spacing: { before: 600, after: 200 },
      }),

      // ── 8. TECH STACK ──────────────────────────────────────────────
      h1("8.  TECH STACK  (Non-Negotiable)"),
      b("Monorepo: pnpm workspaces (pnpm-workspace.yaml)"),
      b("Frontend: React 18 + Vite, TypeScript strict, Tailwind CSS v3, shadcn/ui"),
      b("Backend: Express.js, TypeScript, Zod validation on all inputs/outputs"),
      b("Database: PostgreSQL + Drizzle ORM (schema-first, drizzle-kit push for migrations)"),
      b("AI: OpenAI GPT-4o via streaming SSE — token-by-token (never buffer-then-return)"),
      b("State / Fetching: TanStack React Query v5"),
      b("API Contract: OpenAPI 3.0 spec → Orval codegen (React Query hooks + Zod schemas) — define spec FIRST"),
      b("Markdown: react-markdown for AI chat response rendering"),
      b("Routing: React Router v6 | Icons: lucide-react | Fonts: JetBrains Mono + system sans"),
      ...sep(),
      h2("Monorepo Package Structure"),
      ...codeBlock([
        "/",
        "├── artifacts/",
        "│   ├── api-server/          # Express API  (@workspace/api-server)",
        "│   └── research-pod/        # React+Vite   (@workspace/research-pod)",
        "├── lib/",
        "│   ├── db/                  # Drizzle schema + client  (@workspace/db)",
        "│   ├── api-spec/            # OpenAPI spec + Orval codegen  (@workspace/api-spec)",
        "│   └── integrations-openai-ai-server/  # OpenAI client wrapper",
        "├── pnpm-workspace.yaml",
        "└── tsconfig.base.json",
      ]),
      p("Each artifact binds to PORT env variable (never hard-code ports). Proxy routes /api → api-server. Frontend uses relative URLs only.", { color: MUTED }),
      divider(),

      // ── 9. DATABASE SCHEMA ─────────────────────────────────────────
      h1("9.  DATABASE SCHEMA  (5 Tables)"),
      p("All tables in lib/db/src/schema/. Export via lib/db/src/index.ts. Use pgTable, text, integer, serial, jsonb."),
      ...sep(),

      h2("9a. companies"),
      ...codeBlock([
        "id             serial PK",
        "name           text NOT NULL     // ticker-style: 'HUL', 'NESTLE', 'ITC'",
        "fullName       text NOT NULL     // 'Hindustan Unilever Limited'",
        "geography      text NOT NULL     // 'India' | 'India / Global' | 'Global'",
        "revenue        text              // '₹59,579 Cr (FY25)'",
        "revenueGrowth  text              // '+7% YoY'",
        "ebitdaMargin   text              // '23.8%'",
        "marketCap      text              // '₹5.2L Cr'",
        "categories     text              // 'Home Care · Personal Care · Foods'",
        "quickTake      text              // 2-sentence consulting-grade summary",
        "openProblems   text              // specific gaps with ₹Cr impact",
        "scIntelligence text              // SC-specific intelligence paragraph",
        "strategicPriorities text         // FY26 stated priorities",
        "consultingAngle text             // Thoucentric-specific entry point",
        "sheiScore      integer           // 0-100 composite SHEI readiness",
        "lastUpdated    text              // 'Q4 FY25' or 'Q1 FY26'",
      ]),

      h2("9b. shei_cards  (SHEI = Supply chain / Human capital / ESG / Innovation)"),
      ...codeBlock([
        "id                 serial PK",
        "title              text NOT NULL",
        "functionTag        text NOT NULL  // 'SUPPLY_CHAIN'|'PROCUREMENT'|'DISTRIBUTION'|'ESG'|'DIGITAL'",
        "urgency            text NOT NULL  // 'CRITICAL'|'HIGH'|'MEDIUM'",
        "signal             text NOT NULL  // Observable trend, 2–3 sentences, with numbers",
        "hypothesis         text NOT NULL  // Testable consulting hypothesis",
        "evidence           text NOT NULL  // Multi-company data points, financials",
        "contradictions     text           // Any contradictions found in evidence",
        "clientImplication  text NOT NULL",
        "financialImpact    text NOT NULL  // ₹Cr or €M, with calculation logic",
        "thoucentriqAngle   text NOT NULL  // Named Thoucentric service line + engagement type",
        "kpiLinkage         text           // Which KPIs this SHEI affects",
        "relatedCompanies   text[]         // ['HUL', 'Marico']",
        "signalCluster      text           // Which signals triggered this SHEI",
        "whyNow             text NOT NULL  // Why urgent NOW (Q-specific event)",
        "trajectoryContext  text           // Past vs current state comparison",
        "quarter            text           // 'Q1 FY26'",
        "nextReview         text           // '2025-07-01'",
      ]),

      h2("9c. signals"),
      ...codeBlock([
        "id               serial PK",
        "summary          text NOT NULL   // '[Company]: [Event] — [Impact]' (headline)",
        "category         text NOT NULL   // 'SUPPLY_CHAIN'|'PROCUREMENT'|'DISTRIBUTION_GTM'|'DIGITAL'|'ESG'|'REGULATORY'",
        "scope            text            // 'COMPANY_SPECIFIC'|'INDUSTRY_WIDE'|'MACRO'",
        "action           text NOT NULL DEFAULT 'MONITOR'  // 'ACT_NOW'|'INVESTIGATE'|'MONITOR'",
        "source           text            // Citation string",
        "publishedDate    text            // 'YYYY-MM-DD' — always recent (≤12 months)",
        "quarter          text            // 'Q4 FY25' or 'Q1 FY26'",
        "eventType        text            // 'EARNINGS_SIGNAL'|'MACRO_EVENT'|'INDUSTRY_REPORT'|'REGULATION'|'DISRUPTION'|'COMPETITIVE_MOVE'",
        "strength         text            // 'HIGH'|'MEDIUM'|'LOW'",
        "companyName      text            // 'HUL' or 'All FMCG'",
        "financialImpact  text            // Quantified paragraph with calculation logic",
        "scRelevance      text            // SC / procurement consulting angle",
        "pastState        text            // What was true 6–12 months ago",
        "trajectoryDir    text            // 'IMPROVING'|'DETERIORATING'|'STABLE'",
      ]),

      h2("9d. benchmarks"),
      ...codeBlock([
        "id                    serial PK",
        "kpiName               text NOT NULL   // 'Forecast Accuracy (MAPE)'",
        "functionTag           text NOT NULL",
        "bestInClass           text NOT NULL   // value + company name",
        "industryMedian        text NOT NULL",
        "laggard               text NOT NULL",
        "unit                  text",
        "whyItMatters          text NOT NULL",
        "companyExamples       text NOT NULL",
        "indiaContext          text NOT NULL",
        "thoucentricBenchmark  text",
        "calculationLogic      text            // How to compute this KPI",
      ]),

      h2("9e. playbook_sections"),
      ...codeBlock([
        "id              serial PK",
        "title           text NOT NULL",
        "functionTag     text NOT NULL",
        "sectionNumber   integer NOT NULL",
        "status          text NOT NULL   // 'ACTIVE'|'DRAFT'|'ARCHIVED'",
        "whyItMatters    text NOT NULL",
        "targetClient    text",
        "entryPoint      text",
        "deliverables    text",
        "timeline        text",
        "valueCapture    text",
        "triggerSignals  text            // Which signal types activate this playbook",
      ]),
      divider(),

      // ── 10. DATA SEEDING ──────────────────────────────────────────
      h1("10.  DATA SEEDING STRATEGY"),
      rule("REMOVE ALL 'seed exactly N' HARD LIMITS — comprehensive coverage is mandatory", RED),
      ...sep(),
      p("Seed runs on every API server startup via seedDatabase(force=true) — clears all tables and reseeds. No conditional skip. Goal: comprehensive, not minimal."),
      ...sep(),

      h2("10a. Companies — comprehensive coverage"),
      b("India-listed FMCG majors (target 18+): HUL, Nestlé India, ITC, Marico, Dabur, Britannia, Godrej Consumer, Colgate-Palmolive India, Emami, Tata Consumer, Bikaji Foods, Honasa/Mamaearth, Patanjali Foods, Varun Beverages, Jyothy Labs, Zydus Wellness, CCL Products, Heritage Foods"),
      b("India unlisted / co-operative (4+): Amul (GCMMF), Haldiram's, Wagh Bakri, MDH Spices"),
      b("Global majors with India operations (8+): P&G India, Mars India, Reckitt India, Kellogg India (now Mars), Mondelez India, PepsiCo India, Coca-Cola India, Perfetti Van Melle India"),
      b("Global FMCG — international coverage (5+): Unilever Global, Nestlé S.A. Global, Ekaterra/Lipton, Kraft Heinz, AB InBev, Diageo, Reckitt Global, Danone, Beiersdorf, Kimberly-Clark, Hershey, Conagra, Pernod Ricard, Ferrero — add any major as intelligence warrants"),
      p("Every company: fill ALL fields including trajectoryContext (how have they evolved over 12 months), contradictions in their reported vs actual performance, consultingAngle with specific named engagement."),

      h2("10b. Signals — continuously expanding"),
      b("No hard limit. Add new signals as events occur. Aim for comprehensive Q4 FY25 + Q1 FY26 coverage."),
      b("All publishedDate values within last 12 months. Quarter: Q4 FY25 or Q1 FY26."),
      b("Every signal must have: financialImpact (with calculation logic), scRelevance (consulting angle), pastState (6-12 months prior state), trajectoryDir"),
      b("Coverage must span: earnings signals, macro events, regulatory, disruptions, competitive moves"),
      b("Baseline dataset must include signals for: cocoa crisis, q-commerce disruption, HUL Q4 FY25, Marico results, Mars India pet food, Ekaterra carve-out, Kenya tea, Darjeeling, EPR enforcement, Amul cold chain, Bikaji distribution, Honasa omnichannel, Unilever ice cream separation — then expand"),

      h2("10c. SHEI Cards — dynamic expansion"),
      b("No hard limit. Baseline: 7 foundational cards. Auto-generate new cards when 2+ signals align."),
      b("Every SHEI must now include: contradictions field, kpiLinkage, signalCluster, trajectoryContext"),
      b("Cover at minimum: Q-Commerce SC Architecture, Cocoa Procurement, India EPR, D2C-to-Omnichannel, Post-Carve-Out SC, Tea Origin Diversification, AI Demand Sensing — then expand"),

      h2("10d. Benchmarks — comprehensive KPI coverage"),
      b("No hard limit. Baseline: 15 KPIs. Expand to cover all major SC, procurement, distribution, digital KPIs."),
      b("Every benchmark must include calculationLogic field (how to compute it, not just what it is)"),
      b("KPI list (baseline): Forecast Accuracy (MAPE), Inventory Days, Perfect Order Rate, Procurement Cost %, Supplier Lead Time, Cash-to-Cash Cycle, Distribution Reach, On-Shelf Availability, Demand Planning Cycle, SC Cost %, Order Fill Rate, Return Rate, Digital Order Penetration, ESG Scope 3, Working Capital %"),

      h2("10e. Playbooks — consulting activation layer"),
      b("Baseline 5. Expand as new engagement patterns emerge from signals."),
      b("Every playbook must now include: triggerSignals (which signal types activate this playbook)"),
      b("Core playbooks: Q-Commerce SC Readiness, Procurement Transformation (Commodity-Led), D2C to Omnichannel GTM, ESG & EPR Compliance SC, Post-Carve-Out SC Independence"),
      divider(),

      // ── 11. API ENDPOINTS ──────────────────────────────────────────
      h1("11.  API ENDPOINTS"),
      p("All routes under /api. Define OpenAPI spec FIRST → generate Zod schemas + React Query hooks via Orval codegen."),
      ...codeBlock([
        "GET  /api/healthz",
        "GET  /api/companies               filters: geography, category, sheiScoreMin",
        "GET  /api/companies/:id",
        "GET  /api/shei-cards              filters: urgency, functionTag, quarter",
        "GET  /api/shei-cards/:id",
        "GET  /api/signals                 filters: strength, category, action, scope",
        "GET  /api/benchmarks              filter: functionTag",
        "GET  /api/playbooks",
        "POST /api/ask                     AI chat — streaming SSE",
        "POST /api/admin/reseed            manual reseed trigger",
      ]),
      ...sep(),
      h2("POST /api/ask — Streaming SSE Specification"),
      ...codeBlock([
        "Request:   { messages: Array<{ role: 'user'|'assistant', content: string }> }",
        "",
        "Response headers:",
        "  Content-Type:    text/event-stream",
        "  Cache-Control:   no-cache",
        "  Connection:      keep-alive",
        "  X-Accel-Buffering: no",
        "",
        "Each token:    data: {\"content\": \"token\"}\\n\\n",
        "On complete:   data: [DONE]\\n\\n",
        "On error:      data: {\"error\": \"message\"}\\n\\n  (if headers already sent)",
        "",
        "Implementation:",
        "  1. Parallel Promise.all: query companies + shei_cards + signals + benchmarks from DB",
        "  2. Build system prompt with fresh DB context injected (see Section 12)",
        "  3. openai.chat.completions.create({ model: 'gpt-4o', stream: true, max_completion_tokens: 2000 })",
        "  4. for await (const chunk of stream) → res.write(SSE chunk)",
        "  5. res.write('data: [DONE]') → res.end()",
        "  6. AbortController handled: client can cancel mid-stream",
      ]),
      divider(),

      // ── 12. AI SYSTEM PROMPT ───────────────────────────────────────
      h1("12.  AI SYSTEM PROMPT  (Complete Replacement)"),
      p("This replaces the prior system prompt. Build server-side from live DB query results on every request."),
      ...sep(),
      ...codeBlock([
        "You are an elite FMCG intelligence operating system built for Thoucentric.",
        "You are NOT a chatbot. You are a multi-agent intelligence engine combining:",
        "  - MBB Partner (strategy thinking)",
        "  - Hedge fund analyst (signal detection)",
        "  - FMCG operator (execution expertise)",
        "  - Consulting BD leader (commercialisation)",
        "",
        "TODAY'S DATE: [inject server-side: new Date().toLocaleDateString()]",
        "",
        "YOUR SCOPE: Any FMCG company worldwide — global knowledge + DB context.",
        "DB data is supporting context, not scope limitation. Use your full knowledge freely.",
        "",
        "DATA PRIORITY (in order):",
        "  1. Latest real-world knowledge",
        "  2. Signals from DB (time-aware, classified)",
        "  3. KPI benchmarks (quantified, comparative)",
        "  4. SHEI patterns (auto-generated > static)",
        "  5. DB company profiles (supporting context)",
        "",
        "THOUCENTRIC INTELLIGENCE DATABASE:",
        "",
        "▸ COMPANIES ({N}):",
        "• {name} | {geography} | Rev: {revenue} | EBITDA: {ebitdaMargin}",
        "  Open Problems: {openProblems[:120]} | SC Intelligence: {scIntelligence[:100]}",
        "",
        "▸ SHEI CARDS ({N} active):",
        "• [{urgency}] {title} ({functionTag})",
        "  Signal: {signal[:180]} | Impact: {financialImpact[:120]} | Why Now: {whyNow[:80]}",
        "",
        "▸ LIVE SIGNALS ({N}):",
        "• [{strength}/{eventType}] {companyName} [{scope}] — {summary[:120]}",
        "  SC Angle: {scRelevance[:80]} | Trajectory: {trajectoryDir}",
        "",
        "▸ KPI BENCHMARKS ({N}):",
        "• {kpiName}: Best {bestInClass} | Median {industryMedian} | Laggard {laggard}",
        "  India Context: {indiaContext[:80]}",
        "",
        "MANDATORY REASONING PIPELINE (execute before every output):",
        "  Step 1: Signal extraction (3–6 signals, classify each)",
        "  Step 2: Pattern detection (cluster into 1–2 themes)",
        "  Step 3: Hypothesis formation (one testable structural statement)",
        "  Step 4: Validation (KPI benchmarks + 2–3 peers)",
        "  Step 5: Impact estimation (Revenue ₹Cr / Margin bps / WC days)",
        "  Step 6: Decision layer (Immediate 0–3M + Programme 6–12M)",
        "",
        "MANDATORY OUTPUT FORMAT (every response):",
        "  1. SIGNALS — what is happening (data-backed, time-aware, classified)",
        "  2. PATTERN & INSIGHT — non-obvious interpretation + trajectory",
        "  3. INDUSTRY COMPARISON — 2–3 peers, quantified, leader vs laggard",
        "  4. KPI VALIDATION — explicit KPI + benchmark position",
        "  5. FINANCIAL IMPACT — Revenue / Margin / WC with calculation logic",
        "  6. DECISIONS REQUIRED — 2–3 specific decisions + timeline",
        "  7. THOUCENTRIC OPPORTUNITY — named engagement + entry point",
        "  8. CONFIDENCE — HIGH/MEDIUM/LOW with reasoning",
        "  9. CXO QUESTIONS — 2 provocative questions",
        "",
        "CONTRADICTION DETECTION (mandatory):",
        "  Revenue↑ but Margin↓ | Volume↑ but Inventory↑ | Strategy vs execution mismatch",
        "  Call out explicitly. Never let contradictions pass without flagging.",
        "",
        "INTELLIGENCE QUALITY FILTER (before output):",
        "  Non-obvious? Actionable? Quantified? Would CXO change a decision? If NO → refine.",
        "",
        "INDIA CONTEXT: GT vs MT vs Q-commerce | Rural vs urban demand | Regulatory landscape",
        "GLOBAL CONTEXT: Commodity cycles | Channel shifts | Tech maturity | M&A patterns",
        "",
        "BE OPINIONATED. State clear views. No 'it depends'. No generic consulting language.",
        "Use ₹ for INR, $ for USD, € for EUR. Indian format: ₹59,579 Cr not ₹59579Cr.",
        "",
        "FINAL TEST: 'Does this change a CXO decision?' If not → improve the output.",
      ]),
      divider(),

      // ── 13. FRONTEND MODULES ──────────────────────────────────────
      h1("13.  FRONTEND MODULES  (9 Pages + Layout)"),

      h2("Layout — Persistent Sidebar"),
      b("App name: 'INDUSTRY POD' (font-mono, purple accent), subtitle: 'Thoucentric FMCG Intelligence'"),
      b("Navigation: INTELLIGENCE (Dashboard, Companies, SHEI Cards, Benchmarks) | SIGNALS (Signal Tracker, Timeline) | ACTIVATION (Actions, Ask Anything [AI badge], Playbooks)"),
      b("'Refresh Data' button at bottom → POST /api/admin/reseed → React Query invalidation"),
      b("Sidebar: 240px fixed, bg-[#0d0d14], border-right"),
      ...sep(),

      h2("Page 1: Dashboard (/)"),
      b("Live stats row from DB: companies tracked, active SHEI, live signals, benchmarks"),
      b("Top Signals: 3 highest-strength ACT_NOW + INVESTIGATE signals"),
      b("SHEI carousel (3-wide): urgency badge + financialImpact snippet"),
      b("Intelligence Brief: surface top 1 auto-SHEI pattern if detectable from signal data"),
      ...sep(),

      h2("Page 2: Companies (/companies)"),
      b("Filter: Geography, Category, SHEI score sort"),
      b("Card grid: name, geography, revenue, ebitdaMargin, quickTake (2 lines)"),
      b("Detail modal tabs: Overview | SC Intelligence | Strategic Priorities | Open Problems | Consulting Angle"),
      b("Show related signals and SHEI cards per company"),
      ...sep(),

      h2("Page 3: SHEI Cards (/shei)"),
      b("Filter: urgency, functionTag, quarter"),
      b("Expanded: signal → hypothesis → contradictions (if any) → evidence → kpiLinkage → financialImpact → thoucentriqAngle → whyNow → trajectoryContext"),
      b("'Auto-generated' badge for AI-synthesised cards vs DB static cards"),
      ...sep(),

      h2("Page 4: Benchmarks (/benchmarks)"),
      b("Table: KPI | Best-in-Class (green) | Median (amber) | Laggard (red) | India Context | Calculation Logic"),
      b("Company position indicator: where does the queried company sit on the spectrum?"),
      ...sep(),

      h2("Page 5: Signal Tracker (/signals)"),
      b("Filter: strength, category, action, scope (COMPANY / INDUSTRY / MACRO)"),
      b("Card: strength badge + scope pill + eventType + company + quarter + date + trajectoryDir arrow"),
      b("Body: summary headline + financialImpact (green $) + scRelevance (blue) + pastState (grey history)"),
      b("ACTION badge: ACT_NOW (red) | INVESTIGATE (amber) | MONITOR (blue)"),
      ...sep(),

      h2("Page 6: Timeline (/timeline)"),
      b("Vertical timeline by publishedDate descending with quarter grouping"),
      b("Show trajectoryDir for each signal: ↑ improving / ↓ deteriorating / → stable"),
      ...sep(),

      h2("Page 7: Actions & Activation (/actions)"),
      b("Only ACT_NOW + INVESTIGATE signals. Grouped by action type."),
      b("'NEW' badge on sidebar nav item"),
      ...sep(),

      h2("Page 8: Ask Anything (/ask) — AI Streaming Chat"),
      b("Header: 'Ask Anything' + 'Global FMCG' badge (globe icon)"),
      b("Starter questions (10, 2-column): cover global companies + India + functional topics + trend questions"),
      b("Streaming: token-by-token rendering with cursor blink. Skeleton loader while connecting."),
      b("Conversation memory: full history passed to API on every request (in-memory, session)"),
      b("'New chat' button (top right when messages exist). AbortController on cancel."),
      b("Quick-reply chips after first message. Enter = send, Shift+Enter = newline."),
      b("Footer: 'Streaming · Conversation memory · 4-agent intelligence · Powered by Thoucentric'"),
      ...sep(),

      h2("Page 9: Playbooks (/playbooks)"),
      b("Grid: title, functionTag, status, targetClient, triggerSignals"),
      b("Expandable: entryPoint, deliverables, timeline, valueCapture"),
      divider(),

      // ── 14. DESIGN SYSTEM ─────────────────────────────────────────
      h1("14.  DESIGN SYSTEM"),
      ...codeBlock([
        "Background:  #0a0a0f (page)  #0d0d14 (sidebar)  #13131f (card)",
        "Border:      #1e1e2e (default)  #2a2a3d (hover)",
        "Text:        #e2e8f0 (primary)  #94a3b8 (muted)  #64748b (placeholder)",
        "",
        "Accent palette:",
        "  Primary Purple:  #7c3aed  — buttons, active nav, primary badges",
        "  SUCCESS Green:   #22c55e  — ACT_NOW, positive metrics, bestInClass",
        "  WARNING Amber:   #f59e0b  — INVESTIGATE, MEDIUM urgency, median",
        "  DANGER Red:      #ef4444  — CRITICAL, HIGH strength, laggard",
        "  INFO Blue:       #3b82f6  — MONITOR, MACRO signals, info badges",
        "",
        "Typography:",
        "  Headings/labels/badges: font-mono (JetBrains Mono)",
        "  Body: system sans-serif",
        "",
        "Key patterns:",
        "  Cards:     bg-card border border-border rounded-xl p-4 p-6",
        "  Hover:     hover:border-primary/50 hover:bg-primary/5 transition-all",
        "  Page load: animate-in fade-in duration-300",
        "  AI cursor: inline-block w-1.5 h-3.5 bg-primary/70 animate-pulse rounded-sm",
        "  Trajectory IMPROVING: text-green-400 + ↑ arrow",
        "  Trajectory DETERIORATING: text-red-400 + ↓ arrow",
        "",
        "shadcn/ui components: Badge Button Card Dialog Drawer Input Select",
        "                      Separator Skeleton Tabs Textarea Tooltip",
      ]),
      divider(),

      // ── 15. CONSTRAINTS ────────────────────────────────────────────
      h1("15.  HARD CONSTRAINTS"),

      h2("Data Constraints"),
      b("NEVER use mock or placeholder data. Every number = real estimate from public sources."),
      b("All signal publishedDate values within last 12 months (Q4 FY25 / Q1 FY26 baseline)."),
      b("Financial impacts must include calculation logic — not just a number, but how it was derived."),
      b("All monetary values: ₹ INR / $ USD / € EUR. Indian format: ₹59,579 Cr (never ₹59579Cr)."),
      b("Trajectory context is mandatory for all signals and SHEI cards — no static snapshots."),

      h2("Architecture Constraints"),
      b("OpenAPI spec BEFORE route handlers. Orval codegen for all client hooks."),
      b("Zod validation on all API inputs and outputs (from generated schemas)."),
      b("React Query hooks for all fetching. Raw fetch ONLY for SSE streaming."),
      b("Never call service ports directly. Relative URLs only in application code."),
      b("Seed: force=true always. Clear then reseed. No conditional skip."),

      h2("AI Constraints"),
      b("Model: gpt-4o specifically. max_completion_tokens: 2000."),
      b("Stream via 'for await (const chunk of stream)' — never buffer."),
      b("Fresh DB data injected into system prompt on every request — never cached."),
      b("Full conversation history from frontend on every request."),
      b("AbortController respected — graceful cancel mid-stream."),
      b("INSIGHT QUALITY: Non-obvious? Quantified? Actionable? Would CXO act? All must be YES."),

      h2("Intelligence Constraints"),
      b("REJECT any insight a junior analyst could write. Enforce non-obvious standard."),
      b("Every insight must compare 2–3 peer companies minimum."),
      b("Contradiction detection is mandatory — flag Revenue↑/Margin↓ mismatches explicitly."),
      b("Trajectory is mandatory — past state → current state → direction → inflection."),
      b("Every insight must link to a Thoucentric engagement opportunity (named, specific)."),

      h2("Coverage Constraints"),
      b("No hard limits on number of companies, signals, SHEI cards, benchmarks, or playbooks."),
      b("Expand data coverage as intelligence warrants. Comprehensive > minimal."),
      b("Global FMCG coverage (not India-only): Kraft Heinz, Coca-Cola, Diageo, AB InBev, Reckitt, Danone, Beiersdorf, Kimberly-Clark, Hershey, Conagra, Pernod Ricard, Ferrero, Lindt, and others."),
      divider(),

      // ── 16. ENVIRONMENT ────────────────────────────────────────────
      h1("16.  ENVIRONMENT & DEPLOYMENT"),
      ...codeBlock([
        "Environment variables:",
        "  PORT                              — runtime-assigned per artifact (never hard-code)",
        "  DATABASE_URL                      — PostgreSQL connection string",
        "  SESSION_SECRET                    — session middleware secret",
        "  AI_INTEGRATIONS_OPENAI_BASE_URL   — OpenAI proxy base URL",
        "  AI_INTEGRATIONS_OPENAI_API_KEY    — OpenAI proxy API key",
        "",
        "Services:",
        "  api-server   paths: ['/api']   port: $PORT",
        "  research-pod paths: ['/']      port: $PORT",
        "",
        "DB migration:  drizzle-kit push (before first startup)",
        "Seed:          auto on api-server startup (force=true)",
        "Manual reseed: POST /api/admin/reseed or sidebar 'Refresh Data' button",
      ]),
      divider(),

      // ── 17. QUALITY CHECKLIST ──────────────────────────────────────
      h1("17.  PRE-DELIVERY QUALITY CHECKLIST"),
      b("[ ] All companies load with full detail — no empty fields visible"),
      b("[ ] All signals show with dates in last 12 months + correct action/strength/scope badges"),
      b("[ ] All SHEI cards render all sections including contradictions + trajectoryContext"),
      b("[ ] All benchmarks show bestInClass / median / laggard with colour coding + calculationLogic"),
      b("[ ] Ask Anything streams token-by-token (test with multi-paragraph FMCG question)"),
      b("[ ] Multi-turn conversation works (follow-up referencing prior answer)"),
      b("[ ] AI response follows 9-section output structure"),
      b("[ ] AI calls out at least one contradiction when discussing a company"),
      b("[ ] Starter questions cover 4+ global (non-India) FMCG companies"),
      b("[ ] Dashboard shows live counts from DB (not hardcoded)"),
      b("[ ] Signal Tracker scope filter works (MACRO / INDUSTRY / COMPANY)"),
      b("[ ] trajectoryDir arrows render correctly (↑ / ↓ / →) on signal cards"),
      b("[ ] Empty states: icon + headline + subtext on all filtered views"),
      b("[ ] 'Refresh Data' triggers reseed and React Query invalidation + UI refresh"),
      b("[ ] pnpm run typecheck passes clean (zero TypeScript errors)"),
      b("[ ] No browser console errors on any page"),
      b("[ ] Mobile layout does not break (sidebar collapses on narrow viewport)"),
      b("[ ] INSIGHT QUALITY TEST: Show AI output to a senior FMCG consultant — would they use it in a CXO meeting?"),
      divider(),

      // ── CLOSING ────────────────────────────────────────────────────
      ...sep(2),
      new Paragraph({
        children: [new TextRun({ text: "FINAL POSITIONING", bold: true, size: 28, color: PURPLE, font: "Courier New" })],
        alignment: AlignmentType.CENTER, spacing: { before: 200, after: 160 },
      }),
      ...callout("NOT THIS", "Static dashboard. Generic AI chatbot. Junior-analyst insights. Unsupported claims.", RED),
      ...callout("THIS", "Real-time FMCG intelligence + decision engine. Signal → Insight → Decision → Opportunity.", GREEN),
      ...sep(),
      p("The system must let a consultant ask 'What should I pitch tomorrow to [FMCG CXO]?' and receive a response so sharp, specific, and quantified that they walk into the meeting with the confidence of a senior partner.", { color: DARK }),
      ...sep(2),
      new Paragraph({
        children: [new TextRun({ text: "— Thoucentric Industry Research Pod · Master Prompt v3.0 —", bold: true, size: 22, color: PURPLE, font: "Courier New" })],
        alignment: AlignmentType.CENTER,
      }),
      new Paragraph({
        children: [new TextRun({ text: "Bloomberg (signals) × McKinsey (insight) × Consulting BD Engine", size: 20, color: MUTED, italics: true })],
        alignment: AlignmentType.CENTER,
        spacing: { before: 80 },
      }),
    ],
  }],
});

const buffer = await Packer.toBuffer(doc);
const out = resolve(__dirname, "../../master-prompt-thoucentric-v3.docx");
writeFileSync(out, buffer);
console.log("Written:", out);
