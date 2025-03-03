import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { client } from "@/lib/rpc";

export function useGetLesson() {
  const mutation = useMutation({
    async mutationFn(values: { id: string }) {
      const response = await client.api.lessons[":id"].$get({
        param: { id: values.id },
      });

      const data = await response.json();

      if ("error" in data) throw new Error(data.error);

      if (data.data.length === 0) throw new Error("Lesson not found !");

      return { data: data.data[0] };
    },

    onError(error) {
      toast.error(error.message || "Failed to fetch lesson !");
    },
  });

  return mutation;
}
