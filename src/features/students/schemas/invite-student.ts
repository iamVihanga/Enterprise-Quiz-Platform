import { z } from "zod";

export const inviteStudentSchema = z.object({
  email: z.string().email(),
});

export type InviteStudentSchema = z.infer<typeof inviteStudentSchema>;
