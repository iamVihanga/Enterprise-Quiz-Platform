import { useId } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { AddLessonSchema } from "../schemas/zod-lesson-schema";
import { client } from "@/lib/rpc";

export function useUpdateLesson() {
  const queryClient = useQueryClient();
  const toastId = useId();

  const mutation = useMutation({
    mutationFn: async ({
      id,
      values,
    }: {
      id: string;
      values: AddLessonSchema;
    }) => {
      // Only send the fields that the client should provide
      const response = await client.api.lessons[":id"].$put({
        param: { id },
        form: values,
      });

      const data = await response.json();

      if ("error" in data) throw new Error(data.error);

      return data.data;
    },
    onMutate() {
      toast.loading("Updating lesson...", { id: toastId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lessons"] });
      toast.success("Lesson updated successfully", { id: toastId });
    },
    onError: (error) => {
      toast.error("Failed to update lesson", {
        id: toastId,
        description: error.message,
      });
    },
  });

  return mutation;
}
