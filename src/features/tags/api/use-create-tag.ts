import { useId } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { type InsertTag } from "../schema/zod-schema";
import { client } from "@/lib/rpc";

export function useCreateTag() {
  const queryClient = useQueryClient();
  const toastId = useId();

  const mutation = useMutation({
    mutationFn: async (values: InsertTag) => {
      // Only send the fields that the client should provide
      const response = await client.api.tags.$post({
        json: values,
      });

      return response;
    },
    onMutate() {
      toast.loading("Creating new tag...", { id: toastId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
      toast.success("New tag created successfully", { id: toastId });
    },
    onError: (error) => {
      toast.error("Failed to create tag", {
        id: toastId,
        description: error.message,
      });
    },
  });

  return mutation;
}
