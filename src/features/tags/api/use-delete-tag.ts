import { useId } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { type DeleteTagSchema } from "../schema/zod-schema";
import { client } from "@/lib/rpc";

export function useDeleteTag() {
  const queryClient = useQueryClient();
  const toastId = useId();

  const mutation = useMutation({
    mutationFn: async (values: DeleteTagSchema) => {
      // Only send the fields that the client should provide
      const response = await client.api.tags[":id"].$delete({
        param: { id: values.id.toString() },
      });

      return response;
    },
    onMutate() {
      toast.loading("Deleting tag...", { id: toastId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
      toast.success("Tag deleted successfully", { id: toastId });
    },
    onError: (error) => {
      toast.error("Failed to delete tag", {
        id: toastId,
        description: error.message,
      });
    },
  });

  return mutation;
}
