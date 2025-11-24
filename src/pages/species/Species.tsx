import { useCallback, useMemo, useState } from "react";
import { Alert } from "@/components/Alert/Alert";
import { Loading } from "@/components/Loading/Loading";
import { SpeciesList, SpeciesModal, SpeciesFilterForm, type SpeciesFormData } from ".";
import { useGetSpecies } from "@/api/species/use-get-species";
import { useUiStore } from "@/store/useUiStore";

import { useFilteredList } from "@/hooks/useFilteredList";
import { usePagination } from "@/hooks/usePagination";
import { PaginationControls } from "@/components/PaginationControls/PaginationControls";
import { ActiveFilters } from "@/components/ActiveFilters/ActiveFilters";

import type { ISpecie } from "@/types";

export const Species = () => {
  const filters = useUiStore((s) => s.speciesFilters);
  const setFilters = useUiStore((s) => s.setSpeciesFilters);
  const resetFilters = useUiStore((s) => s.resetSpeciesFilters);

  const [selectedId, setSelectedId] = useState<string | null>(null);

  const {
    data: allSpecies,
    isLoading: speciesLoading,
    error: speciesError,
  } = useGetSpecies();

  const predicate = useCallback((specie: ISpecie, f: SpeciesFormData) => {
    const nameQ = (f.name ?? "").trim().toLowerCase();
    const classQ = (f.classification ?? "").trim().toLowerCase();

    const matchesName =
      !nameQ || (specie.name ?? "").toLowerCase().includes(nameQ);

    const matchesClassification =
      !classQ ||
      ((specie.classification ?? "").toLowerCase().includes(classQ));

    return matchesName && matchesClassification;
  }, []);

  const filtered = useFilteredList(allSpecies ?? [], filters, predicate);

  const classificationOptions = useMemo(() => {
    if (!allSpecies) return [];
    const opts = Array.from(
      new Set(
        allSpecies
          .map((s) => (s.classification ?? "").trim().toLowerCase())
          .filter(Boolean)
      )
    );
    return opts.sort().map((c) => ({ id: c, label: c }));
  }, [allSpecies]);

  const { page, totalPages, paginated, prev, next, setPage } = usePagination(
    filtered,
    1,
    10
  );

  const activeFiltersForDisplay = useMemo(() => {
    const classLabel =
      filters.classification &&
      classificationOptions.find((o) => o.id === filters.classification)?.label;
    return {
      name: filters.name ?? "",
      classification: classLabel ?? filters.classification ?? "",
    };
  }, [filters, classificationOptions]);

  const isLoading = speciesLoading;
  const error = speciesError;

  if (isLoading) return <Loading />;
  if (error) return <Alert message={(error as Error).message} />;

  const handleFilter = (form: SpeciesFormData) => {
    setFilters({
      name: form.name?.trim() ?? "",
      classification: form.classification?.trim() ?? "",
    });
    setPage(1);
  };

  const handleReset = () => {
    resetFilters();
    setPage(1);
  };

  return (
    <>
      <SpeciesFilterForm
        onSubmit={handleFilter}
        onReset={handleReset}
        defaultValues={filters}
        classificationOptions={classificationOptions}
      />

      <ActiveFilters
        filters={{
          name: activeFiltersForDisplay.name,
          classification: activeFiltersForDisplay.classification,
        }}
        onReset={handleReset}
      />

      <SpeciesList data={paginated} onView={(id) => setSelectedId(id)} />

      <PaginationControls
        page={page}
        totalPages={totalPages}
        onPrev={prev}
        onNext={next}
      />

      {selectedId && (
        <SpeciesModal id={selectedId} onClose={() => setSelectedId(null)} />
      )}
    </>
  );
};

export default Species;