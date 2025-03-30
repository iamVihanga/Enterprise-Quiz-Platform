import { z } from "zod";
import { quizTags, quizToTag } from "@/features/quizzes/schemas/db-schema";

export type SelectTag = typeof quizTags.$inferSelect;

export type InsertTag = typeof quizTags.$inferInsert;

export const insertTagSchema = z.object({
  name: z.string().nonempty({ message: "Tag name is required !" }),
  organizationId: z
    .string()
    .nonempty({ message: "Active organization is required !" }),
});

export const idParamSchema = z.object({
  id: z.string().pipe(z.coerce.number()),
});

export const deleteTagSchema = idParamSchema;

export type DeleteTagSchema = z.infer<typeof deleteTagSchema>;
