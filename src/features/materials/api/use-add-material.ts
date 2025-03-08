import { useId } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { type AddMaterialSchema } from "../schemas/zod-lesson-schema";
import { client } from "@/lib/rpc";

export function useCreateMaterial() {
  const queryClient = useQueryClient();
  const toastId = useId();

  const mutation = useMutation({
    mutationFn: async (values: AddMaterialSchema) => {
      // Only send the fields that the client should provide
      const response = await client.api.materials.$post({
        form: values,
      });

      return response;
    },
    onMutate() {
      toast.loading("Creating lesson material...", { id: toastId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["materials"] });
      toast.success("Lesson material created successfully", { id: toastId });
    },
    onError: (error) => {
      toast.error("Failed to create lesson material", {
        id: toastId,
        description: error.message,
      });
    },
  });

  return mutation;
}
