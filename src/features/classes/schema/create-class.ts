import { z } from "zod";

export const createClassSchema = z.object({
  name: z.string().trim().min(1, "Required"),
  description: z.string().trim().optional(),
  image: z
    .union([
      z.instanceof(File),
      z.string().transform((value) => (value === "" ? undefined : value)),
    ])
    .optional(),
});

export type CreateClassSchema = z.infer<typeof createClassSchema>;
