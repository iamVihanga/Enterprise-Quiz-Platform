import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "sonner";
import { useId } from "react";

import { authClient } from "@/features/auth/auth-client";
import { BanUserSchema } from "../schemas/ban-user";

type RequestType = BanUserSchema;

export const useBanUser = () => {
  const queryClient = useQueryClient();
  const toastId = useId();

  const mutation = useMutation({
    mutationFn: async (values: RequestType) => {
      const { data, error } = await authClient.admin.banUser({
        userId: values.userId,
        ...(values.banReason && { banReason: values.banReason }),
        ...(values.banExpiresIn && { banExpiresIn: values.banExpiresIn }),
      });

      if (error) throw new Error(error.message);

      return data;
    },
    onMutate: () => {
      toast.loading("Banning user...", { id: toastId });
    },
    onSuccess: () => {
      toast.success("User banned successfully !", { id: toastId });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to ban user", {
        id: toastId,
      });
    },
  });

  return mutation;
};
