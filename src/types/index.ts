export type { IPeople, IPlanet, IStarship, IVehicle, ISpecie } from "swapi-ts";
export type { Film as IFilm } from "./film";

export type SWAPIList<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};