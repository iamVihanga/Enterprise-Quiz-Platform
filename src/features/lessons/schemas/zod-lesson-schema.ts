import { z } from "zod";

export const addLessonSchema = z.object({
  name: z.string().nonempty({ message: "Name is required!" }),
  description: z.string().nonempty({ message: "Description is required!" }),
  thumbnail: z.string().optional(),
});

export type AddLessonSchema = z.infer<typeof addLessonSchema>;

export const idParamSchema = z.object({
  id: z.string().pipe(z.coerce.number()),
});

export const deleteLessonSchema = idParamSchema;
export const updateLessonSchema = idParamSchema;
export const findByIdLessonSchema = idParamSchema;

export type DeleteLessonSchema = z.infer<typeof deleteLessonSchema>;
