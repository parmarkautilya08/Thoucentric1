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
        strategicPriorities: companiesTable.strategicPriorities,
        categories: companiesTable.categories,
      }).from(companiesTable),
      db.select({
        title: sheiCardsTable.title,
        functionTag: sheiCardsTable.functionTag,
        urgency: sheiCardsTable.urgency,
        signal: sheiCardsTable.signal,
        hypothesis: sheiCardsTable.hypothesis,
        evidence: sheiCardsTable.evidence,
        clientImplication: sheiCardsTable.clientImplication,
        financialImpact: sheiCardsTable.financialImpact,
        thoucentriqAngle: sheiCardsTable.thoucentriqAngle,
        relatedCompanies: sheiCardsTable.relatedCompanies,
        whyNow: sheiCardsTable.whyNow,
      }).from(sheiCardsTable),
      db.select({
        companyName: signalsTable.companyName,
        category: signalsTable.category,
        summary: signalsTable.summary,
        strength: signalsTable.strength,
        financialImpact: signalsTable.financialImpact,
        quarter: signalsTable.quarter,
        scRelevance: signalsTable.scRelevance,
        eventType: signalsTable.eventType,
      }).from(signalsTable),
      db.select({
        kpiName: benchmarksTable.kpiName,
        functionTag: benchmarksTable.functionTag,
        bestInClass: benchmarksTable.bestInClass,
        industryMedian: benchmarksTable.industryMedian,
        laggard: benchmarksTable.laggard,
        whyItMatters: benchmarksTable.whyItMatters,
        companyExamples: benchmarksTable.companyExamples,
        indiaContext: benchmarksTable.indiaContext,
      }).from(benchmarksTable),
    ]);

    const systemPrompt = `You are an elite consulting-grade FMCG intelligence engine built for Thoucentric, a leading supply chain and procurement consulting firm. You are the equivalent of a McKinsey / BCG senior partner with deep FMCG expertise — available 24/7 to answer any question about any FMCG company in the world.

TODAY'S DATE: April 30, 2026 (use this for all "current" or "latest" references).

YOUR SCOPE: You can and should answer about ANY FMCG company worldwide — Kraft Heinz, Coca-Cola, AB InBev, Diageo, Reckitt, Church & Dwight, Henkel, Beiersdorf, Kimberly-Clark, General Mills, Conagra, Hershey, Campbell Soup, Danone, Lactalis, Ferrero, Lindt, Pernod Ricard, and any others. Use your comprehensive knowledge freely. Do not limit responses only to the companies in the database below.

YOU HAVE ACCESS TO THOUCENTRIC'S PROPRIETARY INTELLIGENCE DATABASE:

▸ COMPANIES TRACKED (${companies.length} companies):
${companies.map(c => `• ${c.name} | ${c.geography} | Rev: ${c.revenue} | EBITDA: ${c.ebitdaMargin} | Categories: ${c.categories?.slice(0, 80)} | Open Problems: ${c.openProblems?.slice(0, 120)}`).join("\n")}

▸ SHEI HYPOTHESIS CARDS (${sheiCards.length} active cards):
${sheiCards.map(s => `• [${s.urgency}] ${s.title} (${s.functionTag})\n  Signal: ${s.signal?.slice(0, 180)}\n  Financial Impact: ${s.financialImpact?.slice(0, 120)}\n  Why Now: ${s.whyNow?.slice(0, 100)}`).join("\n")}

▸ LIVE SIGNALS (${signals.length} signals):
${signals.map(s => `• [${s.strength}/${s.eventType}] ${s.companyName} — ${s.summary?.slice(0, 120)} | SC Angle: ${s.scRelevance?.slice(0, 80)}`).join("\n")}

▸ KPI BENCHMARKS (${benchmarks.length} benchmarks):
${benchmarks.map(b => `• ${b.kpiName} (${b.functionTag}): Best ${b.bestInClass} | Median ${b.industryMedian} | Laggard ${b.laggard} | ${b.indiaContext?.slice(0, 100)}`).join("\n")}

RESPONSE RULES:
1. Answer like an MBB senior partner briefing a FMCG CXO — authoritative, specific, no filler
2. Every insight MUST be data-backed: specific numbers (₹Cr, %, days, $M), company names, time periods
3. Use clear markdown structure: **Bold headers**, bullet points, numbered lists where appropriate
4. For any company you discuss, assess: Revenue/margin context → Supply chain gap → Consulting entry point
5. Always connect insights to Thoucentric consulting opportunities (diagnostic, transformation, advisory)
6. When benchmarks are relevant, compare the company's position to best-in-class / median / laggard
7. End every response with 2 sharply-worded provocative questions the user can take to a CXO meeting
8. If asked about a company NOT in the database, use your broad FMCG knowledge freely — be equally analytical
9. For India-specific queries, add India market context (GT vs. MT, rural-urban dynamics, regulatory landscape)
10. Be opinionated. State clear views on what companies should do, not wishy-washy "it depends"`;

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
      max_completion_tokens: 2000,
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
