import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useId } from "react";

import { authClient } from "@/features/auth/auth-client";

export function useRemoveAdmin() {
  const queryClient = useQueryClient();
  const toastId = useId();

  const mutation = useMutation({
    mutationFn: async (values: { memberId: string }) => {
      const { data, error } = await authClient.organization.removeMember({
        memberIdOrEmail: values.memberId,
      });

      if (error) throw new Error(error.message);

      return data;
    },
    onMutate: () => {
      toast.loading("Removing admin...", { id: toastId });
    },
    onSuccess: () => {
      toast.success("Admin removed successfully", { id: toastId });
      queryClient.invalidateQueries({ queryKey: ["admins"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to remove admin", {
        id: toastId,
      });
    },
  });

  return mutation;
}
