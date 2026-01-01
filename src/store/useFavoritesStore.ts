import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface FavoritesStore {
  favoriteIds: string[];
  addFavorite: (url: string) => void;
  removeFavorite: (url: string) => void;
  isFavorite: (url: string) => boolean;
  toggleFavorite: (url: string) => void;
}

export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      favoriteIds: [],

      addFavorite: (url) =>
        set((state) => {
          if (state.favoriteIds.includes(url)) return state;
          return { favoriteIds: [...state.favoriteIds, url] };
        }),

      removeFavorite: (url) =>
        set((state) => ({
          favoriteIds: state.favoriteIds.filter((id) => id !== url),
        })),

      isFavorite: (url) => get().favoriteIds.includes(url),

      toggleFavorite: (url) => {
        const { favoriteIds } = get();
        if (favoriteIds.includes(url)) {
          get().removeFavorite(url);
        } else {
          get().addFavorite(url);
        }
      },
    }),
    {
      name: "starwars-favorites-v3",
      storage: createJSONStorage(() => localStorage),
    }
  )
);