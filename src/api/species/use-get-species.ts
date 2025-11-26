import { useQuery } from "@tanstack/react-query";
import type { ISpecie } from "@/types";
import { API_CONFIG, fetchAllPages } from "../api";

export const useGetSpecies = () =>
  useQuery<ISpecie[], Error>({
    queryKey: ["species-all"],
    queryFn: () => fetchAllPages<ISpecie>("species"),
    staleTime: API_CONFIG.staleTime, // 1 minute
  });
