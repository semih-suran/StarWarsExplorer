import { useQueries } from "@tanstack/react-query";
import { api, API_CONFIG } from "@/api/api";
import { useFavoritesStore } from "@/store/useFavoritesStore";

export const useFavoritesData = () => {
  const { favoriteIds } = useFavoritesStore();

  const uniqueIds = Array.from(new Set(favoriteIds));

  const queries = useQueries({
    queries: uniqueIds.map((url) => ({
      queryKey: ["resource", url],
      queryFn: async () => {
        const { data } = await api.get(url);
        return data;
      },
      staleTime: API_CONFIG.staleTime,
      retry: false, 
    })),
  });

  const isLoading = queries.some((q) => q.isLoading);

  const data = queries
    .filter((q) => q.isSuccess && q.data)
    .map((q) => q.data);

  return { data, isLoading };
};