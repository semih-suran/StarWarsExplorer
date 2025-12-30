import { useState, useEffect, useMemo } from "react";

export const usePagination = <T>(data: T[], pageSize = 10) => {
  const [page, setPage] = useState(1);

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(data.length / pageSize));
  }, [data.length, pageSize]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(1);
    }
  }, [totalPages, page]);

  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize;
    return data.slice(start, start + pageSize);
  }, [data, page, pageSize]);

  const next = () => setPage((p) => Math.min(p + 1, totalPages));
  const prev = () => setPage((p) => Math.max(p - 1, 1));
  const goTo = (p: number) => {
    const target = Math.max(1, Math.min(p, totalPages));
    setPage(target);
  };

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
};