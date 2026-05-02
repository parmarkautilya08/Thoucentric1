import { Router } from "express";
import { openai } from "@workspace/integrations-openai-ai-server";
import { db } from "@workspace/db";
import {
  companiesTable,
  sheiCardsTable,
  signalsTable,
  benchmarksTable,
} from "@workspace/db";

const router = Router();

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

router.post("/ask", async (req, res) => {
  try {
    const { messages } = req.body as { messages?: ChatMessage[] };
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      res.status(400).json({ error: "messages array is required" });
      return;
    }

    const lastUserMessage = messages.filter(m => m.role === "user").at(-1);
    if (!lastUserMessage) {
      res.status(400).json({ error: "At least one user message is required" });
      return;
    }

    // ── AGENT 1: Pull fresh DB context for system prompt ──────────────────
    const [companies, sheiCards, signals, benchmarks] = await Promise.all([
      db.select({
        name: companiesTable.name,
        fullName: companiesTable.fullName,
        geography: companiesTable.geography,
        revenue: companiesTable.revenue,
        ebitdaMargin: companiesTable.ebitdaMargin,
        quickTake: companiesTable.quickTake,
        openProblems: companiesTable.openProblems,
        scIntelligence: companiesTable.scIntelligence,
      }).from(companiesTable),
      db.select({
        title: sheiCardsTable.title,
        functionTag: sheiCardsTable.functionTag,
        urgency: sheiCardsTable.urgency,
        signal: sheiCardsTable.signal,
        hypothesis: sheiCardsTable.hypothesis,
        financialImpact: sheiCardsTable.financialImpact,
        whyNow: sheiCardsTable.whyNow,
        contradictions: sheiCardsTable.contradictions,
        kpiLinkage: sheiCardsTable.kpiLinkage,
        trajectoryContext: sheiCardsTable.trajectoryContext,
      }).from(sheiCardsTable),
      db.select({
        companyName: signalsTable.companyName,
        category: signalsTable.category,
        scope: signalsTable.scope,
        summary: signalsTable.summary,
        strength: signalsTable.strength,
        action: signalsTable.action,
        financialImpact: signalsTable.financialImpact,
        quarter: signalsTable.quarter,
        scRelevance: signalsTable.scRelevance,
        pastState: signalsTable.pastState,
        trajectoryDir: signalsTable.trajectoryDir,
        eventType: signalsTable.eventType,
      }).from(signalsTable),
      db.select({
        kpiName: benchmarksTable.kpiName,
        functionTag: benchmarksTable.functionTag,
        bestInClass: benchmarksTable.bestInClass,
        industryMedian: benchmarksTable.industryMedian,
        laggard: benchmarksTable.laggard,
        whyItMatters: benchmarksTable.whyItMatters,
        indiaContext: benchmarksTable.indiaContext,
        calculationLogic: benchmarksTable.calculationLogic,
      }).from(benchmarksTable),
    ]);

    const today = new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

    const systemPrompt = `You are an elite FMCG intelligence operating system built for Thoucentric, a supply chain and procurement consulting firm.

You are NOT a chatbot. You are a multi-agent intelligence engine composed of four agents acting in concert:
  AGENT 1 — Signal Intelligence Agent (MBB Partner + Hedge Fund Analyst): detects and classifies signals
  AGENT 2 — SHEI Insight Agent (McKinsey Partner): forms and validates hypotheses
  AGENT 3 — KPI & Quant Validation Agent (CFO + Benchmarking Engine): validates every insight against KPIs
  AGENT 4 — Decision & BD Activation Agent (Consulting BD Leader): converts intelligence into CXO decisions

TODAY'S DATE: ${today}

YOUR SCOPE: ANY FMCG company worldwide — Kraft Heinz, Coca-Cola, AB InBev, Diageo, Reckitt, Danone, Beiersdorf, Kimberly-Clark, Hershey, Conagra, Pernod Ricard, Ferrero, Lindt, P&G, Unilever Global, and all others. Use your full real-world knowledge freely. DB data is supporting context, not scope limitation.

DATA PRIORITY (descending):
1. Latest real-world knowledge (last 12 months)
2. Live signals from DB (time-aware, classified by scope)
3. KPI benchmarks (quantified, comparative)
4. SHEI patterns (auto-generated > static)
5. DB company profiles (supporting context)

═══════════════════════════════════════════════
THOUCENTRIC INTELLIGENCE DATABASE — LIVE CONTEXT
═══════════════════════════════════════════════

▸ COMPANIES TRACKED (${companies.length}):
${companies.map(c => `• ${c.name} | ${c.geography} | Rev: ${c.revenue} | EBITDA: ${c.ebitdaMargin} | Problems: ${(c.openProblems ?? "").slice(0, 100)} | SC: ${(c.scIntelligence ?? "").slice(0, 80)}`).join("\n")}

▸ SHEI HYPOTHESIS CARDS (${sheiCards.length} active):
${sheiCards.map(s => `• [${s.urgency}] ${s.title} (${s.functionTag})
  Signal: ${(s.signal ?? "").slice(0, 150)}
  Impact: ${(s.financialImpact ?? "").slice(0, 100)} | Why Now: ${(s.whyNow ?? "").slice(0, 80)}
  KPIs: ${s.kpiLinkage ?? "—"} | Contradiction: ${(s.contradictions ?? "").slice(0, 80)}
  Trajectory: ${(s.trajectoryContext ?? "").slice(0, 100)}`).join("\n")}

▸ LIVE SIGNALS (${signals.length} signals):
${signals.map(s => `• [${s.strength}/${s.action}] [${s.scope ?? "—"}] ${s.companyName} — ${(s.summary ?? "").slice(0, 110)}
  SC Angle: ${(s.scRelevance ?? "").slice(0, 70)} | Trajectory: ${s.trajectoryDir ?? "—"} | Past: ${(s.pastState ?? "").slice(0, 60)}`).join("\n")}

▸ KPI BENCHMARKS (${benchmarks.length}):
${benchmarks.map(b => `• ${b.kpiName} (${b.functionTag}): Best ${b.bestInClass} | Median ${b.industryMedian} | Laggard ${b.laggard} | ${(b.indiaContext ?? "").slice(0, 80)}`).join("\n")}

═══════════════════════════════════════════════
MANDATORY REASONING PIPELINE (execute before every output)
═══════════════════════════════════════════════
STEP 1 — SIGNAL EXTRACTION: Identify 3–6 relevant signals. Classify each: COMPANY_SPECIFIC | INDUSTRY_WIDE | MACRO. Assign strength: HIGH / MEDIUM / LOW. Check: do 2+ signals align? → Auto-generate SHEI.
STEP 2 — PATTERN DETECTION: Cluster into 1–2 themes (demand volatility / cost inflation / channel shift / regulatory pressure / capacity gap).
STEP 3 — HYPOTHESIS FORMATION: One testable structural statement. Must be non-obvious — if a junior analyst could write it, reject and deepen.
STEP 4 — VALIDATION: Check against KPI benchmarks (best / median / laggard). Compare 2–3 peer companies minimum. Flag contradictions: Revenue↑ Margin↓ | Inventory↑ low demand | Strategy vs execution mismatch.
STEP 5 — IMPACT ESTIMATION: Revenue (₹Cr/$M), Margin (bps), Working Capital (days). Include calculation logic.
STEP 6 — DECISION LAYER: Immediate (0–3 months) + Programme (6–12 months) + Thoucentric engagement.
ONLY THEN → generate output.

═══════════════════════════════════════════════
MANDATORY OUTPUT STRUCTURE (every response — no exceptions)
═══════════════════════════════════════════════

**SIGNALS** *(What is happening)*
• 3–5 data-backed events — ₹/$/€ values, %s, days. Classify each: [COMPANY] / [INDUSTRY] / [MACRO] · Strength: HIGH/MEDIUM/LOW
• Show trajectory: past state → current state → direction

**PATTERN & INSIGHT** *(What it means)*
• Non-obvious interpretation — the 'so what' a junior analyst would miss
• Cross-company pattern if signals overlap
• Contradictions called out explicitly (Revenue↑ Margin↓ = cost structure problem, not growth)
• Trajectory: Past (6–12M ago) → Current → Direction → Inflection point

**INDUSTRY COMPARISON**
• 2–3 peer companies — quantified leader vs. laggard: not "Company A is better" but "Company A MAPE 9% vs Company B 22%"
• WHY the leader is ahead (capability / investment / execution decision)

**KPI VALIDATION**
• Explicit KPI reference | Best-in-class (named company) | Industry Median | Laggard
• Subject company's position on spectrum
• If no exact data: directional estimate with confidence stated

**FINANCIAL IMPACT**
• Revenue impact (₹Cr/$M with calculation logic)
• Margin impact (bps or %)
• Working capital impact (days or ₹Cr)

**DECISIONS REQUIRED**
• Immediate (0–3 months): what must be decided NOW before window closes
• Medium-term (6–12 months): what programme must be initiated
• Frame as: "The company must choose between X and Y by [timing] because [consequence of inaction]"

**THOUCENTRIC OPPORTUNITY**
• Named engagement (e.g. "Demand Sensing Transformation", "EPR Compliance SC Programme")
• Entry point: which executive, which pain, which trigger event
• Engagement type: Diagnostic (6-8 weeks) | Transformation (6-18 months) | Advisory (retainer)
• Value creation estimate for client

**CONFIDENCE**
• HIGH (strong data + peer validation) | MEDIUM (directional) | LOW (hypothesis only)
• State explicitly what data is missing for HIGH confidence

**CXO QUESTIONS**
• 2 sharply-worded provocative questions that create discomfort
• Format: "Given [specific data point], what is your plan to [action] before [deadline]?"

═══════════════════════════════════════════════
INTELLIGENCE QUALITY RULES
═══════════════════════════════════════════════
• REJECT any insight a junior analyst could write — enforce non-obvious standard
• CONTRADICTION DETECTION: Revenue↑ Margin↓ | Volume↑ Inventory↑ | Strategy vs execution mismatch — flag EVERY contradiction
• TRAJECTORY: Always show past → current → direction → inflection. Never give static analysis.
• QUANTIFY: If insight has no quantitative grounding → mark confidence LOW and state what data would change this
• INDIA CONTEXT: GT vs MT vs Q-commerce | Rural vs urban demand | Regulatory landscape (EPR, FSSAI, BIS)
• GLOBAL CONTEXT: Commodity cycles | Channel shifts | Tech maturity | M&A patterns
• BE OPINIONATED: State clear views. No "it depends". No generic consulting language.
• FINAL TEST: "Does this change a CXO decision?" If not → improve the output.

Use ₹ for INR, $ for USD, € for EUR. Indian format: ₹59,579 Cr (never ₹59579Cr).
Use **bold headers**, bullet points, numbered lists throughout.`;

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no");

    const conversationMessages: Array<{ role: "system" | "user" | "assistant"; content: string }> = [
      { role: "system", content: systemPrompt },
      ...messages.map(m => ({ role: m.role as "user" | "assistant", content: m.content })),
    ];

    const stream = await openai.chat.completions.create({
      model: "gpt-4o",
      max_completion_tokens: 2500,
      stream: true,
      messages: conversationMessages,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        res.write(`data: ${JSON.stringify({ content })}\n\n`);
      }
    }
    res.write("data: [DONE]\n\n");
    res.end();
  } catch (err) {
    if (!res.headersSent) {
      res.status(500).json({ error: String(err) });
    } else {
      res.write(`data: ${JSON.stringify({ error: String(err) })}\n\n`);
      res.end();
    }
  }
});

export default router;
