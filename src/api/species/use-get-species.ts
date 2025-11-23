import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import type { ISpecie } from "@/types";
import { api } from "../api";

export type SWAPIList<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

const getAllSpecies = async (): Promise<ISpecie[]> => {
  let all: ISpecie[] = [];
  let page = 1;
  let response;
  do {
    response = await api.get<SWAPIList<ISpecie>>(`species/?page=${page}`);
    all = all.concat(response.data.results);
    page++;
  } while (response.data.next);
  return all;
};

export const useGetSpecies = (): UseQueryResult<ISpecie[], Error> =>
  useQuery<ISpecie[], Error>({
    queryKey: ["species-all"],
    queryFn: getAllSpecies,
    staleTime: 1000 * 60,
  });
