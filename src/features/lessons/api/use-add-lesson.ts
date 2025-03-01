import { useId } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { AddLessonSchema } from "../schemas/zod-lesson-schema";
import { client } from "@/lib/rpc";

export function useCreateLesson() {
  const queryClient = useQueryClient();
  const toastId = useId();

  const mutation = useMutation({
    mutationFn: async (values: AddLessonSchema) => {
      // Only send the fields that the client should provide
      const response = await client.api.lessons.$post({
        form: values,
      });

      return response;
    },
    onMutate() {
      toast.loading("Creating lesson...", { id: toastId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lessons"] });
      toast.success("Lesson created successfully", { id: toastId });
    },
    onError: (error) => {
      toast.error("Failed to create lesson", {
        id: toastId,
        description: error.message,
      });
    },
  });

  return mutation;
}
