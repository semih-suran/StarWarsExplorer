import { useCallback } from "react";
import { useGetResource } from "@/hooks/useGetResource";
import { useUrlFilters } from "@/hooks/useUrlFilters";
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

export const planetsPredicate = (planet: IPlanet, filters: PlanetsFormData) => {
  const nameMatch = matchesSearch(planet.name, filters.name);
  const terrainMatch = matchesSearch(planet.terrain, filters.terrain);
  return nameMatch && terrainMatch;
};

const INITIAL_FILTERS: PlanetsFormData = { name: "", terrain: "" };

export const Planets = () => {
  const { filters, setFilters, resetFilters } = useUrlFilters(INITIAL_FILTERS);

  const { data, isLoading, error } = useGetResource("planets", getPlanets, 1, filters.name);

  const predicate = useCallback(planetsPredicate, []);

  return (
    <GenericResourcePage
      title="Planets"
      data={data?.results || []}
      isLoading={isLoading}
      error={error}
      filters={filters}
      setFilters={setFilters}
      resetFilters={resetFilters}
      predicate={predicate}
      FilterForm={PlanetsFilterForm}
      List={PlanetsList}
      Modal={PlanetsModal}
    />
  );
};

export default Planets;