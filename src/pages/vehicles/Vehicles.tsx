import { api } from "@/api/api";
import { queryKeys } from "@/api/queryKeys";
import { matchesSearch } from "@/utilities/filter-utils";
import type { IVehicle } from "@/types";
import { GenericResourcePage } from "@/components/GenericResourcePage/GenericResourcePage";

import { VehiclesList } from "./components/VehiclesList/VehiclesList";
import { VehiclesFilterForm, type VehiclesFormData } from "./components/VehiclesFilterForm/VehiclesFilterForm";
import { VehiclesModal } from "./components/VehiclesModal/VehiclesModal";

const vehiclesPredicate = (vehicle: IVehicle, filters: VehiclesFormData) => {
  const nameMatch = matchesSearch(vehicle.name, filters.name);
  const classMatch = matchesSearch(vehicle.vehicle_class, filters.vehicle_class);
  return nameMatch && classMatch;
};

const INITIAL_FILTERS: VehiclesFormData = { name: "", vehicle_class: "" };

export const Vehicles = () => {
  return (
    <GenericResourcePage<IVehicle, VehiclesFormData>
      title="Vehicles"
      resourceName="vehicles"
      fetcher={() => api.vehicles.list(1, "")}
      queryKey={queryKeys.vehicles.all}
      initialFilters={INITIAL_FILTERS}
      predicate={vehiclesPredicate}
      searchParamName="name"
      FilterComponent={VehiclesFilterForm}
      ListComponent={VehiclesList}
      ModalComponent={VehiclesModal}
    />
  );
};

export default Vehicles;