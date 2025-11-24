import { useCallback, useMemo, useState } from "react";
import { useGetPlanets } from "@/api/planets/use-get-planets";
import { Alert } from "@/components/Alert/Alert";
import { Loading } from "@/components/Loading/Loading";
import { PlanetsList, PlanetsModal, PlanetsFilterForm, type PlanetsFormData } from ".";
import { useUiStore } from "@/store/useUiStore";

import { useFilteredList } from "@/hooks/useFilteredList";
import { usePagination } from "@/hooks/usePagination";
import { PaginationControls } from "@/components/PaginationControls/PaginationControls";
import { ActiveFilters } from "@/components/ActiveFilters/ActiveFilters";

import type { IPlanet } from "@/types";

export const Planets = () => {
  const filters = useUiStore((s) => s.planetsFilters);
  const setFilters = useUiStore((s) => s.setPlanetsFilters);
  const resetFilters = useUiStore((s) => s.resetPlanetsFilters);

  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { data: allPlanets, isLoading, error } = useGetPlanets();

  const predicate = useCallback((planet: IPlanet, f: PlanetsFormData) => {
    const nameQ = (f.name ?? "").trim().toLowerCase();
    const terrainQ = (f.terrain ?? "").trim().toLowerCase();

    const matchesName = !nameQ || planet.name.toLowerCase().includes(nameQ);
    const matchesTerrain =
      !terrainQ ||
      planet.terrain
        .toLowerCase()
        .split(",")
        .map((t) => t.trim())
        .some((t) => t.includes(terrainQ));

    return matchesName && matchesTerrain;
  }, []);

  const filteredPlanets = useFilteredList(allPlanets ?? [], filters, predicate);

  const terrainOptions = useMemo(() => {
    if (!allPlanets) return [];
    const allTerrains = allPlanets.flatMap((p) =>
      p.terrain.split(",").map((t) => t.trim().toLowerCase())
    );
    const unique = Array.from(new Set(allTerrains)).filter(Boolean);
    return unique.sort();
  }, [allPlanets]);

  const { page, totalPages, paginated, prev, next, setPage } = usePagination(
    filteredPlanets,
    1,
    10
  );

  if (isLoading) return <Loading />;
  if (error) return <Alert message={(error as Error).message} />;

  const handleFilter = (form: PlanetsFormData) => {
    setFilters({
      name: form.name?.trim() ?? "",
      terrain: form.terrain?.trim() ?? "",
    });
    setPage(1);
  };

  const handleReset = () => {
    resetFilters();
    setPage(1);
  };

  return (
    <>
      <PlanetsFilterForm
        onSubmit={handleFilter}
        onReset={handleReset}
        defaultValues={filters}
        terrainOptions={terrainOptions}
      />

      <ActiveFilters
        filters={{ name: filters.name, terrain: filters.terrain }}
        onReset={handleReset}
      />

      <PlanetsList data={paginated} onView={(id) => setSelectedId(id)} />

      <PaginationControls
        page={page}
        totalPages={totalPages}
        onPrev={prev}
        onNext={next}
      />

      {selectedId && (
        <PlanetsModal id={selectedId} onClose={() => setSelectedId(null)} />
      )}
    </>
  );
};

export default Planets;