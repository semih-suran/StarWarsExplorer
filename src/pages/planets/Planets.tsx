import { useCallback, useMemo } from "react";
import { useUiStore } from "@/store/useUiStore";
import { useGetResource } from "@/hooks/useGetResource";
import { getPlanets } from "@/api/api";
import { matchesSearch } from "@/utilities/filter-utils";
import type { IPlanet } from "@/types";

import { GenericResourcePage } from "@/components";
import {
  PlanetsList,
  PlanetsModal,
  PlanetsFilterForm,
  type PlanetsFormData,
} from ".";

export const planetPredicate = (planet: IPlanet, f: PlanetsFormData) => {
  const nameMatch = matchesSearch(planet.name, f.name);

  if (!f.terrain) return nameMatch;
  const filterTerrain = f.terrain.trim().toLowerCase();

  const planetTerrains = planet.terrain
    .split(",")
    .map((t) => t.trim().toLowerCase());

  const terrainMatch = planetTerrains.includes(filterTerrain);

  return nameMatch && terrainMatch;
};

export const Planets = () => {
  const { planetsFilters, setPlanetsFilters, resetPlanetsFilters } =
    useUiStore();
  
  const { data, isLoading, error } = useGetResource(
    "planets",
    getPlanets,
    1,
    planetsFilters.name
  );

  const predicate = useCallback(planetPredicate, []);

  const results = data?.results || [];

  const terrainOptions = useMemo(() => {
    if (!results.length) return [];
    const allTerrains = results.flatMap((p) =>
      p.terrain.split(",").map((t) => t.trim().toLowerCase())
    );
    const unique = Array.from(new Set(allTerrains)).filter(Boolean);
    return unique.sort();
  }, [results]);

  return (
    <GenericResourcePage<IPlanet, PlanetsFormData>
      title="Planets"
      data={results}
      isLoading={isLoading}
      error={error}
      filters={planetsFilters}
      setFilters={setPlanetsFilters}
      resetFilters={resetPlanetsFilters}
      predicate={predicate}
      FilterForm={PlanetsFilterForm}
      List={PlanetsList}
      Modal={PlanetsModal}
      extraFilterProps={{ terrainOptions }}
    />
  );
};

export default Planets;