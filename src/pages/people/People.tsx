import { useCallback } from "react";
import { useUiStore } from "@/store/useUiStore";
import { useGetPeople } from "@/api/people/use-get-people";
import { matchesSearch, matchesExact } from "@/utilities/filter-utils";
import type { IPeople } from "@/types";
import { GenericResourcePage } from "@/components";
import {
  PeopleFilterForm,
  PeopleList,
  PeopleModal,
  type PeopleFormData,
} from ".";

export const People = () => {
  const { peopleFilters, setPeopleFilters, resetPeopleFilters } = useUiStore();
  const { data, isLoading, error } = useGetPeople();

  const predicate = useCallback((person: IPeople, f: PeopleFormData) => {
    const nameMatch = matchesSearch(person.name, f.name);
    const genderMatch = matchesExact(person.gender, f.gender);
    return nameMatch && genderMatch;
  }, []);

  return (
    <GenericResourcePage<IPeople, PeopleFormData>
      data={data}
      isLoading={isLoading}
      error={error}
      filters={peopleFilters}
      setFilters={setPeopleFilters}
      resetFilters={resetPeopleFilters}
      predicate={predicate}
      FilterForm={PeopleFilterForm}
      List={PeopleList}
      Modal={PeopleModal}
    />
  );
};

export default People;
