import { useCallback, useMemo } from "react";
import { useUiStore } from "@/store/useUiStore";
import { useGetFilms } from "@/api/films/use-get-films";
import { matchesSearch, matchesExact } from "@/utilities/filter-utils";
import type { Film } from "@/types/film";

import { GenericResourcePage } from "@/components";
import {
  POSTERS_BY_EPISODE,
  FilmsFilterForm,
  type FilmsFormData,
  FilmsList,
  FilmsModal,
  HeroCarousel,
} from ".";

export const filmPredicate = (film: Film, f: FilmsFormData) => {
  const nameMatch = matchesSearch(film.title, f.name);
  const directorMatch = matchesExact(film.director, f.director);
  return nameMatch && directorMatch;
};

export const Films = () => {
  const { filmFilters, setFilmFilters, resetFilmFilters } = useUiStore();
  const { data, isLoading, error } = useGetFilms();

  const predicate = useCallback(filmPredicate, []);

  const carouselItems = useMemo(() => {
    return Object.keys(POSTERS_BY_EPISODE)
      .map(Number)
      .sort((a, b) => a - b)
      .map((n) => ({
        img: POSTERS_BY_EPISODE[n],
        title: "",
        subtitle: "",
      }));
  }, []);

  const directorOptions = useMemo(() => {
    if (!data) return [];
    const directors = Array.from(
      new Set(data.map((f) => (f.director ?? "").trim()).filter(Boolean))
    );
    return directors.sort().map((d) => ({ id: d, label: d }));
  }, [data]);

  return (
    <>
      <HeroCarousel items={carouselItems} intervalMs={3000} fadeMs={700} />

      <GenericResourcePage<Film, FilmsFormData>
        data={data}
        isLoading={isLoading}
        error={error}
        filters={filmFilters}
        setFilters={setFilmFilters}
        resetFilters={resetFilmFilters}
        predicate={predicate}
        FilterForm={FilmsFilterForm}
        List={FilmsList}
        Modal={FilmsModal}
        extraFilterProps={{ directorOptions }}
      />
    </>
  );
};

export default Films;
