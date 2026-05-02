import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const signalsTable = pgTable("signals", {
  id: serial("id").primaryKey(),
  companyId: integer("company_id"),
  companyName: text("company_name"),
  category: text("category").notNull(),
  scope: text("scope"),            // COMPANY_SPECIFIC | INDUSTRY_WIDE | MACRO
  summary: text("summary").notNull(),
  strength: text("strength").notNull().default("MEDIUM"),
  action: text("action").notNull().default("MONITOR"),
  source: text("source"),
  eventType: text("event_type"),
  financialImpact: text("financial_impact"),
  publishedDate: text("published_date"),
  newsUrl: text("news_url"),
  quarter: text("quarter"),
  scRelevance: text("sc_relevance"),
  pastState: text("past_state"),       // What was true 6-12 months ago
  trajectoryDir: text("trajectory_dir"), // IMPROVING | DETERIORATING | STABLE
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertSignalSchema = createInsertSchema(signalsTable).omit({ id: true, createdAt: true });
export type InsertSignal = z.infer<typeof insertSignalSchema>;
export type Signal = typeof signalsTable.$inferSelect;
