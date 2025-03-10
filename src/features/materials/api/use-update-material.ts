import { useId } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { AddMaterialSchema } from "../schemas/zod-material-schema";
import { client } from "@/lib/rpc";

export function useUpdateMaterial() {
  const queryClient = useQueryClient();
  const toastId = useId();

  const mutation = useMutation({
    mutationFn: async ({
      id,
      values,
    }: {
      id: string;
      values: AddMaterialSchema;
    }) => {
      // Only send the fields that the client should provide
      const response = await client.api.materials[":id"].$put({
        param: { id },
        form: values,
      });

      const data = await response.json();

      if ("error" in data) throw new Error(data.error);

      return data.data;
    },
    onMutate() {
      toast.loading("Updating lesson material...", { id: toastId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["materials"] });
      toast.success("Lesson material updated successfully", { id: toastId });
    },
    onError: (error) => {
      toast.error("Failed to update lesson material", {
        id: toastId,
        description: error.message,
      });
    },
  });

  return mutation;
}
