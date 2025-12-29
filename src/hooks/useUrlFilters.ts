import { useSearchParams } from "react-router-dom";
import { useMemo, useCallback } from "react";

export function useUrlFilters<T extends Record<string, string>>(initialState: T) {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = useMemo(() => {
    const current: any = {};
    Object.keys(initialState).forEach((key) => {
      current[key] = searchParams.get(key) || initialState[key];
    });
    return current as T;
  }, [searchParams, initialState]);

  const setFilters = useCallback(
    (newFilters: Partial<T>) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        Object.entries(newFilters).forEach(([key, value]) => {
          if (value === undefined || value === null || value === "") {
            next.delete(key);
          } else {
            next.set(key, value as string);
          }
        });
        return next;
      });
    },
    [setSearchParams]
  );

  const resetFilters = useCallback(() => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      Object.keys(initialState).forEach((key) => {
        next.delete(key);
      });
      return next;
    });
  }, [setSearchParams, initialState]);

  return { filters, setFilters, resetFilters };
}