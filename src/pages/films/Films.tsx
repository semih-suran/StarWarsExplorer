import { useCallback } from "react";
import { useGetResource } from "@/hooks/useGetResource";
import { useUrlFilters } from "@/hooks/useUrlFilters";
import { getFilms } from "@/api/api";
import { GenericResourcePage } from "@/components";
import { FilmsList } from "./components/FilmsList/FilmsList";
import {
  FilmsFilterForm,
  type FilmsFormData,
} from "./components/FilmsFilterForm/FilmsFilterForm";
import FilmsModal from "./components/FilmsModal/FilmsModal";
import { matchesSearch } from "@/utilities/filter-utils";
import type { IFilm } from "@/types";

const filmsPredicate = (film: IFilm, filters: FilmsFormData) => {
  const titleMatch = matchesSearch(film.title, filters.name);
  const directorMatch = matchesSearch(film.director, filters.director);
  return titleMatch && directorMatch;
};

const INITIAL_FILTERS: FilmsFormData = { name: "", director: "" };

export const Films = () => {
  const { filters, setFilters, resetFilters } = useUrlFilters(INITIAL_FILTERS);

  const { data, isLoading, error } = useGetResource("films", getFilms, 1, filters.name);

  const predicate = useCallback(filmsPredicate, []);

  return (
    <GenericResourcePage
      title="Films"
      data={data?.results || []}
      isLoading={isLoading}
      error={error}
      filters={filters}
      setFilters={setFilters}
      resetFilters={resetFilters}
      predicate={predicate}
      FilterForm={FilmsFilterForm}
      List={FilmsList}
      Modal={FilmsModal}
    />
  );
};

export default Films;