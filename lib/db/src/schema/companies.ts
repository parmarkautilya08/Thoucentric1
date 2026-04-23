import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const companiesTable = pgTable("companies", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  fullName: text("full_name").notNull(),
  tier: integer("tier").notNull().default(1),
  geography: text("geography").notNull().default("GLOBAL"),
  exchange: text("exchange"),
  irPage: text("ir_page"),
  earningsCadence: text("earnings_cadence"),
  revenue: text("revenue"),
  revenueGrowth: text("revenue_growth"),
  ebitdaMargin: text("ebitda_margin"),
  marketCap: text("market_cap"),
  categories: text("categories"),
  strategicPriorities: text("strategic_priorities"),
  scIntelligence: text("sc_intelligence"),
  techIntelligence: text("tech_intelligence"),
  openProblems: text("open_problems"),
  quickTake: text("quick_take"),
  confidence: text("confidence").notNull().default("MEDIUM"),
  version: text("version").notNull().default("1.0"),
  nextRefresh: text("next_refresh"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertCompanySchema = createInsertSchema(companiesTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertCompany = z.infer<typeof insertCompanySchema>;
export type Company = typeof companiesTable.$inferSelect;
