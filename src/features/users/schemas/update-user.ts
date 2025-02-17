import { z } from "zod";

export const updateUserSchema = z.object({
  userId: z.string(),
  role: z.string(),
});

export type UpdateUserSchema = z.infer<typeof updateUserSchema>;
