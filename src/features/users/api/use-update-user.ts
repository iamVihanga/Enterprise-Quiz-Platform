import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "sonner";
import { useId } from "react";

import { authClient } from "@/features/auth/auth-client";
import { UpdateUserSchema } from "../schemas/update-user";

type RequestType = UpdateUserSchema;

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  const toastId = useId();

  const mutation = useMutation({
    mutationFn: async (values: RequestType) => {
      const { data, error } = await authClient.admin.setRole({
        userId: values.userId,
        role: values.role,
      });

      if (error) throw new Error(error.message);

      return data;
    },
    onMutate: () => {
      toast.loading("Updating user...", { id: toastId });
    },
    onSuccess: () => {
      toast.success("User updated successfully !", { id: toastId });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update user", {
        id: toastId,
      });
    },
  });

  return mutation;
};
