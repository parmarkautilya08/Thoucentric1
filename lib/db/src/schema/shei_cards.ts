import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const sheiCardsTable = pgTable("shei_cards", {
  id: serial("id").primaryKey(),
  cardId: text("card_id").notNull().unique(),
  title: text("title").notNull(),
  functionTag: text("function_tag").notNull(),
  geographyTag: text("geography_tag").notNull().default("BOTH"),
  urgency: text("urgency").notNull().default("MEDIUM_TERM"),
  signal: text("signal").notNull(),
  hypothesis: text("hypothesis").notNull(),
  evidence: text("evidence").notNull(),
  contradictions: text("contradictions"),   // Data contradictions calling out mismatches
  clientImplication: text("client_implication").notNull(),
  thoucentriqAngle: text("thoucentriq_angle").notNull(),
  kpiLinkage: text("kpi_linkage"),          // Which KPIs this SHEI affects
  signalCluster: text("signal_cluster"),    // Which signals triggered this SHEI
  trajectoryContext: text("trajectory_context"), // Past → current → direction → inflection
  pitchAnchor: text("pitch_anchor"),
  provocQuestion: text("provoc_question"),
  povParagraph: text("pov_paragraph"),
  financialImpact: text("financial_impact"),
  whyNow: text("why_now"),
  relatedCompanies: text("related_companies"),
  status: text("status").notNull().default("ACTIVE"),
  version: text("version").notNull().default("1.0"),
  nextReview: text("next_review"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertSheiCardSchema = createInsertSchema(sheiCardsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertSheiCard = z.infer<typeof insertSheiCardSchema>;
export type SheiCard = typeof sheiCardsTable.$inferSelect;
