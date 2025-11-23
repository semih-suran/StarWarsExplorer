import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { api } from "@/api/api";

export type SWAPIList<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

export type Film = {
  title: string;
  episode_id: number;
  opening_crawl: string;
  director: string;
  producer: string;
  release_date: string;
  characters?: string[];
  planets?: string[];
  starships?: string[];
  vehicles?: string[];
  species?: string[];
  created?: string;
  edited?: string;
  url: string;
};

const getAllFilms = async (): Promise<Film[]> => {
  let all: Film[] = [];
  let page = 1;
  let res;
  do {
    res = await api.get<SWAPIList<Film>>(`films/?page=${page}`);
    all = all.concat(res.data.results);
    page++;
  } while (res.data.next);
  return all;
};

export const useGetFilms = (): UseQueryResult<Film[], Error> =>
  useQuery<Film[], Error>({
    queryKey: ["films-all"],
    queryFn: getAllFilms,
    staleTime: 1000 * 60 * 60,
  });
