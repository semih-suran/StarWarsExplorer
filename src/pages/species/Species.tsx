import { api } from "@/api/api";
import { queryKeys } from "@/api/queryKeys";
import { matchesSearch } from "@/utilities/filter-utils";
import type { ISpecie } from "@/types";
import { GenericResourcePage } from "@/components/GenericResourcePage/GenericResourcePage";

import { SpeciesList } from "./components/SpeciesList/SpeciesList";
import { SpeciesFilterForm, type SpeciesFormData } from "./components/SpeciesFilterForm/SpeciesFilterForm";
import { SpeciesModal } from "./components/SpeciesModal/SpeciesModal";

const speciesPredicate = (specie: ISpecie, filters: SpeciesFormData) => {
  const nameMatch = matchesSearch(specie.name, filters.name);
  const classMatch = matchesSearch(specie.classification, filters.classification);
  return nameMatch && classMatch;
};

const INITIAL_FILTERS: SpeciesFormData = { name: "", classification: "" };

export const Species = () => {
  return (
    <GenericResourcePage<ISpecie, SpeciesFormData>
      title="Species"
      resourceName="species"
      fetcher={() => api.species.list(1, "")}
      queryKey={queryKeys.species.all}
      initialFilters={INITIAL_FILTERS}
      predicate={speciesPredicate}
      searchParamName="name"
      FilterComponent={SpeciesFilterForm}
      ListComponent={SpeciesList}
      ModalComponent={SpeciesModal}
    />
  );
};

export default Species;