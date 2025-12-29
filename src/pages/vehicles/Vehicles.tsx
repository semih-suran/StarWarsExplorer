import { useCallback } from "react";
import { getVehicles } from "@/api/api";
import { GenericResourcePage } from "@/components";
import { VehiclesList } from "./components/VehiclesList/VehiclesList";
import {
  VehiclesFilterForm,
  type VehiclesFormData,
} from "./components/VehiclesFilterForm/VehiclesFilterForm";
import VehiclesModal from "./components/VehiclesModal/VehiclesModal";
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
  const predicate = useCallback(vehiclesPredicate, []);

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
    predicate,
  });

  return (
    <GenericResourcePage
      title="Vehicles"
      data={data}
      allData={allData}
      isLoading={isLoading}
      error={error}
      filters={filters}
      setFilters={setFilters}
      resetFilters={resetFilters}
      predicate={predicate}
      FilterForm={VehiclesFilterForm}
      List={VehiclesList}
      Modal={VehiclesModal}
      pagination={pagination}
    />
  );
};

export default Vehicles;