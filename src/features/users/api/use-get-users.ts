import { useQuery } from "@tanstack/react-query";

import { authClient } from "@/features/auth/auth-client";

interface FilterParams {
  page?: number;
  limit?: number;
  search?: string | null;
}

export const useGetUsers = (params: FilterParams) => {
  const { page = 1, limit = 10, search = "" } = params;

  const query = useQuery({
    queryKey: ["users", { page, limit, search }],
    queryFn: async () => {
      const totalUsers = await authClient.admin.listUsers({
        query: { limit: 1000000 },
      });

      const { data, error } = await authClient.admin.listUsers({
        query: {
          limit,
          offset: page > 1 ? (page - 1) * limit : 0,
          sortBy: "createdAt",
          sortDirection: "desc",
          ...(search && {
            searchField: "email",
            searchOperator: "contains",
            searchValue: search || undefined,
          }),
        },
      });

      if (error) throw new Error(error.message);

      return {
        users: data.users,
        total: totalUsers?.data?.users.length,
      };
    },
  });

  return query;
};
