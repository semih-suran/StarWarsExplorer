import { useCallback } from "react";
import { useGetResource } from "@/hooks/useGetResource";
import { useUrlFilters } from "@/hooks/useUrlFilters";
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

const vehiclesPredicate = (vehicle: IVehicle, filters: VehiclesFormData) => {
  const nameMatch = matchesSearch(vehicle.name, filters.name);
  const classMatch = matchesSearch(vehicle.vehicle_class, filters.vehicle_class);
  return nameMatch && classMatch;
};

const INITIAL_FILTERS: VehiclesFormData = { name: "", vehicle_class: "" };

export const Vehicles = () => {
  const { filters, setFilters, resetFilters } = useUrlFilters(INITIAL_FILTERS);

  const { data, isLoading, error } = useGetResource("vehicles", getVehicles, 1, filters.name);

  const predicate = useCallback(vehiclesPredicate, []);

  return (
    <GenericResourcePage
      title="Vehicles"
      data={data?.results || []}
      isLoading={isLoading}
      error={error}
      filters={filters}
      setFilters={setFilters}
      resetFilters={resetFilters}
      predicate={predicate}
      FilterForm={VehiclesFilterForm}
      List={VehiclesList}
      Modal={VehiclesModal}
    />
  );
};

export default Vehicles;