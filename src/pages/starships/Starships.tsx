import { api } from "@/api/api";
import { queryKeys } from "@/api/queryKeys";
import { matchesSearch } from "@/utilities/filter-utils";
import type { IStarship } from "@/types";
import { GenericResourcePage } from "@/components/GenericResourcePage/GenericResourcePage";

import { StarshipsList } from "./components/StarshipsList/StarshipsList";
import { StarshipsFilterForm, type StarshipsFormData } from "./components/StarshipsFilterForm/StarshipsFilterForm";
import { StarshipsModal } from "./components/StarshipsModal/StarshipsModal";

const starshipsPredicate = (starship: IStarship, filters: StarshipsFormData) => {
  const nameMatch = matchesSearch(starship.name, filters.name);
  const classMatch = matchesSearch(starship.starship_class, filters.starship_class);
  return nameMatch && classMatch;
};

const INITIAL_FILTERS: StarshipsFormData = { name: "", starship_class: "" };

export const Starships = () => {
  return (
    <GenericResourcePage<IStarship, StarshipsFormData>
      title="Starships"
      resourceName="starships"
      fetcher={() => api.starships.list(1, "")}
      queryKey={queryKeys.starships.all}
      initialFilters={INITIAL_FILTERS}
      predicate={starshipsPredicate}
      searchParamName="name"
      FilterComponent={StarshipsFilterForm}
      ListComponent={StarshipsList}
      ModalComponent={StarshipsModal}
    />
  );
};

export default Starships;