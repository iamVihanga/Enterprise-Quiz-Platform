import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useId } from "react";

import { authClient } from "@/features/auth/auth-client";
import { type InviteStudentSchema } from "../schemas/invite-student";

export function useInviteStudent() {
  const queryClient = useQueryClient();
  const toastId = useId();

  const mutation = useMutation({
    mutationFn: async (values: InviteStudentSchema) => {
      const { data, error } = await authClient.organization.inviteMember({
        email: values.email,
        role: "member",
      });

      if (error) throw new Error(error.message);

      return data;
    },
    onMutate: () => {
      toast.loading("Sending invitation...", { id: toastId });
    },
    onSuccess: () => {
      toast.success("Invitation sent successfully !", { id: toastId });
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to sent invitation", {
        id: toastId,
      });
    },
  });

  return mutation;
}
