import { useState } from "react";
import { Loading } from "@/components/Loading/Loading";
import { Alert } from "@/components/Alert/Alert";
import { PaginationControls } from "@/components/PaginationControls/PaginationControls";
import { usePagination } from "@/hooks/usePagination";
import { useFilteredList } from "@/hooks/useFilteredList";
import { ActiveFilters } from "@/components/ActiveFilters/ActiveFilters";

type Props<T, F> = {
  title: string;
  data: T[];
  isLoading: boolean;
  error: Error | null;
  filters: F;
  setFilters: (filters: Partial<F>) => void;
  resetFilters: () => void;
  predicate: (item: T, filters: F) => boolean;
  FilterForm: React.ComponentType<{
    onSubmit: (data: F) => void;
    onReset: () => void;
    defaultValues?: F;
    resourceList?: T[];
  }>;
  List: React.ComponentType<{
    data: T[];
    onView: (id: string) => void;
  }>;
  Modal: React.ComponentType<{
    id: string | null; 
    onClose: () => void;
  }>;
};

export const GenericResourcePage = <T, F extends Record<string, any>>({
  title,
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
}: Props<T, F>) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filteredList = useFilteredList(data || [], filters, predicate);

  const {
    paginated: paginatedList,
    page,
    totalPages,
    next: nextPage,
    prev: prevPage,
  } = usePagination(filteredList || []);

  const handleOpenModal = (id: string) => {
    setSelectedId(id);
  };

  const handleCloseModal = () => {
    setSelectedId(null);
  };

  if (isLoading) return <Loading />;
  if (error) return <Alert message={error.message} type="error" />;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-primary">{title}</h1>

      <div className="bg-base-200 p-4 rounded-lg shadow-md mb-6">
        <FilterForm
          onSubmit={setFilters}
          onReset={resetFilters}
          defaultValues={filters}
          resourceList={data}
        />
      </div>

      <ActiveFilters filters={filters} onReset={resetFilters} />

      {filteredList.length === 0 ? (
        <Alert message="No results found matching your criteria." type="info" />
      ) : (
        <>
          <div className="mb-4 text-sm opacity-70">
            Showing {filteredList.length} results
          </div>

          <List 
            data={paginatedList as T[]} 
            onView={handleOpenModal} 
          />

          <PaginationControls
            page={page}
            totalPages={totalPages}
            onNext={nextPage}
            onPrev={prevPage}
          />
        </>
      )}

      <Modal
        id={selectedId}
        onClose={handleCloseModal}
      />
    </div>
  );
};