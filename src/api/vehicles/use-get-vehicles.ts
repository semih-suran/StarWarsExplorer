import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import type { IVehicle } from "@/types";
import { api } from "../api";

export type SWAPIList<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

const getAllVehicles = async (): Promise<IVehicle[]> => {
  let all: IVehicle[] = [];
  let page = 1;
  let res;
  do {
    res = await api.get<SWAPIList<IVehicle>>(`vehicles/?page=${page}`);
    all = all.concat(res.data.results);
    page++;
  } while (res.data.next);
  return all;
};

export const useGetVehicles = (): UseQueryResult<IVehicle[], Error> =>
  useQuery<IVehicle[], Error>({
    queryKey: ["vehicles-all"],
    queryFn: getAllVehicles,
    staleTime: 1000 * 60,
  });
