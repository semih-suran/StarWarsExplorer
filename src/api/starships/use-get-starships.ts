import { useQuery } from "@tanstack/react-query";
import type { IStarship } from "@/types";
import { API_CONFIG, fetchAllPages } from "../api";

export const useGetStarships = () =>
  useQuery<IStarship[], Error>({
    queryKey: ["starships-all"],
    queryFn: () => fetchAllPages<IStarship>("starships"),
    staleTime: API_CONFIG.staleTime, // 1 minute
  });
