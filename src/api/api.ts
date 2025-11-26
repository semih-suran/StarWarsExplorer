import axios from "axios";
import type { SWAPIList } from "@/types";

export const API_CONFIG = {
  baseURL: "https://swapi.dev/api",
  timeout: 10000,
  staleTime: 1000 * 60, // 1 minute
};

export const api = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
});

export const fetchAllPages = async <T>(endpoint: string): Promise<T[]> => {
  let allResults: T[] = [];
  let page = 1;
  let hasNextPage = true;

  while (hasNextPage) {
    const response = await api.get<SWAPIList<T>>(`${endpoint}/?page=${page}`);
    allResults = allResults.concat(response.data.results);
    hasNextPage = Boolean(response.data.next);
    page++;
  }

  return allResults;
};
