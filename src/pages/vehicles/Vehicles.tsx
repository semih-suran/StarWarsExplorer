import { useCallback, useMemo } from "react";
import { useUiStore } from "@/store/useUiStore";
import { useGetResource } from "@/hooks/useGetResource";
import { getVehicles } from "@/api/api";
import { matchesSearch, matchesExact } from "@/utilities/filter-utils";
import type { IVehicle } from "@/types";

import { GenericResourcePage } from "@/components";
import {
  VehiclesList,
  VehiclesModal,
  VehiclesFilterForm,
  type VehiclesFormData,
} from ".";

export const vehiclePredicate = (vehicle: IVehicle, f: VehiclesFormData) => {
  const nameMatch = matchesSearch(vehicle.name, f.name);
  const classMatch = matchesExact(vehicle.vehicle_class, f.vehicle_class);
  return nameMatch && classMatch;
};

export const Vehicles = () => {
  const { vehiclesFilters, setVehiclesFilters, resetVehiclesFilters } =
    useUiStore();

  const { data, isLoading, error } = useGetResource(
    "vehicles",
    getVehicles,
    1,
    vehiclesFilters.name
  );

  const predicate = useCallback(vehiclePredicate, []);

  const results = data?.results || [];

  const classOptions = useMemo(() => {
    if (!results.length) return [];
    const allClasses = results
      .map((v) => (v.vehicle_class ?? "").trim().toLowerCase())
      .filter(Boolean);
    return Array.from(new Set(allClasses)).sort();
  }, [results]);

  return (
    <GenericResourcePage<IVehicle, VehiclesFormData>
      title="Vehicles"
      data={results}
      isLoading={isLoading}
      error={error}
      filters={vehiclesFilters}
      setFilters={setVehiclesFilters}
      resetFilters={resetVehiclesFilters}
      predicate={predicate}
      FilterForm={VehiclesFilterForm}
      List={VehiclesList}
      Modal={VehiclesModal}
      extraFilterProps={{ classOptions }}
    />
  );
};

export default Vehicles;