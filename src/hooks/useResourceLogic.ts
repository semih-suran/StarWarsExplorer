import { useMemo, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { usePagination } from "./usePagination";
import { useUrlFilters } from "./useUrlFilters";
import { API_CONFIG } from "@/api/api";

type SWAPIList<T> = {
  results: T[];
  count: number;
};

type UseResourceLogicProps<T, F> = {
  resourceName: string;
  fetcher: () => Promise<SWAPIList<T> | T[]>; 
  initialFilters: F;
  searchParamName?: string;
  predicate: (item: T, filters: F) => boolean;
  itemsPerPage?: number;
  queryKey?: readonly unknown[];
};

export const useResourceLogic = <T extends { url: string }, F extends Record<string, unknown>>({
  resourceName,
  fetcher,
  initialFilters,
  predicate,
  itemsPerPage = 10,
  queryKey,
}: UseResourceLogicProps<T, F>) => {
  
  const { data: rawData, isLoading, error } = useQuery({
    queryKey: queryKey || [resourceName, "all"], 
    queryFn: fetcher,
    staleTime: API_CONFIG.staleTime,
  });

  const allData = useMemo(() => {
    if (!rawData) return [];
    if (Array.isArray(rawData)) return rawData;
    return (rawData as SWAPIList<T>).results || [];
  }, [rawData]);

  const { filters, setFilters: setUrlFilters, resetFilters: resetUrlFilters } = useUrlFilters(
    initialFilters
  );

  const filteredData = useMemo(() => {
    return allData.filter((item) => predicate(item, filters));
  }, [allData, filters, predicate]);

  const pagination = usePagination({
    totalItems: filteredData.length,
    itemsPerPage,
  });

  const handleSetFilters = useCallback(
    (newFilters: Partial<F>) => {
      setUrlFilters(newFilters);
      pagination.setPage(1); 
    },
    [setUrlFilters, pagination]
  );

  const handleResetFilters = useCallback(() => {
    resetUrlFilters();
    pagination.setPage(1);
  }, [resetUrlFilters, pagination]);

  const paginatedData = useMemo(() => {
    return filteredData.slice(pagination.startIndex, pagination.endIndex);
  }, [filteredData, pagination.startIndex, pagination.endIndex]);

  return {
    data: paginatedData,
    allData,
    isLoading,
    error,
    filters,
    setFilters: handleSetFilters,
    resetFilters: handleResetFilters,
    pagination,
  };
};