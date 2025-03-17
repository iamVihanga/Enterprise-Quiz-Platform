import { useId } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type { AddQuizInput } from "../schemas/zod-quiz-schema";
import { client } from "@/lib/rpc";

export function useCreateQuiz() {
  const queryClient = useQueryClient();
  const toastId = useId();

  const mutation = useMutation({
    mutationFn: async (values: AddQuizInput) => {
      // Only send the fields that the client should provide
      const response = await client.api.quizzes.$post({
        json: values,
      });

      const data = await response.json();

      if (!response.ok || "error" in data)
        throw new Error("Internal Server Error");

      return data.data;
    },
    onMutate() {
      toast.loading("Creating new quiz...", { id: toastId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quizzes"] });
      toast.success("Quiz created successfully", { id: toastId });
    },
    onError: (error) => {
      toast.error("Failed to create quiz", {
        id: toastId,
        description: error.message,
      });
    },
  });

  return mutation;
}
