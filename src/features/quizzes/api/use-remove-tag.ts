import { useId } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type { RemoveTagSchema } from "../schemas/quiz-tags-schema";
import { client } from "@/lib/rpc";

export function useRemoveTag() {
  const queryClient = useQueryClient();
  const toastId = useId();

  const mutation = useMutation({
    mutationFn: async (values: RemoveTagSchema) => {
      // Only send the fields that the client should provide
      const response = await client.api["quiz-tags"].$delete({
        json: values,
      });

      const data = await response.json();

      if (!response.ok || "error" in data)
        throw new Error("Internal Server Error");

      return data.data;
    },
    onMutate() {
      toast.loading("Removing tag...", { id: toastId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags-to-quiz"] });
      toast.success("Tag removed successfully", { id: toastId });
    },
    onError: (error) => {
      toast.error("Failed to removed tag", {
        id: toastId,
        description: error.message,
      });
    },
  });

  return mutation;
}
