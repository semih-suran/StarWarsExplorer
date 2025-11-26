import { useQuery } from "@tanstack/react-query";
import type { IPlanet } from "@/types";
import { API_CONFIG, fetchAllPages } from "../api";

export const useGetPlanets = () =>
  useQuery<IPlanet[], Error>({
    queryKey: ["planets-all"],
    queryFn: () => fetchAllPages<IPlanet>("planets"),
    staleTime: API_CONFIG.staleTime, // 1 minute
  });
