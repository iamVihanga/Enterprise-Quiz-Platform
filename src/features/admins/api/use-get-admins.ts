import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

interface FilterParams {
  page?: number;
  limit?: number;
  search?: string | null;
}

export const useGetAdmins = (params: FilterParams) => {
  const { page = 1, limit = 10, search = "" } = params;

  const query = useQuery({
    queryKey: ["admins", { page, limit, search }],
    queryFn: async () => {
      const queryParams = {
        page: page.toString(),
        limit: limit.toString(),
        ...(search && { search }),
      };

      const response = await client.api.admins.$get({
        query: queryParams,
      });

      if (!response.ok) {
        const { error } = await response.json();

        throw new Error(error || "Failed to fetch students");
      }

      const data = await response.json();

      return data;
    },
  });

  return query;
};
