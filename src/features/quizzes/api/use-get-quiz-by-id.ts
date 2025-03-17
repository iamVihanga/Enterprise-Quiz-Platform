import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

export function useGetQuizById(id: string) {
  const query = useQuery({
    queryKey: ["classes", { id }],
    queryFn: async () => {
      const response = await client.api.quizzes[":id"].$get({
        param: { id },
      });

      if (!response.ok) {
        const { error } = await response.json();

        throw new Error(error || "Failed to fetch quiz");
      }

      const data = await response.json();

      return data.data;
    },
  });

  return query;
}
