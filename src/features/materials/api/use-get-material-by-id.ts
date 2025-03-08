import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

interface FilterParams {
  materialId: string;
}

export function useGetMaterial(params: FilterParams) {
  const { materialId } = params;

  const query = useQuery({
    queryKey: [
      "materials",
      {
        materialId,
      },
    ],
    queryFn: async () => {
      const response = await client.api.materials[":id"].$get({
        param: { id: materialId },
      });

      if (!response.ok) {
        const { error } = await response.json();

        throw new Error(error || "Failed to fetch lesson material");
      }

      const data = await response.json();

      return data.data.length ? data.data[0] : null;
    },
  });

  return query;
}
