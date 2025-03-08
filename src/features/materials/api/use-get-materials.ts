import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";
import { authClient } from "@/features/auth/auth-client";

interface FilterParams {
  page?: number;
  limit?: number;
  search?: string | null;
  lessonId?: string;
}

export const useGetMaterials = (params: FilterParams) => {
  const { page = 1, limit = 10, search = "", lessonId = "" } = params;
  const { data: activeOraganization, error: activeOraganizationErr } =
    authClient.useActiveOrganization();

  const query = useQuery({
    queryKey: [
      "materials",
      {
        page,
        limit,
        search,
        organizationId: activeOraganization?.id,
        lessonId,
      },
    ],
    queryFn: async () => {
      const queryParams = {
        page: page.toString(),
        limit: limit.toString(),
        ...(search && { search }),
        ...(lessonId && { lessonId }),
      };

      const response = await client.api.materials.$get({
        query: queryParams,
      });

      if (!response.ok) {
        const { error } = await response.json();

        throw new Error(error || "Failed to fetch lesson materials");
      }

      const data = await response.json();

      return data;
    },
  });

  return query;
};
