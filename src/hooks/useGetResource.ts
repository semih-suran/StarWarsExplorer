import { useQuery, keepPreviousData } from "@tanstack/react-query";
import type { SWAPIList } from "../types";

export const useGetResource = <T>(
  resourceName: string,
  fetcher: (page: number, search: string) => Promise<SWAPIList<T>>,
  page: number,
  search: string = ""
) => {
  return useQuery({
    queryKey: [resourceName, page, search],
    queryFn: () => fetcher(page, search),

    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};
