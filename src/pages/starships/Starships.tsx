import { useCallback, useMemo, useState } from "react";
import { useGetStarships } from "@/api/starships/use-get-starships";
import { Alert } from "@/components/Alert/Alert";
import { Loading } from "@/components/Loading/Loading";
import { StarshipsList, StarshipsModal, StarshipsFilterForm, type StarshipsFormData } from ".";

import { useFilteredList } from "@/hooks/useFilteredList";
import { usePagination } from "@/hooks/usePagination";
import { PaginationControls } from "@/components/PaginationControls/PaginationControls";
import { ActiveFilters } from "@/components/ActiveFilters/ActiveFilters";

import type { IStarship } from "@/types";

export const Starships = () => {
  const [filters, setFilters] = useState<StarshipsFormData>({ name: "", starship_class: "" });
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [page, setPage] = useState(1);

  const { data: allStarships, isLoading, error } = useGetStarships();

  const predicate = useCallback(
    (ship: IStarship, f: StarshipsFormData) => {
      const nameQ = (f.name ?? "").trim().toLowerCase();
      const classQ = (f.starship_class ?? "").trim().toLowerCase();

      const matchesName = !nameQ || (ship.name ?? "").toLowerCase().includes(nameQ);
      const matchesClass = !classQ || (ship.starship_class ?? "").toLowerCase().includes(classQ);

      return matchesName && matchesClass;
    },
    []
  );

  const filtered = useFilteredList(allStarships ?? [], filters, predicate);

  const classOptions = useMemo(() => {
    if (!allStarships) return [];
    const allClasses = allStarships
      .map((s) => (s.starship_class ?? "").trim().toLowerCase())
      .filter(Boolean);
    return Array.from(new Set(allClasses)).sort();
  }, [allStarships]);

  const { totalPages, paginated } = usePagination(filtered, page, 10);

  const wrappedPrev = () => setPage((p) => Math.max(1, p - 1));
  const wrappedNext = () => setPage((p) => Math.min(totalPages, p + 1));

  if (isLoading) return <Loading />;
  if (error) return <Alert message={(error as Error).message} />;

  const handleFilter = (form: StarshipsFormData) => {
    setFilters({
      name: form.name?.trim() ?? "",
      starship_class: form.starship_class?.trim() ?? "",
    });
    setPage(1);
  };

  const handleReset = () => {
    setFilters({ name: "", starship_class: "" });
    setPage(1);
  };

  return (
    <>
      <StarshipsFilterForm
        onSubmit={handleFilter}
        onReset={handleReset}
        defaultValues={filters}
        classOptions={classOptions}
      />

      <ActiveFilters
        filters={{ name: filters.name, class: filters.starship_class }}
        onReset={handleReset}
      />

      <StarshipsList data={paginated} onView={(id) => setSelectedId(id)} />

      <PaginationControls
        page={page}
        totalPages={totalPages}
        onPrev={wrappedPrev}
        onNext={wrappedNext}
      />

      {selectedId && <StarshipsModal id={selectedId} onClose={() => setSelectedId(null)} />}
    </>
  );
};

export default Starships;
