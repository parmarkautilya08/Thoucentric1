import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const signalsTable = pgTable("signals", {
  id: serial("id").primaryKey(),
  companyId: integer("company_id"),
  companyName: text("company_name"),
  category: text("category").notNull(),
  summary: text("summary").notNull(),
  strength: text("strength").notNull().default("MEDIUM"),
  action: text("action").notNull().default("MONITOR"),
  source: text("source"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertSignalSchema = createInsertSchema(signalsTable).omit({ id: true, createdAt: true });
export type InsertSignal = z.infer<typeof insertSignalSchema>;
export type Signal = typeof signalsTable.$inferSelect;
