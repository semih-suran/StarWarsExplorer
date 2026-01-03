import { useState } from "react";
import { api } from "@/api/api";
import { queryKeys } from "@/api/queryKeys";
import { ResourceLayout } from "@/components/ResourceLayout/ResourceLayout";
import { ActiveFilters } from "@/components/ActiveFilters/ActiveFilters";
import { PaginationControls } from "@/components/PaginationControls/PaginationControls";
import { SpeciesList } from "./components/SpeciesList/SpeciesList";
import { SpeciesFilterForm, type SpeciesFormData } from "./components/SpeciesFilterForm/SpeciesFilterForm";
import { SpeciesModal } from "./components/SpeciesModal/SpeciesModal";
import { matchesSearch } from "@/utilities/filter-utils";
import type { ISpecie } from "@/types";
import { useResourceLogic } from "@/hooks/useResourceLogic";

const speciesPredicate = (specie: ISpecie, filters: SpeciesFormData) => {
  const nameMatch = matchesSearch(specie.name, filters.name);
  const classMatch = matchesSearch(specie.classification, filters.classification);
  return nameMatch && classMatch;
};

const INITIAL_FILTERS: SpeciesFormData = { name: "", classification: "" };

export const Species = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const fetchAllSpecies = async () => api.species.list(1, "");

  const { 
    data, 
    allData,
    isLoading, 
    error, 
    filters, 
    setFilters, 
    resetFilters,
    pagination 
  } = useResourceLogic({
    resourceName: "species",
    fetcher: fetchAllSpecies,
    queryKey: queryKeys.species.all,
    initialFilters: INITIAL_FILTERS,
    searchParamName: "name",
    predicate: speciesPredicate,
  });

  return (
    <ResourceLayout title="Species" isLoading={isLoading} error={error}>
      <div className="bg-base-200 p-4 rounded-lg shadow-md mb-6">
        <SpeciesFilterForm
          onSubmit={setFilters}
          onReset={resetFilters}
          defaultValues={filters as SpeciesFormData}
          resourceList={allData}
        />
      </div>

      <ActiveFilters filters={filters} onReset={resetFilters} />

      {data.length === 0 ? (
        <div className="alert alert-warning">No species found matching your criteria.</div>
      ) : (
        <>
          <div className="mb-4 text-sm opacity-70">Showing {data.length} results</div>
          <SpeciesList data={data} onView={setSelectedId} />
          
          <PaginationControls
            page={pagination.page}
            totalPages={pagination.totalPages}
            onNext={pagination.nextPage}
            onPrev={pagination.prevPage}
          />
        </>
      )}

      <SpeciesModal id={selectedId} onClose={() => setSelectedId(null)} />
    </ResourceLayout>
  );
};

export default Species;