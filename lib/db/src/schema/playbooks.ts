import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const playbookSectionsTable = pgTable("playbook_sections", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  functionTag: text("function_tag").notNull(),
  sectionNumber: integer("section_number").notNull(),
  whyItMatters: text("why_it_matters").notNull(),
  industryLandscape: text("industry_landscape"),
  failureModes: text("failure_modes"),
  whatGoodLooksLike: text("what_good_looks_like"),
  technologyEnablers: text("technology_enablers"),
  consultingEntryPoints: text("consulting_entry_points"),
  triggerSignals: text("trigger_signals"),  // Which signal types activate this playbook
  status: text("status").notNull().default("STARTER"),
  version: text("version").notNull().default("1.0"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertPlaybookSectionSchema = createInsertSchema(playbookSectionsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertPlaybookSection = z.infer<typeof insertPlaybookSectionSchema>;
export type PlaybookSection = typeof playbookSectionsTable.$inferSelect;
