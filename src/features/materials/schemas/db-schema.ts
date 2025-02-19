import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { lessons } from "@/db/schema";

export const materialsTable = pgTable("materials", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  thumbnail: text("thumbnail"),
  content: text("content"),
  lessonId: integer("lesson_id")
    .notNull()
    .references(() => lessons.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export type SelectMaterial = typeof materialsTable.$inferSelect;
export type InsertMaterial = typeof materialsTable.$inferInsert;
