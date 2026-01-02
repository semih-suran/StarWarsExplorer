import { create } from "zustand";
import { persist } from "zustand/middleware";

type SelectedItem = {
  id: string;
  name: string;
  type: "planet" | "starship" | "person" | "film" | "vehicle" | "specie";
};

type SelectionState = {
  selectedItems: SelectedItem[];
  toggleSelection: (item: SelectedItem) => void;
  clearSelection: () => void;
};

export const useSelectionStore = create<SelectionState>()(
  persist(
    (set) => ({
      selectedItems: [],
      toggleSelection: (item) =>
        set((state) => {
          const exists = state.selectedItems.some((i) => i.id === item.id);
          if (exists) {
            return { selectedItems: state.selectedItems.filter((i) => i.id !== item.id) };
          }
          if (state.selectedItems.length >= 4) return state; 
          return { selectedItems: [...state.selectedItems, item] };
        }),
      clearSelection: () => set({ selectedItems: [] }),
    }),
    { name: "starwars-selection" }
  )
);