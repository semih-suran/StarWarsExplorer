import { useState } from "react";
import { getVehicles } from "@/api/api";
import { ResourceLayout } from "@/components/ResourceLayout/ResourceLayout";
import { ActiveFilters } from "@/components/ActiveFilters/ActiveFilters";
import { PaginationControls } from "@/components/PaginationControls/PaginationControls";
import { VehiclesList } from "./components/VehiclesList/VehiclesList";
import { VehiclesFilterForm, type VehiclesFormData } from "./components/VehiclesFilterForm/VehiclesFilterForm";
import { VehiclesModal } from "./components/VehiclesModal/VehiclesModal";
import { matchesSearch } from "@/utilities/filter-utils";
import type { IVehicle } from "@/types";
import { useResourceLogic } from "@/hooks/useResourceLogic";

const vehiclesPredicate = (vehicle: IVehicle, filters: VehiclesFormData) => {
  const nameMatch = matchesSearch(vehicle.name, filters.name);
  const classMatch = matchesSearch(vehicle.vehicle_class, filters.vehicle_class);
  return nameMatch && classMatch;
};

const INITIAL_FILTERS: VehiclesFormData = { name: "", vehicle_class: "" };

export const Vehicles = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);

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
    resourceName: "vehicles",
    fetcher: getVehicles,
    initialFilters: INITIAL_FILTERS,
    searchParamName: "name",
    predicate: vehiclesPredicate,
  });

  return (
    <ResourceLayout title="Vehicles" isLoading={isLoading} error={error}>
      <div className="bg-base-200 p-4 rounded-lg shadow-md mb-6">
        <VehiclesFilterForm
          onSubmit={setFilters}
          onReset={resetFilters}
          defaultValues={filters}
          resourceList={allData}
        />
      </div>

      <ActiveFilters filters={filters} onReset={resetFilters} />

      {data.length === 0 ? (
        <div className="alert alert-info">No vehicles found matching your criteria.</div>
      ) : (
        <>
          <div className="mb-4 text-sm opacity-70">Showing {data.length} results</div>
          <VehiclesList data={data} onView={setSelectedId} />
          
          <PaginationControls
            page={pagination.page}
            totalPages={pagination.totalPages}
            onNext={pagination.nextPage}
            onPrev={pagination.prevPage}
          />
        </>
      )}

      <VehiclesModal id={selectedId} onClose={() => setSelectedId(null)} />
    </ResourceLayout>
  );
};

export default Vehicles;