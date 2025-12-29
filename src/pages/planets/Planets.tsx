import { useCallback } from "react";
import { getPlanets } from "@/api/api";
import { GenericResourcePage } from "@/components";
import { PlanetsList } from "./components/PlanetsList/PlanetsList";
import {
  PlanetsFilterForm,
  type PlanetsFormData,
} from "./components/PlanetsFilterForm/PlanetsFilterForm";
import PlanetsModal from "./components/PlanetsModal/PlanetsModal";
import { matchesSearch } from "@/utilities/filter-utils";
import type { IPlanet } from "@/types";
import { useResourceLogic } from "@/hooks/useResourceLogic";

export const planetsPredicate = (planet: IPlanet, filters: PlanetsFormData) => {
  const nameMatch = matchesSearch(planet.name, filters.name);
  const terrainMatch = matchesSearch(planet.terrain, filters.terrain);
  return nameMatch && terrainMatch;
};

const INITIAL_FILTERS: PlanetsFormData = { name: "", terrain: "" };

export const Planets = () => {
  const predicate = useCallback(planetsPredicate, []);

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