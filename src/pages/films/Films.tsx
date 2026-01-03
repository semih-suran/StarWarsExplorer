import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { api, API_CONFIG } from "@/api/api";
import { ResourceLayout } from "@/components/ResourceLayout/ResourceLayout";
import { ActiveFilters } from "@/components/ActiveFilters/ActiveFilters";
import { PaginationControls } from "@/components/PaginationControls/PaginationControls";
import { FilmsList } from "./components/FilmsList/FilmsList";
import { FilmsFilterForm, type FilmsFormData } from "./components/FilmsFilterForm/FilmsFilterForm";
import { FilmsModal } from "./components/FilmsModal/FilmsModal";
import { matchesSearch } from "@/utilities/filter-utils";
import type { IFilm } from "@/types";
import { useResourceLogic } from "@/hooks/useResourceLogic";
import HeroCarousel from "./components/HeroCarousel/HeroCarousel";
import { POSTERS_BY_EPISODE } from "./components/FilmsPosterMap";

const filmsPredicate = (film: IFilm, filters: FilmsFormData) => {
  const titleMatch = matchesSearch(film.title, filters.name);
  const directorMatch = matchesSearch(film.director, filters.director);
  return titleMatch && directorMatch;
};

const INITIAL_FILTERS: FilmsFormData = { name: "", director: "" };

export const Films = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const fetchAllFilms = async () => api.films.list(1, "");

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
    resourceName: "films",
    fetcher: fetchAllFilms,
    initialFilters: INITIAL_FILTERS,
    searchParamName: "name",
    predicate: filmsPredicate,
  });

  const { data: carouselData } = useQuery({
    queryKey: ["films", 1, ""],
    queryFn: () => api.films.list(1, ""),
    staleTime: API_CONFIG.staleTime,
  });

  const carouselItems = useMemo(() => {
    const source = carouselData?.results || [];
    const sorted = [...source].sort((a, b) => a.episode_id - b.episode_id);
    return sorted.map((film) => ({
      img: POSTERS_BY_EPISODE[film.episode_id] ?? "",
      title: film.title,
      subtitle: `Episode ${film.episode_id} - Directed by ${film.director}`,
    }));
  }, [carouselData]);

  return (
    <ResourceLayout title="Films" isLoading={isLoading} error={error}>
      {carouselItems.length > 0 && (
        <div className="mb-8">
          <HeroCarousel items={carouselItems} />
        </div>
      )}

      <div className="bg-base-200 p-4 rounded-lg shadow-md mb-6">
        <FilmsFilterForm
          onSubmit={setFilters}
          onReset={resetFilters}
          defaultValues={filters as FilmsFormData}
          resourceList={allData}
        />
      </div>

      <ActiveFilters filters={filters} onReset={resetFilters} />

      {data.length === 0 ? (
        <div className="alert alert-warning">No films found matching your criteria.</div>
      ) : (
        <>
          <div className="mb-4 text-sm opacity-70">Showing {data.length} results</div>
          <FilmsList data={data} onView={setSelectedId} />
          
          <PaginationControls
            page={pagination.page}
            totalPages={pagination.totalPages}
            onNext={pagination.nextPage}
            onPrev={pagination.prevPage}
          />
        </>
      )}

      <FilmsModal id={selectedId} onClose={() => setSelectedId(null)} />
    </ResourceLayout>
  );
};

export default Films;