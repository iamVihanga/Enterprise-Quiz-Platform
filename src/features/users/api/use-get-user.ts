import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

interface FilterParams {
  userId: string;
}

export const useGetUser = (params: FilterParams) => {
  const query = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await client.api.users[":id"].$get({
        param: { id: params.userId },
      });

      if (!response.ok) {
        const { error } = await response.json();
        throw new Error(error);
      }

      const { data } = await response.json();

      return data;
    },
  });

  return query;
};
