import { useState } from "react";
import { useResourceLogic } from "@/hooks/useResourceLogic";
import { ResourceLayout } from "@/components/ResourceLayout/ResourceLayout";
import { ActiveFilters } from "@/components/ActiveFilters/ActiveFilters";
import { PaginationControls } from "@/components/PaginationControls/PaginationControls";
import type { SWAPIList } from "@/types";

interface GenericResourcePageProps<
  T extends { url: string }, 
  F extends Record<string, string | undefined | null>
> {
  title: string;
  resourceName: string;
  fetcher: () => Promise<SWAPIList<T> | T[]>;
  queryKey: readonly unknown[];
  initialFilters: F;
  predicate: (item: T, filters: F) => boolean;
  searchParamName?: string; 

  FilterComponent: React.ComponentType<{
    onSubmit: (filters: Partial<F>) => void;
    onReset: () => void;
    defaultValues: F;
    resourceList: T[];
  }>;
  ListComponent: React.ComponentType<{
    data: T[];
    onView: (id: string) => void;
  }>;
  ModalComponent: React.ComponentType<{
    id: string | null;
    onClose: () => void;
  }>;

  headerContent?: React.ReactNode;
}

export const GenericResourcePage = <
  T extends { url: string }, 
  F extends Record<string, string | undefined | null>
>({
  title,
  resourceName,
  fetcher,
  queryKey,
  initialFilters,
  predicate,
  searchParamName = "name",
  FilterComponent,
  ListComponent,
  ModalComponent,
  headerContent,
}: GenericResourcePageProps<T, F>) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const {
    data,
    allData,
    isLoading,
    error,
    filters,
    setFilters,
    resetFilters,
    pagination,
  } = useResourceLogic({
    resourceName,
    fetcher,
    queryKey,
    initialFilters,
    searchParamName,
    predicate,
  });

  return (
    <ResourceLayout title={title} isLoading={isLoading} error={error}>
      {headerContent}

      <div className="bg-base-200 p-4 rounded-lg shadow-md mb-6">
        <FilterComponent
          onSubmit={setFilters}
          onReset={resetFilters}
          defaultValues={filters as F}
          resourceList={allData}
        />
      </div>

      <ActiveFilters filters={filters} onReset={resetFilters} />

      {data.length === 0 ? (
        <div className="alert alert-warning">No results found matching your criteria.</div>
      ) : (
        <>
          <div className="mb-4 text-sm opacity-70">Showing {data.length} results</div>
          
          <ListComponent data={data} onView={setSelectedId} />

          <PaginationControls
            page={pagination.page}
            totalPages={pagination.totalPages}
            onNext={pagination.nextPage}
            onPrev={pagination.prevPage}
          />
        </>
      )}

      <ModalComponent id={selectedId} onClose={() => setSelectedId(null)} />
    </ResourceLayout>
  );
};