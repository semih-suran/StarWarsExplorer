import { create } from "zustand";
import { persist } from "zustand/middleware";

type FilmsFilters = { name: string; director: string; };

type UiState = {
  selectedFilmId: string | null;
  setSelectedFilmId: (id: string | null) => void;
  filmFilters: FilmsFilters;
  setFilmFilters: (patch: Partial<FilmsFilters> | ((prev: FilmsFilters) => FilmsFilters)) => void;
  resetFilmFilters: () => void;
};

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      selectedFilmId: null,
      setSelectedFilmId: (id) => set({ selectedFilmId: id }),
      filmFilters: { name: "", director: "" },
      setFilmFilters: (patch) =>
        set((state) => {
          const next = typeof patch === "function" ? patch(state.filmFilters) : { ...state.filmFilters, ...patch };
          return { filmFilters: next };
        }),
      resetFilmFilters: () => set({ filmFilters: { name: "", director: "" } }),
    }),
    {
      name: "sw-explorer-ui",
    }
  )
);
