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

router.post("/ask", async (req, res) => {
  try {
    const { question } = req.body as { question?: string };
    if (!question || typeof question !== "string" || question.trim().length === 0) {
      res.status(400).json({ error: "question is required" });
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
      }).from(sheiCardsTable),
      db.select({
        companyName: signalsTable.companyName,
        category: signalsTable.category,
        summary: signalsTable.summary,
        strength: signalsTable.strength,
        financialImpact: signalsTable.financialImpact,
        quarter: signalsTable.quarter,
      }).from(signalsTable).limit(10),
      db.select({
        kpiName: benchmarksTable.kpiName,
        functionTag: benchmarksTable.functionTag,
        bestInClass: benchmarksTable.bestInClass,
        industryMedian: benchmarksTable.industryMedian,
        laggard: benchmarksTable.laggard,
        whyItMatters: benchmarksTable.whyItMatters,
      }).from(benchmarksTable),
    ]);

    const systemPrompt = `You are a consulting-grade FMCG intelligence engine built for Thoucentric, a supply chain and procurement consulting firm. You have expert-level knowledge of FMCG companies, supply chain management, procurement, and the Indian and global FMCG market.

You have access to the following intelligence database:

COMPANIES (${companies.length}):
${companies.map(c => `- ${c.name} (${c.fullName}): Revenue ${c.revenue}, EBITDA ${c.ebitdaMargin}. Quick take: ${c.quickTake?.slice(0, 200)}. Open problems: ${c.openProblems?.slice(0, 150)}`).join("\n")}

SHEI HYPOTHESIS CARDS (${sheiCards.length}):
${sheiCards.map(s => `- [${s.urgency}] ${s.title} (${s.functionTag}): Financial impact: ${s.financialImpact?.slice(0, 150)}. Thoucentric angle: ${s.thoucentriqAngle?.slice(0, 150)}`).join("\n")}

RECENT SIGNALS (latest 10):
${signals.map(s => `- [${s.strength}] ${s.companyName} (${s.category} ${s.quarter}): ${s.summary?.slice(0, 150)}. Impact: ${s.financialImpact?.slice(0, 100)}`).join("\n")}

KPI BENCHMARKS:
${benchmarks.map(b => `- ${b.kpiName}: Best ${b.bestInClass}, Median ${b.industryMedian}, Laggard ${b.laggard}`).join("\n")}

RULES:
- Answer like an MBB-level consulting partner speaking to a FMCG CEO/CFO/CSCO
- Every insight must be data-backed with specific numbers (₹Cr, % margins, days, etc.)
- Structure your answer with clear headers
- Always link insights to Thoucentric consulting opportunities
- Be specific, not generic
- End with 1-2 high-impact provocative questions the user can take to a CXO meeting
- Format using markdown with bold headings and bullet points`;

    const completion = await openai.chat.completions.create({
      model: "gpt-5.4",
      max_completion_tokens: 1500,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: question.trim() },
      ],
    });

    const answer = completion.choices[0]?.message?.content ?? "No response generated.";
    res.json({ answer });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

export default router;
