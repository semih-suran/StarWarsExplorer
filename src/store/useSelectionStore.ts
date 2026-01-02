import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ResourceType } from "@/types";

export type SelectedItem = {
  id: string;
  name: string;
  type: ResourceType;
  url: string;
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
          const { selectedItems } = state;
          const exists = selectedItems.some((i) => i.id === item.id);
          
          if (exists) {
            return { selectedItems: selectedItems.filter((i) => i.id !== item.id) };
          }

          const currentType = selectedItems[0]?.type;
          
          if (currentType && currentType !== item.type) {
            return { selectedItems: [item] };
          }

          if (selectedItems.length >= 2) {
            return { selectedItems: [...selectedItems.slice(1), item] };
          }
          
          return { selectedItems: [...selectedItems, item] };
        }),
      clearSelection: () => set({ selectedItems: [] }),
    }),
    { name: "starwars-selection" }
  )
);