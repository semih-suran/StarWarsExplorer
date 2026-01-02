import { useState, useMemo, useCallback } from "react";

type UsePaginationProps = {
  totalItems: number;
  itemsPerPage?: number;
  initialPage?: number;
};

export const usePagination = ({
  totalItems,
  itemsPerPage = 10,
  initialPage = 1,
}: UsePaginationProps) => {
  const [page, setPage] = useState(initialPage);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(totalItems / itemsPerPage)),
    [totalItems, itemsPerPage]
  );

  const safePage = Math.min(page, totalPages);

  const nextPage = useCallback(() => {
    setPage((p) => Math.min(p + 1, totalPages));
  }, [totalPages]);

  const prevPage = useCallback(() => {
    setPage((p) => Math.max(p - 1, 1));
  }, []);

  const goToPage = useCallback(
    (p: number) => {
      const target = Math.max(1, Math.min(p, totalPages));
      setPage(target);
    },
    [totalPages]
  );

  const startIndex = (safePage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  return {
    page: safePage,
    setPage: goToPage,
    nextPage,
    prevPage,
    totalPages,
    startIndex,
    endIndex,
  };
};