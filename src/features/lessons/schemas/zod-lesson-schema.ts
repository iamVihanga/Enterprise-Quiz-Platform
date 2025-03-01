import { z } from "zod";

import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { lessons } from "@/features/lessons/schemas/db-schema";

export const addLessonSchema = z.object({
  name: z.string().nonempty({ message: "Name is required!" }),
  description: z.string().nonempty({ message: "Description is required!" }),
  thumbnail: z.string().optional(),
});

export type AddLessonSchema = z.infer<typeof addLessonSchema>;

export const deleteLessonSchema = z.object({
  id: z.string().pipe(z.coerce.number()),
});

export type DeleteLessonSchema = z.infer<typeof deleteLessonSchema>;
