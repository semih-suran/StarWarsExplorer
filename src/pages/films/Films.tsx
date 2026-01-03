import { api } from "@/api/api";
import { queryKeys } from "@/api/queryKeys";
import { matchesSearch } from "@/utilities/filter-utils";
import type { IFilm } from "@/types";
import { GenericResourcePage } from "@/components/GenericResourcePage/GenericResourcePage";

import { FilmsList } from "./components/FilmsList/FilmsList";
import { FilmsFilterForm, type FilmsFormData } from "./components/FilmsFilterForm/FilmsFilterForm";
import { FilmsModal } from "./components/FilmsModal/FilmsModal";

const filmsPredicate = (film: IFilm, filters: FilmsFormData) => {
  const titleMatch = matchesSearch(film.title, filters.name);
  const directorMatch = matchesSearch(film.director, filters.director);
  return titleMatch && directorMatch;
};

const INITIAL_FILTERS: FilmsFormData = { name: "", director: "" };

export const Films = () => {
  return (
    <GenericResourcePage<IFilm, FilmsFormData>
      title="Films"
      resourceName="films"
      fetcher={() => api.films.list(1, "")}
      queryKey={queryKeys.films.all}
      initialFilters={INITIAL_FILTERS}
      predicate={filmsPredicate}
      searchParamName="name"
      FilterComponent={FilmsFilterForm}
      ListComponent={FilmsList}
      ModalComponent={FilmsModal}
    />
  );
};

export default Films;