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
}

export function useResourceLogic<T, F extends Record<string, string>>({
  resourceName,
  fetcher,
  initialFilters,
  searchParamName,
  predicate,
}: UseResourceLogicParams<T, F>) {
  const [searchParams, setSearchParams] = useSearchParams();

  const { filters } = useUrlFilters(initialFilters);

  const page = Number(searchParams.get("page") || "1");
  const searchTerm = filters[searchParamName] || "";

  const { data, isLoading, error } = useGetResource(
    resourceName,
    fetcher,
    page,
    searchTerm
  );

  const rawResults = data?.results || [];
  const itemsPerPage = 10;

  const filteredResults = useMemo(() => {
    return rawResults.filter((item) => predicate(item, filters));
  }, [rawResults, filters, predicate]);

  const totalCount = filteredResults.length;
  const totalPages = Math.ceil(totalCount / itemsPerPage) || 1;

  const paginatedData = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredResults.slice(start, end);
  }, [filteredResults, page]);

  const setFilters = useCallback(
    (newFilters: Partial<F>) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);

          Object.entries(newFilters).forEach(([key, value]) => {
            if (!value) next.delete(key);
            else next.set(key, value as string);
          });

          next.set("page", "1");

          return next;
        },
        { replace: true }
      );
    },
    [setSearchParams]
  );

  const goToPage = useCallback(
    (newPage: number) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        next.set("page", String(newPage));
        return next;
      });
    },
    [setSearchParams]
  );

  const resetFilters = useCallback(() => {
    setSearchParams(new URLSearchParams(), { replace: true });
  }, [setSearchParams]);

  return {
    data: paginatedData,
    allData: rawResults,
    isLoading,
    error,
    filters,
    setFilters,
    resetFilters,
    pagination: {
      page,
      totalPages,
      goToPage,
      nextPage: () => {
        if (page < totalPages) {
          goToPage(page + 1);
        }
      },
      prevPage: () => {
        if (page > 1) {
          goToPage(page - 1);
        }
      },
    },
  };
}