import { useSearchParams } from "react-router-dom";
import { useMemo, useCallback } from "react";

export function useUrlFilters<T extends Record<string, unknown>>(
  initialFilters: T
) {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = useMemo(() => {
    const current = { ...initialFilters } as Record<string, unknown>;
    
    searchParams.forEach((value, key) => {
      if (Object.prototype.hasOwnProperty.call(initialFilters, key)) {
        current[key] = value;
      }
    });

    return current as T;
  }, [searchParams, initialFilters]);

  const setFilters = useCallback((newFilters: Partial<T>) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      Object.entries(newFilters).forEach(([key, value]) => {
        if (value === undefined || value === null || value === "") {
            next.delete(key);
        } else {
            next.set(key, String(value));
        }
      });
      return next;
    }, { replace: true });
  }, [setSearchParams]);

  const resetFilters = useCallback(() => {
    setSearchParams(new URLSearchParams(), { replace: true });
  }, [setSearchParams]);

  return { filters, setFilters, resetFilters };
}