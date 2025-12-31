import { getPlanets } from "@/api/api";
import { GenericResourcePage } from "@/components";
import { PlanetsList } from "./components/PlanetsList/PlanetsList";
import { PlanetsFilterForm } from "./components/PlanetsFilterForm/PlanetsFilterForm";
import PlanetsModal from "./components/PlanetsModal/PlanetsModal";
import { useResourceLogic } from "@/hooks/useResourceLogic";

import { planetsPredicate, type PlanetsFormData } from "./Planets.helpers";

const INITIAL_FILTERS: PlanetsFormData = { name: "", terrain: "" };

export const Planets = () => {
  const predicate = planetsPredicate;

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
    predicate,
  });

  return (
    <GenericResourcePage
      title="Planets"
      data={data}
      allData={allData}
      isLoading={isLoading}
      error={error}
      filters={filters}
      setFilters={setFilters}
      resetFilters={resetFilters}
      predicate={predicate}
      FilterForm={PlanetsFilterForm}
      List={PlanetsList}
      Modal={PlanetsModal}
      pagination={pagination}
    />
  );
};

export default Planets;