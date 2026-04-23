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
  clientImplication: text("client_implication").notNull(),
  thoucentriqAngle: text("thoucentriq_angle").notNull(),
  pitchAnchor: text("pitch_anchor"),
  provocQuestion: text("provoc_question"),
  povParagraph: text("pov_paragraph"),
  version: text("version").notNull().default("1.0"),
  nextReview: text("next_review"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertSheiCardSchema = createInsertSchema(sheiCardsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertSheiCard = z.infer<typeof insertSheiCardSchema>;
export type SheiCard = typeof sheiCardsTable.$inferSelect;
