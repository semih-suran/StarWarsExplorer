import axios from "axios";
import type {
  SWAPIList,
  IPeople,
  IPlanet,
  IFilm,
  ISpecie,
  IVehicle,
  IStarship,
} from "@/types";

export const API_CONFIG = {
  baseURL: "https://swapi.info/api",
  timeout: 10000,
  staleTime: 1000 * 60 * 5,
};

export const api = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
});

const fetchResource = async <T>(
  url: string,
  _page: number,
  search: string
): Promise<SWAPIList<T>> => {
  const { data } = await api.get<T[]>(url);
  
  let results = data;

  if (search) {
    const lowerSearch = search.toLowerCase();
    results = results.filter((item: any) =>
      (item.name || item.title || "").toLowerCase().includes(lowerSearch)
    );
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
  fetchResource<IPeople>("/people", page, search);
export const getPlanets = (page: number, search: string) =>
  fetchResource<IPlanet>("/planets", page, search);
export const getFilms = (page: number, search: string) =>
  fetchResource<IFilm>("/films", page, search);
export const getSpecies = (page: number, search: string) =>
  fetchResource<ISpecie>("/species", page, search);
export const getVehicles = (page: number, search: string) =>
  fetchResource<IVehicle>("/vehicles", page, search);
export const getStarships = (page: number, search: string) =>
  fetchResource<IStarship>("/starships", page, search);