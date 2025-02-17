import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "sonner";
import { useId } from "react";
import { CreateClassSchema } from "../schema/create-class";
import { authClient } from "@/features/auth/auth-client";
import { toKebabCase } from "@/lib/utils";

export const useUpdateClass = () => {
  const queryClient = useQueryClient();
  const toastId = useId();

  const mutation = useMutation({
    mutationFn: async (values: CreateClassSchema & { id: string }) => {
      const finalValues = {
        ...values,
        image: values.image instanceof File ? values.image : "",
      };

      //   Todo: Implement image upload process

      const { data, error } = await authClient.organization.update({
        data: {
          name: finalValues.name,
          logo: undefined,
          metadata: {
            description: finalValues.description,
          },
          slug: toKebabCase(finalValues.name),
        },
        organizationId: finalValues.id,
      });

      if (error) throw new Error(error.message);

      return data;
    },
    onMutate: () => {
      toast.loading("Updating class...", { id: toastId });
    },
    onSuccess: () => {
      toast.success("Class updated successfully !", { id: toastId });
      queryClient.invalidateQueries({ queryKey: ["classes"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update class", {
        id: toastId,
      });
    },
  });

  return mutation;
};
