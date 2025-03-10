import { z } from "zod";

export const addMaterialSchema = z.object({
  name: z.string().nonempty({ message: "Name is required!" }),
  description: z.string().nonempty({ message: "Description is required!" }),
  thumbnail: z.string().optional(),
  content: z.string().nonempty({ message: "Content is required!" }),
  lessonId: z.string().nonempty({ message: "Lesson ID is required!" }),
});

export type AddMaterialSchema = z.infer<typeof addMaterialSchema>;

export const idParamSchema = z.object({
  id: z.string().pipe(z.coerce.number()),
});

export const deleteMaterialSchema = idParamSchema;
export const updateMaterialSchema = idParamSchema;
export const findByIdMaterialSchema = idParamSchema;

export type DeleteMaterialSchema = z.infer<typeof deleteMaterialSchema>;
