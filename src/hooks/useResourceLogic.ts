import { useSearchParams } from "react-router-dom";
import { useCallback, useMemo } from "react";
import { useUrlFilters } from "./useUrlFilters";
import { useGetResource } from "./useGetResource";
import type { SWAPIList } from "@/types";

interface UseResourceLogicParams<T, F> {
  resourceName: string;
  fetcher: (page: number, search: string) => Promise<SWAPIList<T>>;
  initialFilters: F;
  searchParamName: keyof F;
  predicate: (item: T, filters: F) => boolean;
  pageSize?: number;
}

export function useResourceLogic<T, F extends Record<string, string>>({
  resourceName,
  fetcher,
  initialFilters,
  searchParamName,
  predicate,
  pageSize = 10,
}: UseResourceLogicParams<T, F>) {
  const [searchParams, setSearchParams] = useSearchParams();
  const { filters } = useUrlFilters(initialFilters);

  const pageParam = searchParams.get("page");
  const page = pageParam ? Math.max(1, parseInt(pageParam, 10) || 1) : 1;
  const searchTerm = filters[searchParamName] || "";
  const { data, isLoading, error } = useGetResource(
    resourceName,
    fetcher,
    page,
    searchTerm
  );

  const allData = useMemo(() => data?.results || [], [data]);

  const filteredResults = useMemo(() => {
    return allData.filter((item) => predicate(item, filters));
  }, [allData, filters, predicate]);

  const totalCount = filteredResults.length;
  const totalPages = Math.ceil(totalCount / pageSize) || 1;

  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredResults.slice(start, start + pageSize);
  }, [filteredResults, page, pageSize]);
  
  const setFilters = useCallback(
    (newFilters: Partial<F>) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          
          Object.entries(newFilters).forEach(([key, val]) => {
            if (val) next.set(key, val as string);
            else next.delete(key);
          });

          next.set("page", "1");
          return next;
        },
        { replace: true }
      );
    },
    [setSearchParams]
  );

  const resetFilters = useCallback(() => {
    setSearchParams(new URLSearchParams(), { replace: true });
  }, [setSearchParams]);

  const goToPage = useCallback(
    (p: number) => {
      const target = Math.max(1, Math.min(p, totalPages));
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          next.set("page", String(target));
          return next;
        },
        { replace: false }
      );
    },
    [setSearchParams, totalPages]
  );

  return {
    data: paginatedData,
    allData,
    isLoading,
    error,
    filters,
    setFilters,
    resetFilters,
    pagination: {
      page,
      totalPages,
      goToPage,
      nextPage: () => goToPage(page + 1),
      prevPage: () => goToPage(page - 1),
    },
  };
}