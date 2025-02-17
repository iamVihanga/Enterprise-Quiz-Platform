import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "sonner";
import { useId } from "react";

import { authClient } from "@/features/auth/auth-client";

type RequestType = {
  userId: string;
};

export const useUnbanUser = () => {
  const queryClient = useQueryClient();
  const toastId = useId();

  const mutation = useMutation({
    mutationFn: async (values: RequestType) => {
      const { data, error } = await authClient.admin.unbanUser({
        userId: values.userId,
      });

      if (error) throw new Error(error.message);

      return data;
    },
    onMutate: () => {
      toast.loading("Unbanning user...", { id: toastId });
    },
    onSuccess: () => {
      toast.success("User unbanned successfully !", { id: toastId });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to unban user", {
        id: toastId,
      });
    },
  });

  return mutation;
};
