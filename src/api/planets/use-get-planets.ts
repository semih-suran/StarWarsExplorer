import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import type { IPlanet } from '@/types';
import { api } from '../api';

export type SWAPIList<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

const getAllPlanets = async (): Promise<IPlanet[]> => {
  let all: IPlanet[] = [];
  let page = 1;
  let response;
  do {
    response = await api.get<SWAPIList<IPlanet>>(`planets/?page=${page}`);
    all = all.concat(response.data.results);
    page++;
  } while (response.data.next);
  return all;
};

export const useGetPlanets = (): UseQueryResult<IPlanet[], Error> =>
  useQuery<IPlanet[], Error>({
    queryKey: ['planets-all'],
    queryFn: getAllPlanets,
    staleTime: 1000 * 60,
  });
