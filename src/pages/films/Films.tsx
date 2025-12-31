import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { getFilms, API_CONFIG } from "@/api/api";
import { GenericResourcePage } from "@/components";
import { FilmsList } from "./components/FilmsList/FilmsList";
import {
  FilmsFilterForm,
  type FilmsFormData,
} from "./components/FilmsFilterForm/FilmsFilterForm";
import FilmsModal from "./components/FilmsModal/FilmsModal";
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
  const predicate = filmsPredicate;
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
    fetcher: getFilms,
    initialFilters: INITIAL_FILTERS,
    searchParamName: "name",
    predicate,
  });

  const { data: carouselData } = useQuery({
    queryKey: ["films", 1, ""],
    queryFn: () => getFilms(1, ""),
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
    <GenericResourcePage
      title="Films"
      data={data}
      allData={allData}
      isLoading={isLoading}
      error={error}
      filters={filters}
      setFilters={setFilters}
      resetFilters={resetFilters}
      predicate={predicate}
      FilterForm={FilmsFilterForm}
      List={FilmsList}
      Modal={FilmsModal}
      pagination={pagination}
    >
      {carouselItems.length > 0 && <HeroCarousel items={carouselItems} />}
    </GenericResourcePage>
  );
};

export default Films;