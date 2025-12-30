import { useState } from "react";
import { Loading } from "@/components/Loading/Loading";
import { Alert } from "@/components/Alert/Alert";
import { PaginationControls } from "@/components/PaginationControls/PaginationControls";
import { usePagination } from "@/hooks/usePagination";
import { useFilteredList } from "@/hooks/useFilteredList";
import { ActiveFilters } from "@/components/ActiveFilters/ActiveFilters";

type PaginationOverride = {
  page: number;
  totalPages: number;
  nextPage: () => void;
  prevPage: () => void;
  goToPage: (p: number) => void;
};

type Props<T, F> = {
  title: string;
  data: T[];
  allData?: T[];
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
  pagination?: PaginationOverride;
  children?: React.ReactNode;
};

export const GenericResourcePage = <T, F extends Record<string, any>>({
  title,
  data,
  allData,
  isLoading,
  error,
  filters,
  setFilters,
  resetFilters,
  predicate,
  FilterForm,
  List,
  Modal,
  pagination,
  children,
}: Props<T, F>) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const isServerSide = !!pagination;
  const filteredList = useFilteredList(data || [], filters, predicate);

  const {
    paginated: internalPaginated,
    page: internalPage,
    totalPages: internalTotalPages,
    next: internalNext,
    prev: internalPrev,
  } = usePagination(filteredList || []);

  const displayList = isServerSide ? data : (internalPaginated as T[]);
  const displayPage = isServerSide ? pagination.page : internalPage;
  const displayTotalPages = isServerSide ? pagination.totalPages : internalTotalPages;
  const handleNext = isServerSide ? pagination.nextPage : internalNext;
  const handlePrev = isServerSide ? pagination.prevPage : internalPrev;

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
      <h1 className="text-3xl font-bold mb-6 text-yellow-400">{title}</h1>

      {children && <div className="mb-8">{children}</div>}

      <div className="bg-base-200 p-4 rounded-lg shadow-md mb-6">
        <FilterForm
          onSubmit={(data) => {
            console.log("GenericResourcePage calling setFilters with:", data);
            setFilters(data);
          }}
          onReset={resetFilters}
          defaultValues={filters}
          resourceList={allData || data}
        />
      </div>

      <ActiveFilters filters={filters} onReset={resetFilters} />

      {displayList.length === 0 ? (
        <Alert message="No results found matching your criteria." type="info" />
      ) : (
        <>
          <div className="mb-4 text-sm opacity-70">
            Showing {displayList.length} results
          </div>

          <List data={displayList} onView={handleOpenModal} />

          <PaginationControls
            page={displayPage}
            totalPages={displayTotalPages}
            onNext={handleNext}
            onPrev={handlePrev}
          />
        </>
      )}

      <Modal id={selectedId} onClose={handleCloseModal} />
    </div>
  );
};