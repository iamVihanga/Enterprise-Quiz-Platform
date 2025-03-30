import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

interface FilterParams {
  quizId: string;
}

export function useGetQuizzes(params: FilterParams) {
  const { quizId } = params;

  const query = useQuery({
    queryKey: [
      "tags-to-quiz",
      {
        quizId,
      },
    ],
    queryFn: async () => {
      const response = await client.api["quiz-tags"][":id"].$get({
        param: { id: quizId },
      });

      if (!response.ok) {
        const { error } = await response.json();

        throw new Error(error || "Failed to fetch quiz tags");
      }

      const data = await response.json();

      return data.data;
    },
  });

  return query;
}
