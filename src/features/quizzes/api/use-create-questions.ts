import { useId } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { client } from "@/lib/rpc";
import type { AddMultipleQuestionInput } from "../schemas/zod-quiz-schema";

export function useCreateQuestions() {
  const queryClient = useQueryClient();
  const toastId = useId();

  const mutation = useMutation({
    mutationFn: async (values: {
      questions: AddMultipleQuestionInput;
      quizId: string;
    }) => {
      // Only send the fields that the client should provide
      const response = await client.api.quizzes[":id"]["questions-list"].$post({
        param: { id: values.quizId },
        json: values.questions,
      });

      const data = await response.json();

      if (!response.ok || "error" in data)
        throw new Error("Internal Server Error");

      return data.data;
    },
    onMutate() {
      toast.loading("Creating questions...", { id: toastId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questions"] });
      toast.success("Questions created successfully", { id: toastId });
    },
    onError: (error) => {
      toast.error("Failed to create questions", {
        id: toastId,
        description: error.message,
      });
    },
  });

  return mutation;
}
