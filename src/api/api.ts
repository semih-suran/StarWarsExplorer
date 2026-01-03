import axios from "axios";
import { type ZodSchema } from "zod";
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
  staleTime: 1000 * 60 * 10,
};

const axiosInstance = axios.create({
  baseURL: API_CONFIG.baseURL,
});

const fetchResource = async <T>(
  endpoint: string,
  schema: ZodSchema<T>,
  page: number = 1,
  search?: string
): Promise<SWAPIList<T>> => {
  const params = new URLSearchParams();
  if (page > 1) params.append("page", page.toString());
  if (search) params.append("search", search);

  const { data } = await axiosInstance.get<SWAPIList<T> | T[]>(endpoint, { params });

  const rawResults = Array.isArray(data) ? data : data.results;
  const count = Array.isArray(data) ? data.length : data.count;

  const safeResults = rawResults.map((item) => schema.parse(item));

  return { 
    count, 
    next: Array.isArray(data) ? null : data.next, 
    previous: Array.isArray(data) ? null : data.previous, 
    results: safeResults 
  };
};

export const api = {
  get: axiosInstance.get,
  
  people: {
    list: (page = 1, search = "") =>
      fetchResource<IPeople>("/people", PeopleSchema, page, search),
  },
  planets: {
    list: (page = 1, search = "") =>
      fetchResource<IPlanet>("/planets", PlanetSchema, page, search),
  },
  films: {
    list: (page = 1, search = "") =>
      fetchResource<IFilm>("/films", FilmSchema, page, search),
  },
  species: {
    list: (page = 1, search = "") =>
      fetchResource<ISpecie>("/species", SpeciesSchema, page, search),
  },
  vehicles: {
    list: (page = 1, search = "") =>
      fetchResource<IVehicle>("/vehicles", VehicleSchema, page, search),
  },
  starships: {
    list: (page = 1, search = "") =>
      fetchResource<IStarship>("/starships", StarshipSchema, page, search),
  },
};