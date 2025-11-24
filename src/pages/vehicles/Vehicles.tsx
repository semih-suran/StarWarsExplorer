import { useCallback, useMemo, useState } from "react";
import { useGetVehicles } from "@/api/vehicles/use-get-vehicles";
import { Alert } from "@/components/Alert/Alert";
import { Loading } from "@/components/Loading/Loading";
import { VehiclesList, VehiclesModal, VehiclesFilterForm, type VehiclesFormData } from ".";
import { useUiStore } from "@/store/useUiStore";

import { useFilteredList } from "@/hooks/useFilteredList";
import { usePagination } from "@/hooks/usePagination";
import { PaginationControls } from "@/components/PaginationControls/PaginationControls";
import { ActiveFilters } from "@/components/ActiveFilters/ActiveFilters";

import type { IVehicle } from "@/types";

export const Vehicles = () => {
  const filters = useUiStore((s) => s.vehiclesFilters);
  const setFilters = useUiStore((s) => s.setVehiclesFilters);
  const resetFilters = useUiStore((s) => s.resetVehiclesFilters);

  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { data: allVehicles, isLoading, error } = useGetVehicles();

  const predicate = useCallback(
    (vehicle: IVehicle, f: VehiclesFormData) => {
      const nameQ = (f.name ?? "").trim().toLowerCase();
      const classQ = (f.vehicle_class ?? "").trim().toLowerCase();

      const matchesName = !nameQ || (vehicle.name ?? "").toLowerCase().includes(nameQ);
      const matchesClass = !classQ || (vehicle.vehicle_class ?? "").toLowerCase().includes(classQ);

      return matchesName && matchesClass;
    },
    []
  );

  const filtered = useFilteredList(allVehicles ?? [], filters, predicate);

  const classOptions = useMemo(() => {
    if (!allVehicles) return [];
    const allClasses = allVehicles
      .map((v) => (v.vehicle_class ?? "").trim().toLowerCase())
      .filter(Boolean);
    return Array.from(new Set(allClasses)).sort();
  }, [allVehicles]);

  const { page, totalPages, paginated, next, prev, setPage } = usePagination(filtered, 1, 10);

  if (isLoading) return <Loading />;
  if (error) return <Alert message={(error as Error).message} />;

  const handleFilter = (form: VehiclesFormData) => {
    setFilters({
      name: form.name?.trim() ?? "",
      vehicle_class: form.vehicle_class?.trim() ?? "",
    });
    setPage(1);
  };

  const handleReset = () => {
    resetFilters();
    setPage(1);
  };

  return (
    <>
      <VehiclesFilterForm
        onSubmit={handleFilter}
        onReset={handleReset}
        defaultValues={filters}
        classOptions={classOptions}
      />

      <ActiveFilters
        filters={{ name: filters.name, class: filters.vehicle_class }}
        onReset={handleReset}
      />

      <VehiclesList data={paginated} onView={(id) => setSelectedId(id)} />

      <PaginationControls
        page={page}
        totalPages={totalPages}
        onPrev={prev}
        onNext={next}
      />

      {selectedId && <VehiclesModal id={selectedId} onClose={() => setSelectedId(null)} />}
    </>
  );
};

export default Vehicles;