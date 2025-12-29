import { useCallback } from "react";
import { getStarships } from "@/api/api";
import { GenericResourcePage } from "@/components";
import { StarshipsList } from "./components/StarshipsList/StarshipsList";
import {
  StarshipsFilterForm,
  type StarshipsFormData,
} from "./components/StarshipsFilterForm/StarshipsFilterForm";
import StarshipsModal from "./components/StarshipsModal/StarshipsModal";
import { matchesSearch } from "@/utilities/filter-utils";
import type { IStarship } from "@/types";
import { useResourceLogic } from "@/hooks/useResourceLogic";

const starshipsPredicate = (starship: IStarship, filters: StarshipsFormData) => {
  const nameMatch = matchesSearch(starship.name, filters.name);
  const classMatch = matchesSearch(starship.starship_class, filters.starship_class);
  return nameMatch && classMatch;
};

const INITIAL_FILTERS: StarshipsFormData = { name: "", starship_class: "" };

export const Starships = () => {
  const predicate = useCallback(starshipsPredicate, []);

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
    resourceName: "starships",
    fetcher: getStarships,
    initialFilters: INITIAL_FILTERS,
    searchParamName: "name",
    predicate,
  });

  return (
    <GenericResourcePage
      title="Starships"
      data={data}
      allData={allData}
      isLoading={isLoading}
      error={error}
      filters={filters}
      setFilters={setFilters}
      resetFilters={resetFilters}
      predicate={predicate}
      FilterForm={StarshipsFilterForm}
      List={StarshipsList}
      Modal={StarshipsModal}
      pagination={pagination}
    />
  );
};

export default Starships;