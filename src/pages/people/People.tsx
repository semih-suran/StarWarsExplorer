import { useState } from "react";
import { getPeople } from "@/api/api";
import { ResourceLayout } from "@/components/ResourceLayout/ResourceLayout";
import { ActiveFilters } from "@/components/ActiveFilters/ActiveFilters";
import { PaginationControls } from "@/components/PaginationControls/PaginationControls";
import { PeopleList } from "./components/PeopleList/PeopleList";
import { PeopleFilterForm, type PeopleFormData } from "./components/PeopleFilterForm/PeopleFilterForm";
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
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const fetchAllPeople = async () => getPeople(1, "");

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
    fetcher: fetchAllPeople,
    initialFilters: INITIAL_FILTERS,
    searchParamName: "name",
    predicate: peoplePredicate,
  });

  return (
    <ResourceLayout title="People" isLoading={isLoading} error={error}>
      <div className="bg-base-200 p-4 rounded-lg shadow-md mb-6">
        <PeopleFilterForm
          onSubmit={setFilters}
          onReset={resetFilters}
          defaultValues={filters as PeopleFormData}
          resourceList={allData}
        />
      </div>

      <ActiveFilters filters={filters} onReset={resetFilters} />

      {data.length === 0 ? (
        <div className="alert alert-info">No people found matching your criteria.</div>
      ) : (
        <>
          <div className="mb-4 text-sm opacity-70">Showing {data.length} results</div>
          <PeopleList data={data} onView={setSelectedId} />
          
          <PaginationControls
            page={pagination.page}
            totalPages={pagination.totalPages}
            onNext={pagination.nextPage}
            onPrev={pagination.prevPage}
          />
        </>
      )}

      <PeopleModal id={selectedId} onClose={() => setSelectedId(null)} />
    </ResourceLayout>
  );
};

export default People;