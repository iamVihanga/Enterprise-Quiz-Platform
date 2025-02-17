import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "sonner";
import { useId } from "react";

import { authClient } from "@/features/auth/auth-client";
import { Classes } from "../components/classes-table/columns";

export const useDeleteClass = () => {
  const queryClient = useQueryClient();
  const toastId = useId();

  const mutation = useMutation({
    mutationFn: async (org: Classes) => {
      const { data, error } = await authClient.organization.delete({
        organizationId: org.id,
      });

      if (error) throw new Error(error.message);

      return data;
    },
    onMutate: () => {
      toast.loading("Deleting class...", { id: toastId });
    },
    onSuccess: () => {
      toast.success("Class deleted successfully !", { id: toastId });
      queryClient.invalidateQueries({ queryKey: ["classes"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete class", {
        id: toastId,
      });
    },
  });

  return mutation;
};
