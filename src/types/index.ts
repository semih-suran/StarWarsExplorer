export type { IPeople, IPlanet, IStarship, IVehicle, ISpecie } from "swapi-ts";

export type SWAPIList<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};