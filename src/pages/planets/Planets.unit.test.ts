import { describe, it, expect } from "vitest";
import { planetsPredicate } from "./Planets";
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
    const filter: any = { name: "", terrain: "forests" }; 

    expect(planetsPredicate(forestPlanet, filter)).toBe(true);
  });
  
  it("should match by name", () => {
    const filter: any = { name: "Endor" };
    expect(planetsPredicate(forestPlanet, filter)).toBe(true);
  });

  it("should not match by incorrect name", () => {
    const filter: any = { name: "Tatooine" };
    expect(planetsPredicate(forestPlanet, filter)).toBe(false);
  });
});