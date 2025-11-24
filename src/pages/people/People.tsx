import { useCallback, useState } from "react";
import { useGetPeople } from "@/api/people/use-get-people";
import { Alert } from "@/components/Alert/Alert";
import { Loading } from "@/components/Loading/Loading";
import { PeopleFilterForm, type PeopleFormData, PeopleList, PeopleModal } from ".";
import { useUiStore } from "@/store/useUiStore";

import { useFilteredList } from "@/hooks/useFilteredList";
import { usePagination } from "@/hooks/usePagination";
import { PaginationControls } from "@/components/PaginationControls/PaginationControls";
import { ActiveFilters } from "@/components/ActiveFilters/ActiveFilters";

import type { IPeople } from "@/types";

export const People = () => {
  const filters = useUiStore((s) => s.peopleFilters);
  const setFilters = useUiStore((s) => s.setPeopleFilters);
  const resetFilters = useUiStore((s) => s.resetPeopleFilters);
  
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { data: allPeople, isLoading, error } = useGetPeople();

  const predicate = useCallback((person: IPeople, f: PeopleFormData) => {
    const nameQ = (f.name ?? "").trim().toLowerCase();
    const genderQ = (f.gender ?? "").trim().toLowerCase();

    const matchesName = !nameQ || person.name.toLowerCase().includes(nameQ);
    const matchesGender = !genderQ || person.gender.toLowerCase() === genderQ;
    return matchesName && matchesGender;
  }, []);

  const filtered = useFilteredList(allPeople ?? [], filters, predicate);

  const { page, totalPages, paginated, prev, next, setPage } = usePagination(
    filtered,
    1,
    10
  );

  if (isLoading) return <Loading />;
  if (error) return <Alert message={(error as Error).message} />;

  const handleFilter = (form: PeopleFormData) => {
    setFilters({
      name: form.name?.trim() ?? "",
      gender: form.gender?.trim() ?? "",
    });
    setPage(1);
  };

  const handleReset = () => {
    resetFilters();
    setPage(1);
  };

  return (
    <>
      <PeopleFilterForm
        defaultValues={{ name: filters.name, gender: filters.gender }}
        onSubmit={handleFilter}
        onReset={handleReset}
      />

      <ActiveFilters
        filters={{ name: filters.name, gender: filters.gender }}
        onReset={handleReset}
      />

      <PeopleList data={paginated} onView={(id) => setSelectedId(id)} />

      <PaginationControls
        page={page}
        totalPages={totalPages}
        onPrev={prev}
        onNext={next}
      />

      {selectedId && (
        <PeopleModal id={selectedId} onClose={() => setSelectedId(null)} />
      )}
    </>
  );
};

export default People;