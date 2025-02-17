import { z } from "zod";

export const banUserSchema = z.object({
  userId: z.string(),
  banReason: z.string().optional(),
  banExpiresIn: z.number().optional(),
});

export type BanUserSchema = z.infer<typeof banUserSchema>;
