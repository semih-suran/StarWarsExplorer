import { create } from "zustand";
import { persist } from "zustand/middleware";

type UiState = {
  selectedFilmId: string | null;
  setSelectedFilmId: (id: string | null) => void;
  
  selectedPersonId: string | null;
  setSelectedPersonId: (id: string | null) => void;
  
};

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      selectedFilmId: null,
      setSelectedFilmId: (id) => set({ selectedFilmId: id }),
      
      selectedPersonId: null,
      setSelectedPersonId: (id) => set({ selectedPersonId: id }),
    }),
    {
      name: "sw-explorer-ui",
    }
  )
);