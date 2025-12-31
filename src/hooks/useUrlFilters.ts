import { useSearchParams } from "react-router-dom";
import { useMemo } from "react";

export function useUrlFilters<T extends Record<string, string>>(initialState: T) {
  const [searchParams] = useSearchParams();

  const filters = useMemo(() => {
    const current: Record<string, string> = {};
    Object.keys(initialState).forEach((key) => {
      current[key] = searchParams.get(key) || initialState[key];
    });
    return current as T;
  }, [searchParams, initialState]);

  return { filters };
}