import { useCallback, useMemo, useState } from "react";
import { useGetFilms } from "@/api/films/use-get-films";
import { Alert } from "@/components/Alert/Alert";
import { Loading } from "@/components/Loading/Loading";
import { POSTERS_BY_EPISODE, FilmsFilterForm, type FilmsFormData, FilmsList, FilmsModal, HeroCarousel } from ".";

import { useFilteredList } from "@/hooks/useFilteredList";
import { usePagination } from "@/hooks/usePagination";
import { PaginationControls } from "@/components/PaginationControls/PaginationControls";
import { ActiveFilters } from "@/components/ActiveFilters/ActiveFilters";

import { useUiStore } from "@/store/useUiStore";

export const Films = () => {
  const filters = useUiStore((s) => s.filmFilters);
  const setFilmFilters = useUiStore((s) => s.setFilmFilters);
  const resetFilmFilters = useUiStore((s) => s.resetFilmFilters);

  const selectedId = useUiStore((s) => s.selectedFilmId);
  const setSelectedId = useUiStore((s) => s.setSelectedFilmId);

  const [page, setPage] = useState(1);

  const { data: allFilms, isLoading, error } = useGetFilms();

  const carouselItems = Object.keys(POSTERS_BY_EPISODE)
    .map(Number)
    .sort((a, b) => a - b)
    .map((n) => ({
      img: POSTERS_BY_EPISODE[n],
      title: "",
      subtitle: "",
    }));

  const predicate = useCallback((film: any, f: FilmsFormData) => {
    const nameQ = (f.name ?? "").trim().toLowerCase();
    const directorQ = (f.director ?? "").trim().toLowerCase();

    const matchesName =
      !nameQ || (film.title ?? "").toLowerCase().includes(nameQ);
    const matchesDirector =
      !directorQ || (film.director ?? "").toLowerCase().includes(directorQ);

    return matchesName && matchesDirector;
  }, []);

  const filtered = useFilteredList(allFilms, filters, predicate);

  const directorOptions = useMemo(() => {
    if (!allFilms) return [];
    const directors = Array.from(
      new Set(allFilms.map((f) => (f.director ?? "").trim()).filter(Boolean))
    );
    return directors.sort().map((d) => ({ id: d, label: d }));
  }, [allFilms]);

  const { page: innerPage, totalPages, paginated } = usePagination(filtered, page, 6);

  const wrappedPrev = () => setPage((p) => Math.max(1, p - 1));
  const wrappedNext = () => setPage((p) => Math.min(totalPages, p + 1));

  const activeFiltersForDisplay = useMemo(() => {
    return {
      name: filters.name ?? "",
      director: filters.director ?? "",
    };
  }, [filters]);

  if (isLoading) return <Loading />;
  if (error) return <Alert message={(error as Error).message} />;

  const handleFilter = (form: FilmsFormData) => {
    setFilmFilters({
      name: form.name?.trim() ?? "",
      director: form.director?.trim() ?? "",
    });
    setPage(1);
  };

  const handleReset = () => {
    resetFilmFilters();
    setPage(1);
  };

  return (
    <>
      <HeroCarousel items={carouselItems} intervalMs={3000} fadeMs={700} />
      <FilmsFilterForm
        onSubmit={handleFilter}
        onReset={handleReset}
        defaultValues={filters}
        directorOptions={directorOptions}
      />

      <ActiveFilters
        filters={{
          name: activeFiltersForDisplay.name,
          director: activeFiltersForDisplay.director,
        }}
        onReset={handleReset}
      />

      <FilmsList data={paginated} onView={(id) => setSelectedId(id)} />

      <PaginationControls
        page={page}
        totalPages={totalPages}
        onPrev={wrappedPrev}
        onNext={wrappedNext}
      />

      {selectedId && <FilmsModal id={selectedId} onClose={() => setSelectedId(null)} />}
    </>
  );
};

export default Films;
