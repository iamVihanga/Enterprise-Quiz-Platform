import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";
import { authClient } from "@/features/auth/auth-client";

interface FilterParams {
  page?: number;
  limit?: number;
  search?: string | null;
}

export function useGetTags(params: FilterParams) {
  const { page = 1, limit = 10, search = "" } = params;
  const { data: activeOraganization, error: activeOraganizationErr } =
    authClient.useActiveOrganization();

  const query = useQuery({
    queryKey: [
      "tags",
      {
        page,
        limit,
        search,
        organizationId: activeOraganization?.id,
      },
    ],
    queryFn: async () => {
      const queryParams = {
        page: page.toString(),
        limit: limit.toString(),
        ...(search && { search }),
      };

      const response = await client.api.tags.$get({
        query: queryParams,
      });

      if (!response.ok) {
        const { error } = await response.json();

        throw new Error(error || "Failed to fetch tags");
      }

      const data = await response.json();

      return data;
    },
  });

  return query;
}
