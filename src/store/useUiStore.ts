import { create } from "zustand";
import { persist } from "zustand/middleware";

// Filter Types
type FilmsFilters = { name: string; director: string };
type PeopleFilters = { name: string; gender: string };
type PlanetsFilters = { name: string; terrain: string };
type SpeciesFilters = { name: string; classification: string };
type StarshipsFilters = { name: string; starship_class: string };
type VehiclesFilters = { name: string; vehicle_class: string };

type UiState = {
  // --- Films ---
  selectedFilmId: string | null;
  setSelectedFilmId: (id: string | null) => void;
  filmFilters: FilmsFilters;
  setFilmFilters: (patch: Partial<FilmsFilters>) => void;
  resetFilmFilters: () => void;

  // --- People ---
  peopleFilters: PeopleFilters;
  setPeopleFilters: (patch: Partial<PeopleFilters>) => void;
  resetPeopleFilters: () => void;

  // --- Planets ---
  planetsFilters: PlanetsFilters;
  setPlanetsFilters: (patch: Partial<PlanetsFilters>) => void;
  resetPlanetsFilters: () => void;

  // --- Species ---
  speciesFilters: SpeciesFilters;
  setSpeciesFilters: (patch: Partial<SpeciesFilters>) => void;
  resetSpeciesFilters: () => void;

  // --- Starships ---
  starshipsFilters: StarshipsFilters;
  setStarshipsFilters: (patch: Partial<StarshipsFilters>) => void;
  resetStarshipsFilters: () => void;

  // --- Vehicles ---
  vehiclesFilters: VehiclesFilters;
  setVehiclesFilters: (patch: Partial<VehiclesFilters>) => void;
  resetVehiclesFilters: () => void;
};

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      // Films
      selectedFilmId: null,
      setSelectedFilmId: (id) => set({ selectedFilmId: id }),
      filmFilters: { name: "", director: "" },
      setFilmFilters: (patch) =>
        set((state) => ({ filmFilters: { ...state.filmFilters, ...patch } })),
      resetFilmFilters: () => set({ filmFilters: { name: "", director: "" } }),

      // People
      peopleFilters: { name: "", gender: "" },
      setPeopleFilters: (patch) =>
        set((state) => ({ peopleFilters: { ...state.peopleFilters, ...patch } })),
      resetPeopleFilters: () => set({ peopleFilters: { name: "", gender: "" } }),

      // Planets
      planetsFilters: { name: "", terrain: "" },
      setPlanetsFilters: (patch) =>
        set((state) => ({ planetsFilters: { ...state.planetsFilters, ...patch } })),
      resetPlanetsFilters: () => set({ planetsFilters: { name: "", terrain: "" } }),

      // Species
      speciesFilters: { name: "", classification: "" },
      setSpeciesFilters: (patch) =>
        set((state) => ({ speciesFilters: { ...state.speciesFilters, ...patch } })),
      resetSpeciesFilters: () =>
        set({ speciesFilters: { name: "", classification: "" } }),

      // Starships
      starshipsFilters: { name: "", starship_class: "" },
      setStarshipsFilters: (patch) =>
        set((state) => ({
          starshipsFilters: { ...state.starshipsFilters, ...patch },
        })),
      resetStarshipsFilters: () =>
        set({ starshipsFilters: { name: "", starship_class: "" } }),

      // Vehicles
      vehiclesFilters: { name: "", vehicle_class: "" },
      setVehiclesFilters: (patch) =>
        set((state) => ({
          vehiclesFilters: { ...state.vehiclesFilters, ...patch },
        })),
      resetVehiclesFilters: () =>
        set({ vehiclesFilters: { name: "", vehicle_class: "" } }),
    }),
    {
      name: "sw-explorer-ui",
    }
  )
);