import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import type { IStarship } from "@/types";
import { api } from "../api";

export type SWAPIList<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

const getAllStarships = async (): Promise<IStarship[]> => {
  let all: IStarship[] = [];
  let page = 1;
  let res;
  do {
    res = await api.get<SWAPIList<IStarship>>(`starships/?page=${page}`);
    all = all.concat(res.data.results);
    page++;
  } while (res.data.next);
  return all;
};

export const useGetStarships = (): UseQueryResult<IStarship[], Error> =>
  useQuery<IStarship[], Error>({
    queryKey: ["starships-all"],
    queryFn: getAllStarships,
    staleTime: 1000 * 60,
  });
