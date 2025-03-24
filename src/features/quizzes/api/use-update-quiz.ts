import { useId } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type {
  UpdateQuizInput,
  UpdateParamsQuizInput,
} from "../schemas/zod-quiz-schema";
import { client } from "@/lib/rpc";

interface UpdateQuizValues {
  values: UpdateQuizInput;
  params: UpdateParamsQuizInput;
}

export function useUpdateQuiz() {
  const queryClient = useQueryClient();
  const toastId = useId();

  const mutation = useMutation({
    mutationFn: async (input: UpdateQuizValues) => {
      // Only send the fields that the client should provide
      const response = await client.api.quizzes[":id"].$put({
        param: { id: input.params.id },
        json: input.values,
      });

      const data = await response.json();

      if (!response.ok || "error" in data)
        throw new Error("Internal Server Error");

      return data.data;
    },
    onMutate() {
      toast.loading("Updating quiz...", { id: toastId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quizzes"] });
      toast.success("Quiz updated successfully", { id: toastId });
    },
    onError: (error) => {
      toast.error("Failed to update quiz", {
        id: toastId,
        description: error.message,
      });
    },
  });

  return mutation;
}
