import { describe, it, expect } from "vitest";
import { planetPredicate } from "./Planets";
import type { IPlanet } from "@/types";
import type { PlanetsFormData } from ".";

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

describe("planetPredicate", () => {
  const forestPlanet = createPlanet("Endor", "forests, mountains");
  const rainForestPlanet = createPlanet("Yavin 4", "jungle, rainforests");
  const mixedPlanet = createPlanet("Naboo", "grassy hills, swamps, forests");

  it("should match exact terrain tag", () => {
    const filter: PlanetsFormData = { name: "", terrain: "forests" };

    expect(planetPredicate(forestPlanet, filter)).toBe(true);
  });

  it("should NOT match partial words in other tags (The Rainforest Bug)", () => {
    const filter: PlanetsFormData = { name: "", terrain: "forests" };

    expect(planetPredicate(rainForestPlanet, filter)).toBe(false);
  });

  it("should match regardless of case and whitespace", () => {
    const filter: PlanetsFormData = { name: "", terrain: "  FoReStS  " };

    expect(planetPredicate(forestPlanet, filter)).toBe(true);
  });

  it("should match if the tag is one of many", () => {
    const filter: PlanetsFormData = { name: "", terrain: "swamps" };

    expect(planetPredicate(mixedPlanet, filter)).toBe(true);
  });

  it("should combine name and terrain logic correctly", () => {
    const filter: PlanetsFormData = { name: "Nab", terrain: "swamps" };

    expect(planetPredicate(mixedPlanet, filter)).toBe(true);
    expect(planetPredicate(createPlanet("Dagobah", "swamps"), filter)).toBe(
      false
    );
  });
});
