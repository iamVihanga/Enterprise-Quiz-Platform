import { useId } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type { UpdateQuestionInput } from "../schemas/zod-quiz-schema";
import { client } from "@/lib/rpc";

interface UpdateQuestionValues {
  values: UpdateQuestionInput;
}

export function useUpdateQuestion() {
  const queryClient = useQueryClient();
  const toastId = useId();

  const mutation = useMutation({
    mutationFn: async (input: UpdateQuestionValues) => {
      // Only send the fields that the client should provide
      const response = await client.api.questions.questions[":questionId"].$put(
        {
          param: { questionId: input.values.id },
          json: input.values,
        }
      );

      const data = await response.json();

      if (!response.ok || "error" in data)
        throw new Error("Internal Server Error");

      return data.data;
    },
    onMutate() {
      toast.loading("Updating question...", { id: toastId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questions"] });
      toast.success("Question updated successfully", { id: toastId });
    },
    onError: (error) => {
      toast.error("Failed to update question", {
        id: toastId,
        description: error.message,
      });
    },
  });

  return mutation;
}
