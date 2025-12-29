import { useCallback } from "react";
import { useGetResource } from "@/hooks/useGetResource";
import { useUrlFilters } from "@/hooks/useUrlFilters";
import { getSpecies } from "@/api/api";
import { GenericResourcePage } from "@/components";
import { SpeciesList } from "./components/SpeciesList/SpeciesList";
import {
  SpeciesFilterForm,
  type SpeciesFormData,
} from "./components/SpeciesFilterForm/SpeciesFilterForm";
import SpeciesModal from "./components/SpeciesModal/SpeciesModal";
import { matchesSearch } from "@/utilities/filter-utils";
import type { ISpecie } from "@/types";

const speciesPredicate = (specie: ISpecie, filters: SpeciesFormData) => {
  const nameMatch = matchesSearch(specie.name, filters.name);
  const classMatch = matchesSearch(specie.classification, filters.classification);
  return nameMatch && classMatch;
};

const INITIAL_FILTERS: SpeciesFormData = { name: "", classification: "" };

export const Species = () => {
  const { filters, setFilters, resetFilters } = useUrlFilters(INITIAL_FILTERS);

  const { data, isLoading, error } = useGetResource("species", getSpecies, 1, filters.name);

  const predicate = useCallback(speciesPredicate, []);

  return (
    <GenericResourcePage
      title="Species"
      data={data?.results || []}
      isLoading={isLoading}
      error={error}
      filters={filters}
      setFilters={setFilters}
      resetFilters={resetFilters}
      predicate={predicate}
      FilterForm={SpeciesFilterForm}
      List={SpeciesList}
      Modal={SpeciesModal}
    />
  );
};

export default Species;