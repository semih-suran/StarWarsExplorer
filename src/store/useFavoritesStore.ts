import { create } from "zustand";
import { persist } from "zustand/middleware";

export type FavoriteItem = {
  id: string;
  name: string;
  type: "people" | "films" | "planets" | "species" | "starships" | "vehicles";
  image?: string;
};

type FavoritesState = {
  favorites: FavoriteItem[];
  addFavorite: (item: FavoriteItem) => void;
  removeFavorite: (id: string, type: FavoriteItem["type"]) => void;
  isFavorite: (id: string, type: FavoriteItem["type"]) => boolean;
};

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],

      addFavorite: (item) => {
        const current = get().favorites;
        const exists = current.find((f) => f.id === item.id && f.type === item.type);
        if (!exists) {
          set({ favorites: [...current, item] });
        }
      },

      removeFavorite: (id, type) => {
        set({
          favorites: get().favorites.filter(
            (item) => !(item.id === id && item.type === type)
          ),
        });
      },

      isFavorite: (id, type) => {
        return !!get().favorites.find((item) => item.id === id && item.type === type);
      },
    }),
    {
      name: "sw-explorer-favorites",
    }
  )
);