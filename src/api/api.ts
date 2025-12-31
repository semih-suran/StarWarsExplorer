import axios from "axios";
import { type ZodType } from "zod";
import type {
  SWAPIList,
  IPeople,
  IPlanet,
  IFilm,
  ISpecie,
  IVehicle,
  IStarship,
} from "@/types";

import {
  PeopleSchema,
  PlanetSchema,
  FilmSchema,
  SpeciesSchema,
  VehicleSchema,
  StarshipSchema,
} from "./schemas";

export const API_CONFIG = {
  baseURL: "https://swapi.info/api",
  timeout: 10000,
  staleTime: 1000 * 60 * 5,
};

export const api = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
});

type Searchable = {
  name?: string;
  title?: string;
};

const fetchResource = async <T>(
  url: string,
  schema: ZodType<T>,
  _page: number,
  search: string
): Promise<SWAPIList<T>> => {
  const { data } = await api.get(url);

  const parsedData = schema.array().parse(data);

  let results = parsedData;

  if (search) {
    const lowerSearch = search.toLowerCase();
    results = results.filter((item) => {
      const candidate = item as unknown as Searchable;
      const name = candidate.name || candidate.title || "";
      return name.toLowerCase().includes(lowerSearch);
    });
  }

  return {
    count: results.length,
    next: null,
    previous: null,
    results: results, 
  };
};

export const fetchAllPages = async <T>(endpoint: string): Promise<T[]> => {
  const { data } = await api.get<T[]>(`/${endpoint}`);
  return data;
};

export const getPeople = (page: number, search: string) =>
  fetchResource<IPeople>("/people", PeopleSchema as unknown as ZodType<IPeople>, page, search);

export const getPlanets = (page: number, search: string) =>
  fetchResource<IPlanet>("/planets", PlanetSchema as unknown as ZodType<IPlanet>, page, search);

export const getFilms = (page: number, search: string) =>
  fetchResource<IFilm>("/films", FilmSchema as unknown as ZodType<IFilm>, page, search);

export const getSpecies = (page: number, search: string) =>
  fetchResource<ISpecie>("/species", SpeciesSchema as unknown as ZodType<ISpecie>, page, search);

export const getVehicles = (page: number, search: string) =>
  fetchResource<IVehicle>("/vehicles", VehicleSchema as unknown as ZodType<IVehicle>, page, search);

export const getStarships = (page: number, search: string) =>
  fetchResource<IStarship>("/starships", StarshipSchema as unknown as ZodType<IStarship>, page, search);