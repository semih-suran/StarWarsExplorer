import { describe, it, expect } from "vitest";
import { planetsPredicate, type PlanetsFormData } from "./Planets.helpers";
import type { IPlanet } from "@/types";

const createPlanet = (name: string, terrain: string): IPlanet => ({
  name,
  terrain,
  rotation_period: "24",
  orbital_period: "365",
  diameter: "10000",
  climate: "temperate",
  gravity: "1 standard",
  surface_water: "10",
  population: "100000",
  residents: [],
  films: [],
  created: new Date(),
  edited: new Date(),
  url: "",
});

describe("planetsPredicate", () => {
  const forestPlanet = createPlanet("Endor", "forests, mountains");

  it("should match when name filter is empty", () => {
    const filter: PlanetsFormData = { name: "", terrain: "forests" };

    expect(planetsPredicate(forestPlanet, filter)).toBe(true);
  });

  it("should match by name", () => {
    const filter: PlanetsFormData = { name: "Endor", terrain: "" };
    expect(planetsPredicate(forestPlanet, filter)).toBe(true);
  });

  it("should not match by incorrect name", () => {
    const filter: PlanetsFormData = { name: "Tatooine", terrain: "" };
    expect(planetsPredicate(forestPlanet, filter)).toBe(false);
  });
});