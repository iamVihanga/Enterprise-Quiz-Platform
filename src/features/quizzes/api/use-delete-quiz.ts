import { useId } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { client } from "@/lib/rpc";

export function useDeleteQuiz() {
  const queryClient = useQueryClient();
  const toastId = useId();

  const mutation = useMutation({
    mutationFn: async (values: { id: string }) => {
      // Only send the fields that the client should provide
      const response = await client.api.quizzes[":id"].$delete({
        param: { id: values.id },
      });

      const data = await response.json();

      if (!response.ok || "error" in data)
        throw new Error("Internal Server Error");

      return data.data;
    },
    onMutate() {
      toast.loading("Deleting quiz...", { id: toastId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quizzes"] });
      toast.success("Quiz deleted successfully", { id: toastId });
    },
    onError: (error) => {
      toast.error("Failed to delete quiz", {
        id: toastId,
        description: error.message,
      });
    },
  });

  return mutation;
}
