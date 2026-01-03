import { api } from "@/api/api";
import { queryKeys } from "@/api/queryKeys";
import { matchesSearch, matchesExact } from "@/utilities/filter-utils";
import type { IPeople } from "@/types";

import { PeopleList } from "./components/PeopleList/PeopleList";
import { PeopleFilterForm, type PeopleFormData } from "./components/PeopleFilterForm/PeopleFilterForm";
import { PeopleModal } from "./components/PeopleModal/PeopleModal";
import { GenericResourcePage } from "@/components/GenericResourcePage/GenericResourcePage";

const peoplePredicate = (person: IPeople, filters: PeopleFormData) => {
  const nameMatch = matchesSearch(person.name, filters.name);
  const genderMatch = matchesExact(person.gender, filters.gender);
  return nameMatch && genderMatch;
};

const INITIAL_FILTERS: PeopleFormData = { name: "", gender: "" };

export const People = () => {
  return (
    <GenericResourcePage<IPeople, PeopleFormData>
      title="People"
      resourceName="people"
      fetcher={() => api.people.list(1, "")}
      queryKey={queryKeys.people.all}
      initialFilters={INITIAL_FILTERS}
      predicate={peoplePredicate}
      searchParamName="name"
      FilterComponent={PeopleFilterForm}
      ListComponent={PeopleList}
      ModalComponent={PeopleModal}
    />
  );
};

export default People;