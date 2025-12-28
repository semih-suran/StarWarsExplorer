import { useCallback, useMemo } from "react";
import { useUiStore } from "@/store/useUiStore";
import { useGetResource } from "@/hooks/useGetResource";
import { getSpecies } from "@/api/api";
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

  const { data, isLoading, error } = useGetResource(
    "species",
    getSpecies,
    1,
    speciesFilters.name
  );

  const predicate = useCallback(speciesPredicate, []);

  const results = data?.results || [];

  const classificationOptions = useMemo(() => {
    if (!results.length) return [];
    const opts = Array.from(
      new Set(
        results
          .map((s) => (s.classification ?? "").trim().toLowerCase())
          .filter(Boolean)
      )
    );
    return opts.sort().map((c) => ({ id: c, label: c }));
  }, [results]);

  return (
    <GenericResourcePage<ISpecie, SpeciesFormData>
      title="Species"
      data={results}
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
