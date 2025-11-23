import { useMemo } from "react";

export function useFilteredList<T, F>(
  items: T[] | undefined,
  filters: F,
  predicate: (item: T, filters: F) => boolean
): T[] {
  return useMemo(() => {
    if (!items) return [];
    return items.filter((it) => predicate(it, filters));
  }, [items, filters, predicate]);
}
