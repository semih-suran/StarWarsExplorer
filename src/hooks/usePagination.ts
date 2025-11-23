import { useEffect, useMemo, useState } from "react";

export function usePagination<T>(items: T[], initialPage = 1, pageSize = 10) {
  const [page, setPage] = useState(initialPage);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(items.length / pageSize)),
    [items.length, pageSize]
  );

  useEffect(() => {
    setPage((p) => (p > totalPages ? totalPages : Math.max(1, p)));
  }, [totalPages]);

  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, page, pageSize]);

  const next = () => setPage((p) => Math.min(totalPages, p + 1));
  const prev = () => setPage((p) => Math.max(1, p - 1));
  const goTo = (p: number) =>
    setPage(() => Math.min(Math.max(1, Math.floor(p)), totalPages));

  return {
    page,
    pageSize,
    totalPages,
    paginated,
    next,
    prev,
    goTo,
    setPage,
  };
}
