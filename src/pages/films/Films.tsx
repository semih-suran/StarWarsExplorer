import { useCallback } from "react";
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
import { useResourceLogic } from "@/hooks/useResourceLogic";

const filmsPredicate = (film: IFilm, filters: FilmsFormData) => {
  const titleMatch = matchesSearch(film.title, filters.name);
  const directorMatch = matchesSearch(film.director, filters.director);
  return titleMatch && directorMatch;
};

const INITIAL_FILTERS: FilmsFormData = { name: "", director: "" };

export const Films = () => {
  const predicate = useCallback(filmsPredicate, []);

  const { 
    data, 
    allData,
    isLoading, 
    error, 
    filters, 
    setFilters, 
    resetFilters,
    pagination 
  } = useResourceLogic({
    resourceName: "films",
    fetcher: getFilms,
    initialFilters: INITIAL_FILTERS,
    searchParamName: "name",
    predicate,
  });

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
    />
  );
};

export default Films;