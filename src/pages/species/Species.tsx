import { useCallback, useMemo } from "react";
import { useUiStore } from "@/store/useUiStore";
import { useGetSpecies } from "@/api/species/use-get-species";
import { matchesSearch, matchesExact } from "@/utilities/filter-utils";
import type { ISpecie } from "@/types";

import { GenericResourcePage } from "@/components";
import {
  SpeciesList,
  SpeciesModal,
  SpeciesFilterForm,
  type SpeciesFormData,
} from ".";

export const speciesPredicate = (specie: ISpecie, f: SpeciesFormData) => {
  const nameMatch = matchesSearch(specie.name, f.name);
  const classMatch = matchesExact(specie.classification, f.classification);
  return nameMatch && classMatch;
};

export const Species = () => {
  const { speciesFilters, setSpeciesFilters, resetSpeciesFilters } =
    useUiStore();
  const { data, isLoading, error } = useGetSpecies();

  const predicate = useCallback(speciesPredicate, []);

  const classificationOptions = useMemo(() => {
    if (!data) return [];
    const opts = Array.from(
      new Set(
        data
          .map((s) => (s.classification ?? "").trim().toLowerCase())
          .filter(Boolean)
      )
    );
    return opts.sort().map((c) => ({ id: c, label: c }));
  }, [data]);

  return (
    <GenericResourcePage<ISpecie, SpeciesFormData>
      data={data}
      isLoading={isLoading}
      error={error}
      filters={speciesFilters}
      setFilters={setSpeciesFilters}
      resetFilters={resetSpeciesFilters}
      predicate={predicate}
      FilterForm={SpeciesFilterForm}
      List={SpeciesList}
      Modal={SpeciesModal}
      extraFilterProps={{ classificationOptions }}
    />
  );
};

export default Species;
