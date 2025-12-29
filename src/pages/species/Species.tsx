import { useCallback } from "react";
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
import { useResourceLogic } from "@/hooks/useResourceLogic";

const speciesPredicate = (specie: ISpecie, filters: SpeciesFormData) => {
  const nameMatch = matchesSearch(specie.name, filters.name);
  const classMatch = matchesSearch(specie.classification, filters.classification);
  return nameMatch && classMatch;
};

const INITIAL_FILTERS: SpeciesFormData = { name: "", classification: "" };

export const Species = () => {
  const predicate = useCallback(speciesPredicate, []);

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
    resourceName: "species",
    fetcher: getSpecies,
    initialFilters: INITIAL_FILTERS,
    searchParamName: "name",
    predicate,
  });

  return (
    <GenericResourcePage
      title="Species"
      data={data}
      allData={allData}
      isLoading={isLoading}
      error={error}
      filters={filters}
      setFilters={setFilters}
      resetFilters={resetFilters}
      predicate={predicate}
      FilterForm={SpeciesFilterForm}
      List={SpeciesList}
      Modal={SpeciesModal}
      pagination={pagination}
    />
  );
};

export default Species;