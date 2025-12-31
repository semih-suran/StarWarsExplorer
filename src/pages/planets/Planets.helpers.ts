import type { IPlanet } from "@/types";
import { matchesSearch } from "@/utilities/filter-utils";

export type PlanetsFormData = { name: string; terrain: string };

export const planetsPredicate = (planet: IPlanet, filters: PlanetsFormData) => {
  const nameMatch = matchesSearch(planet.name, filters.name);
  const terrainMatch =
    filters.terrain === "" ||
    planet.terrain.toLowerCase().includes(filters.terrain.toLowerCase());

  return nameMatch && terrainMatch;
};