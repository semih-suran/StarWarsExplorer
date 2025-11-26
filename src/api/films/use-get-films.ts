import { useQuery } from "@tanstack/react-query";
import { API_CONFIG, fetchAllPages } from "@/api/api";

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

export const useGetFilms = () =>
  useQuery<Film[], Error>({
    queryKey: ["films-all"],
    queryFn: () => fetchAllPages<Film>("films"),
    staleTime: API_CONFIG.staleTime * 60, // 60 minutes
  });
