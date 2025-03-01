import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "sonner";
import { useId } from "react";

import { authClient } from "@/features/auth/auth-client";

export const useLeaveClass = () => {
  const queryClient = useQueryClient();
  const toastId = useId();

  const mutation = useMutation({
    mutationFn: async (values: { email: string }) => {
      const { data, error } = await authClient.organization.removeMember({
        memberIdOrEmail: values.email,
      });

      if (error) throw new Error(error.message);

      return data;
    },
    onMutate: () => {
      toast.loading("Leaving class...", { id: toastId });
    },
    onSuccess: () => {
      toast.success("Left from class successfully !", { id: toastId });
      queryClient.invalidateQueries({ queryKey: ["classes"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to leave class", {
        id: toastId,
      });
    },
  });

  return mutation;
};
