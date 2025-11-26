import { useCallback, useMemo } from "react";
import { useUiStore } from "@/store/useUiStore";
import { useGetPlanets } from "@/api/planets/use-get-planets";
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
  const { data, isLoading, error } = useGetPlanets();

  const predicate = useCallback(planetPredicate, []);

  const terrainOptions = useMemo(() => {
    if (!data) return [];
    const allTerrains = data.flatMap((p) =>
      p.terrain.split(",").map((t) => t.trim().toLowerCase())
    );
    const unique = Array.from(new Set(allTerrains)).filter(Boolean);
    return unique.sort();
  }, [data]);

  return (
    <GenericResourcePage<IPlanet, PlanetsFormData>
      data={data}
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
