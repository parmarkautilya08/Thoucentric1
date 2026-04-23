import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const benchmarksTable = pgTable("benchmarks", {
  id: serial("id").primaryKey(),
  kpiName: text("kpi_name").notNull(),
  definition: text("definition").notNull(),
  functionTag: text("function_tag").notNull(),
  bestInClass: text("best_in_class").notNull(),
  industryMedian: text("industry_median").notNull(),
  laggard: text("laggard").notNull(),
  indiaContext: text("india_context"),
  sheiAnnotation: text("shei_annotation"),
  version: text("version").notNull().default("1.0"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertBenchmarkSchema = createInsertSchema(benchmarksTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertBenchmark = z.infer<typeof insertBenchmarkSchema>;
export type Benchmark = typeof benchmarksTable.$inferSelect;
