import { useCallback } from "react";
import { useUiStore } from "@/store/useUiStore";
import { useGetResource } from "@/hooks/useGetResource";
import { getPeople } from "@/api/api";
import { GenericResourcePage } from "@/components";
import { PeopleList } from "./components/PeopleList/PeopleList";
import {
  PeopleFilterForm,
  type PeopleFormData,
} from "./components/PeopleFilterForm/PeopleFilterForm";
import { PeopleModal } from "./components/PeopleModal/PeopleModal";
import { matchesSearch, matchesExact } from "@/utilities/filter-utils";
import type { IPeople } from "@/types";

const peoplePredicate = (person: IPeople, filters: PeopleFormData) => {
  const nameMatch = matchesSearch(person.name, filters.name);
  const genderMatch = matchesExact(person.gender, filters.gender);

  return nameMatch && genderMatch;
};

export const People = () => {
  const { peopleFilters } = useUiStore();

  const { data, isLoading, error } = useGetResource(
    "people",
    getPeople,
    1,
    peopleFilters.name
  );

  const predicate = useCallback(peoplePredicate, []);

  return (
    <GenericResourcePage
      title="People"
      data={data?.results || []}
      isLoading={isLoading}
      error={error}
      filters={peopleFilters}
      setFilters={(f) => useUiStore.getState().setPeopleFilters(f)}
      resetFilters={() => useUiStore.getState().resetPeopleFilters()}
      predicate={predicate}
      FilterForm={PeopleFilterForm}
      List={PeopleList}
      Modal={PeopleModal}
    />
  );
};

export default People;
