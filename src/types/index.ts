import { z } from "zod";
import {
  PeopleSchema,
  PlanetSchema,
  FilmSchema,
  SpeciesSchema,
  StarshipSchema,
  VehicleSchema,
} from "@/api/schemas";

export type SWAPIList<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

export type IPeople = z.infer<typeof PeopleSchema>;
export type IPlanet = z.infer<typeof PlanetSchema>;
export type IFilm = z.infer<typeof FilmSchema>;
export type ISpecie = z.infer<typeof SpeciesSchema>;
export type IStarship = z.infer<typeof StarshipSchema>;
export type IVehicle = z.infer<typeof VehicleSchema>;

export type ResourceType =
  | "person"
  | "planet"
  | "film"
  | "specie"
  | "starship"
  | "vehicle";