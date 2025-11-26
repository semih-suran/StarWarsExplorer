import { useQuery, } from "@tanstack/react-query";
import type { IPeople } from "../../types";
import { API_CONFIG, fetchAllPages } from "../api";


export const useGetPeople = () => useQuery<IPeople[], Error>({
    queryKey: ["people-all"],
    queryFn: ()=>fetchAllPages<IPeople>("people"),
    staleTime: API_CONFIG.staleTime, // 1 minute
  });
