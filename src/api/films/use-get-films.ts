import { useQuery } from "@tanstack/react-query";
import { API_CONFIG, fetchAllPages } from "@/api/api";
import type { Film } from "@/types/film";

export const useGetFilms = () =>
  useQuery<Film[], Error>({
    queryKey: ["films-all"],
    queryFn: () => fetchAllPages<Film>("films"),
    staleTime: API_CONFIG.staleTime * 60,
  });