import { useCallback } from "react";
import { useGetResource } from "@/hooks/useGetResource";
import { useUrlFilters } from "@/hooks/useUrlFilters";
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

const INITIAL_FILTERS: PeopleFormData = { name: "", gender: "" };

export const People = () => {
  const { filters, setFilters, resetFilters } = useUrlFilters(INITIAL_FILTERS);

  const { data, isLoading, error } = useGetResource(
    "people",
    getPeople,
    1,
    filters.name
  );

  const predicate = useCallback(peoplePredicate, []);

  return (
    <GenericResourcePage
      title="People"
      data={data?.results || []}
      isLoading={isLoading}
      error={error}
      filters={filters}
      setFilters={setFilters}
      resetFilters={resetFilters}
      predicate={predicate}
      FilterForm={PeopleFilterForm}
      List={PeopleList}
      Modal={PeopleModal}
    />
  );
};

export default People;