import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useId } from "react";

import { authClient } from "@/features/auth/auth-client";

export function useRemoveStudent() {
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
      toast.loading("Removing student...", { id: toastId });
    },
    onSuccess: () => {
      toast.success("Student removed successfully", { id: toastId });
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to remove student", {
        id: toastId,
      });
    },
  });

  return mutation;
}
