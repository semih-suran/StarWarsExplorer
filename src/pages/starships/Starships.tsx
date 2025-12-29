import { useCallback } from "react";
import { useGetResource } from "@/hooks/useGetResource";
import { useUrlFilters } from "@/hooks/useUrlFilters";
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

const starshipsPredicate = (starship: IStarship, filters: StarshipsFormData) => {
  const nameMatch = matchesSearch(starship.name, filters.name);
  const classMatch = matchesSearch(starship.starship_class, filters.starship_class); 
  return nameMatch && classMatch;
};

const INITIAL_FILTERS: StarshipsFormData = { name: "", starship_class: "" };

export const Starships = () => {
  const { filters, setFilters, resetFilters } = useUrlFilters(INITIAL_FILTERS);

  const { data, isLoading, error } = useGetResource("starships", getStarships, 1, filters.name);

  const predicate = useCallback(starshipsPredicate, []);

  return (
    <GenericResourcePage
      title="Starships"
      data={data?.results || []}
      isLoading={isLoading}
      error={error}
      filters={filters}
      setFilters={setFilters}
      resetFilters={resetFilters}
      predicate={predicate}
      FilterForm={StarshipsFilterForm}
      List={StarshipsList}
      Modal={StarshipsModal}
    />
  );
};

export default Starships;