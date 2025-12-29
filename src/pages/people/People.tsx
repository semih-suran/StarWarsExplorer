import { useCallback } from "react";
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
import { useResourceLogic } from "@/hooks/useResourceLogic";

const peoplePredicate = (person: IPeople, filters: PeopleFormData) => {
  const nameMatch = matchesSearch(person.name, filters.name);
  const genderMatch = matchesExact(person.gender, filters.gender);
  return nameMatch && genderMatch;
};

const INITIAL_FILTERS: PeopleFormData = { name: "", gender: "" };

export const People = () => {
  const predicate = useCallback(peoplePredicate, []);

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
    resourceName: "people",
    fetcher: getPeople,
    initialFilters: INITIAL_FILTERS,
    searchParamName: "name",
    predicate,
  });

return (
    <GenericResourcePage
      title="People"
      data={data}
      allData={allData}
      isLoading={isLoading}
      error={error}
      filters={filters}
      setFilters={setFilters}
      resetFilters={resetFilters}
      predicate={predicate}
      FilterForm={PeopleFilterForm}
      List={PeopleList}
      Modal={PeopleModal}
      pagination={pagination}
    />
  );
};

export default People;