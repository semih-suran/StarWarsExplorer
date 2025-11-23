import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { api } from "@/api/api";

export type SWAPIList<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

type Film = {
  title: string;
  url: string;
  episode_id?: number;
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
