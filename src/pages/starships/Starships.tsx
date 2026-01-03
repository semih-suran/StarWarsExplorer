import { useState } from "react";
import { api } from "@/api/api";
import { queryKeys } from "@/api/queryKeys";
import { ResourceLayout } from "@/components/ResourceLayout/ResourceLayout";
import { ActiveFilters } from "@/components/ActiveFilters/ActiveFilters";
import { PaginationControls } from "@/components/PaginationControls/PaginationControls";
import { StarshipsList } from "./components/StarshipsList/StarshipsList";
import { StarshipsFilterForm, type StarshipsFormData } from "./components/StarshipsFilterForm/StarshipsFilterForm";
import { StarshipsModal } from "./components/StarshipsModal/StarshipsModal";
import { matchesSearch } from "@/utilities/filter-utils";
import type { IStarship } from "@/types";
import { useResourceLogic } from "@/hooks/useResourceLogic";

const starshipsPredicate = (starship: IStarship, filters: StarshipsFormData) => {
  const nameMatch = matchesSearch(starship.name, filters.name);
  const classMatch = matchesSearch(starship.starship_class, filters.starship_class);
  return nameMatch && classMatch;
};

const INITIAL_FILTERS: StarshipsFormData = { name: "", starship_class: "" };

export const Starships = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const fetchAllStarships = async () => api.starships.list(1, "");

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
    resourceName: "starships",
    fetcher: fetchAllStarships,
    queryKey: queryKeys.starships.all,
    initialFilters: INITIAL_FILTERS,
    searchParamName: "name",
    predicate: starshipsPredicate,
  });

  return (
    <ResourceLayout title="Starships" isLoading={isLoading} error={error}>
      <div className="bg-base-200 p-4 rounded-lg shadow-md mb-6">
        <StarshipsFilterForm
          onSubmit={setFilters}
          onReset={resetFilters}
          defaultValues={filters as StarshipsFormData}
          resourceList={allData}
        />
      </div>

      <ActiveFilters filters={filters} onReset={resetFilters} />

      {data.length === 0 ? (
        <div className="alert alert-warning">No starships found matching your criteria.</div>
      ) : (
        <>
          <div className="mb-4 text-sm opacity-70">Showing {data.length} results</div>
          <StarshipsList data={data} onView={setSelectedId} />
          
          <PaginationControls
            page={pagination.page}
            totalPages={pagination.totalPages}
            onNext={pagination.nextPage}
            onPrev={pagination.prevPage}
          />
        </>
      )}

      <StarshipsModal id={selectedId} onClose={() => setSelectedId(null)} />
    </ResourceLayout>
  );
};

export default Starships;