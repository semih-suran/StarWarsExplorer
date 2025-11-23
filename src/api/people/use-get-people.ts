import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import type { IPeople } from "../../types";
import { api } from "../api";

export type SWAPIList<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

const getAllPeople = async (): Promise<IPeople[]> => {
  let all: IPeople[] = [];
  let page = 1;
  let response;
  do {
    response = await api.get<SWAPIList<IPeople>>(`people/?page=${page}`);
    all = all.concat(response.data.results);
    page++;
  } while (response.data.next);
  return all;
};

export const useGetPeople = (): UseQueryResult<IPeople[], Error> =>
  useQuery<IPeople[], Error>({
    queryKey: ["people-all"],
    queryFn: getAllPeople,
    staleTime: 1000 * 60,
  });
