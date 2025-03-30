import { z } from "zod";

// Add tag to quiz schema
export const addTagToQuizSchema = z.object({
  quizId: z.number({ required_error: "Quiz ID is required !" }),
  tagId: z.number({ required_error: "Tag ID is required !" }),
});

export const idParamSchema = z.object({
  id: z.string().pipe(z.coerce.number()),
});

export const getTagsByQuizSchema = idParamSchema;

export const removeTagSchema = addTagToQuizSchema;

export type GetTagsByQuizSchema = z.infer<typeof idParamSchema>;

export type AddTagToQuizSchema = z.infer<typeof addTagToQuizSchema>;

export type RemoveTagSchema = z.infer<typeof removeTagSchema>;
