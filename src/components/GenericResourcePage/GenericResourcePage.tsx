import { useState } from "react";
import { usePagination } from "@/hooks/usePagination";
import { useFilteredList } from "@/hooks/useFilteredList";
import { Loading } from "@/components/Loading/Loading";
import { Alert } from "@/components/Alert/Alert";
import { PaginationControls } from "@/components/PaginationControls/PaginationControls";
import { ActiveFilters } from "@/components/ActiveFilters/ActiveFilters";

interface Props<T, F> {
  data: T[] | undefined;
  isLoading: boolean;
  error: Error | null;

  filters: F;
  setFilters: (f: F) => void;
  resetFilters: () => void;
  predicate: (item: T, filters: F) => boolean;

  FilterForm: React.ComponentType<{
    onSubmit: (f: F) => void;
    onReset: () => void;
    defaultValues: F;
    [key: string]: any;
  }>;
  List: React.ComponentType<{ data: T[]; onView: (id: string) => void }>;
  Modal: React.ComponentType<{ id: string; onClose: () => void }>;

  extraFilterProps?: Record<string, any>;
}

export const GenericResourcePage = <T, F>({
  data,
  isLoading,
  error,
  filters,
  setFilters,
  resetFilters,
  predicate,
  FilterForm,
  List,
  Modal,
  extraFilterProps = {},
}: Props<T, F>) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = useFilteredList(data ?? [], filters, predicate);

  const { page, totalPages, paginated, prev, next, setPage } = usePagination(
    filtered,
    1,
    10
  );

  if (isLoading) return <Loading />;
  if (error) return <Alert message={error.message} />;

  const handleFilter = (form: F) => {
    setFilters(form);
    setPage(1);
  };

  const handleReset = () => {
    resetFilters();
    setPage(1);
  };

  return (
    <>
      <FilterForm
        onSubmit={handleFilter}
        onReset={handleReset}
        defaultValues={filters}
        {...extraFilterProps}
      />

      <ActiveFilters filters={filters as any} onReset={handleReset} />

      <List data={paginated} onView={(id) => setSelectedId(id)} />

      <PaginationControls
        page={page}
        totalPages={totalPages}
        onPrev={prev}
        onNext={next}
      />

      {selectedId && (
        <Modal id={selectedId} onClose={() => setSelectedId(null)} />
      )}
    </>
  );
};
