import { useId } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { client } from "@/lib/rpc";

export function useDeleteMaterial() {
  const queryClient = useQueryClient();
  const toastId = useId();

  const mutation = useMutation({
    mutationFn: async (values: { id: number }) => {
      // Only send the fields that the client should provide
      const response = await client.api.materials[":id"].$delete({
        param: { id: values.id.toString() },
      });

      const data = await response.json();

      return data;
    },
    onMutate() {
      toast.loading("Deleting lesson material...", { id: toastId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["materials"] });
      toast.success("Lesson material deleted successfully", { id: toastId });
    },
    onError: (error) => {
      toast.error("Failed to delete lesson material", {
        id: toastId,
        description: error.message,
      });
    },
  });

  return mutation;
}
