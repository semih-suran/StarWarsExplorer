import { useCallback, useMemo } from "react";
import { useUiStore } from "@/store/useUiStore";
import { useGetStarships } from "@/api/starships/use-get-starships";
import { matchesSearch, matchesExact } from "@/utilities/filter-utils";
import type { IStarship } from "@/types";

import { GenericResourcePage } from "@/components";
import {
  StarshipsList,
  StarshipsModal,
  StarshipsFilterForm,
  type StarshipsFormData,
} from ".";

export const starshipPredicate = (ship: IStarship, f: StarshipsFormData) => {
  const nameMatch = matchesSearch(ship.name, f.name);
  const classMatch = matchesExact(ship.starship_class, f.starship_class);
  return nameMatch && classMatch;
};

export const Starships = () => {
  const { starshipsFilters, setStarshipsFilters, resetStarshipsFilters } =
    useUiStore();
  const { data, isLoading, error } = useGetStarships();

  const predicate = useCallback(starshipPredicate, []);

  const classOptions = useMemo(() => {
    if (!data) return [];
    const allClasses = data
      .map((s) => (s.starship_class ?? "").trim().toLowerCase())
      .filter(Boolean);
    return Array.from(new Set(allClasses)).sort();
  }, [data]);

  return (
    <GenericResourcePage<IStarship, StarshipsFormData>
      data={data}
      isLoading={isLoading}
      error={error}
      filters={starshipsFilters}
      setFilters={setStarshipsFilters}
      resetFilters={resetStarshipsFilters}
      predicate={predicate}
      FilterForm={StarshipsFilterForm}
      List={StarshipsList}
      Modal={StarshipsModal}
      extraFilterProps={{ classOptions }}
    />
  );
};

export default Starships;
