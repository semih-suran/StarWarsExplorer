import { useQuery } from "@tanstack/react-query";
import type { IVehicle } from "@/types";
import { API_CONFIG, fetchAllPages } from "../api";

export const useGetVehicles = () =>
  useQuery<IVehicle[], Error>({
    queryKey: ["vehicles-all"],
    queryFn: () => fetchAllPages<IVehicle>("vehicles"),
    staleTime: API_CONFIG.staleTime, // 1 minute
  });
