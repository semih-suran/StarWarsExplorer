import { api } from "@/api/api";
import { queryKeys } from "@/api/queryKeys";
import { GenericResourcePage } from "@/components/GenericResourcePage/GenericResourcePage";
import { PlanetsList } from "./components/PlanetsList/PlanetsList";
import { PlanetsFilterForm } from "./components/PlanetsFilterForm/PlanetsFilterForm";
import { PlanetsModal } from "./components/PlanetsModal/PlanetsModal";
import { planetsPredicate, type PlanetsFormData } from "./Planets.helpers";
import type { IPlanet } from "@/types";

const INITIAL_FILTERS: PlanetsFormData = { name: "", terrain: "" };

export const Planets = () => {
  return (
    <GenericResourcePage<IPlanet, PlanetsFormData>
      title="Planets"
      resourceName="planets"
      fetcher={() => api.planets.list(1, "")}
      queryKey={queryKeys.planets.all}
      initialFilters={INITIAL_FILTERS}
      predicate={planetsPredicate}
      searchParamName="name"
      FilterComponent={PlanetsFilterForm}
      ListComponent={PlanetsList}
      ModalComponent={PlanetsModal}
    />
  );
};

export default Planets;