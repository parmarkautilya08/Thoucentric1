import { Router, IRouter } from "express";
import { db } from "@workspace/db";
import { companiesTable, sheiCardsTable, signalsTable, benchmarksTable, playbookSectionsTable } from "@workspace/db";
import { sql } from "drizzle-orm";

const router: IRouter = Router();

router.get("/dashboard/summary", async (req, res) => {
  const [companies, sheiCards, signals, benchmarks, playbookSections] = await Promise.all([
    db.select().from(companiesTable),
    db.select().from(sheiCardsTable),
    db.select().from(signalsTable),
    db.select().from(benchmarksTable),
    db.select().from(playbookSectionsTable),
  ]);

  const summary = {
    totalCompanies: companies.length,
    tier1Companies: companies.filter((c) => c.tier === 1).length,
    tier2Companies: companies.filter((c) => c.tier === 2).length,
    totalSheiCards: sheiCards.length,
    immediateSheiCards: sheiCards.filter((c) => c.urgency === "IMMEDIATE").length,
    totalSignals: signals.length,
    highSignals: signals.filter((s) => s.strength === "HIGH").length,
    totalBenchmarks: benchmarks.length,
    totalPlaybookSections: playbookSections.length,
  };

  res.json(summary);
});

router.get("/dashboard/recent-signals", async (req, res) => {
  const { desc } = await import("drizzle-orm");
  const signals = await db.select().from(signalsTable).orderBy(desc(signalsTable.createdAt));
  res.json(signals);
});

router.get("/dashboard/signal-breakdown", async (req, res) => {
  const signals = await db.select().from(signalsTable);

  const counts: Record<string, number> = {};
  for (const signal of signals) {
    counts[signal.category] = (counts[signal.category] || 0) + 1;
  }

  const breakdown = Object.entries(counts).map(([category, count]) => ({
    category,
    count,
  }));

  res.json(breakdown);
});

router.get("/dashboard/shei-by-urgency", async (req, res) => {
  const cards = await db.select().from(sheiCardsTable);

  const counts: Record<string, number> = {};
  for (const card of cards) {
    counts[card.urgency] = (counts[card.urgency] || 0) + 1;
  }

  const breakdown = Object.entries(counts).map(([urgency, count]) => ({
    urgency,
    count,
  }));

  res.json(breakdown);
});

export default router;
