import { getPlanets } from "@/api/api";
import { ResourceLayout } from "@/components/ResourceLayout/ResourceLayout";
import { ActiveFilters } from "@/components/ActiveFilters/ActiveFilters";
import { PaginationControls } from "@/components/PaginationControls/PaginationControls";
import { PlanetsList } from "./components/PlanetsList/PlanetsList";
import { PlanetsFilterForm } from "./components/PlanetsFilterForm/PlanetsFilterForm";
import { PlanetsModal } from "./components/PlanetsModal/PlanetsModal";
import { useResourceLogic } from "@/hooks/useResourceLogic";
import { planetsPredicate, type PlanetsFormData } from "./Planets.helpers";
import { useState } from "react";

const INITIAL_FILTERS: PlanetsFormData = { name: "", terrain: "" };

export const Planets = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);

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
    resourceName: "planets",
    fetcher: getPlanets,
    initialFilters: INITIAL_FILTERS,
    searchParamName: "name",
    predicate: planetsPredicate,
  });

  return (
    <ResourceLayout title="Planets" isLoading={isLoading} error={error}>
      <div className="bg-base-200 p-4 rounded-lg shadow-md mb-6">
        <PlanetsFilterForm
          onSubmit={setFilters}
          onReset={resetFilters}
          defaultValues={filters}
          resourceList={allData}
        />
      </div>

      <ActiveFilters filters={filters} onReset={resetFilters} />

      {data.length === 0 ? (
        <div className="alert alert-info">No results found matching your criteria.</div>
      ) : (
        <>
          <div className="mb-4 text-sm opacity-70">Showing {data.length} results</div>
          <PlanetsList data={data} onView={setSelectedId} />
          
          <PaginationControls
            page={pagination.page}
            totalPages={pagination.totalPages}
            onNext={pagination.nextPage}
            onPrev={pagination.prevPage}
          />
        </>
      )}

      <PlanetsModal id={selectedId} onClose={() => setSelectedId(null)} />
    </ResourceLayout>
  );
};

export default Planets;