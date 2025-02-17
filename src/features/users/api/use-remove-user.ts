import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "sonner";
import { useId } from "react";

import { authClient } from "@/features/auth/auth-client";

type RequestType = {
  userId: string;
};

export const useRemoveUser = () => {
  const queryClient = useQueryClient();
  const toastId = useId();

  const mutation = useMutation({
    mutationFn: async (values: RequestType) => {
      const { data, error } = await authClient.admin.removeUser({
        userId: values.userId,
      });

      if (error) throw new Error(error.message);

      return data;
    },
    onMutate: () => {
      toast.loading("Removing user...", { id: toastId });
    },
    onSuccess: () => {
      toast.success("User removed successfully !", { id: toastId });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to remove user", {
        id: toastId,
      });
    },
  });

  return mutation;
};
