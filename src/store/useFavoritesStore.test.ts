import { describe, it, expect, beforeEach } from "vitest";
import { useFavoritesStore } from "./useFavoritesStore";
import type { FavoriteItem } from "./useFavoritesStore";

const resetStore = () => {
  useFavoritesStore.setState({ favorites: [] });
};

describe("useFavoritesStore", () => {
  beforeEach(() => {
    resetStore();
  });

  it("should start with an empty list", () => {
    const { favorites } = useFavoritesStore.getState();
    expect(favorites).toEqual([]);
  });

  it("should add a favorite item", () => {
    const item: FavoriteItem = { id: "1", name: "Luke", type: "people", image: "luke.jpg" };
    
    useFavoritesStore.getState().addFavorite(item);
    
    const { favorites } = useFavoritesStore.getState();
    expect(favorites).toHaveLength(1);
    expect(favorites[0]).toEqual(item);
  });

  it("should prevent duplicate favorites (Same ID + Same Type)", () => {
    const item: FavoriteItem = { id: "1", name: "Luke", type: "people" };

    useFavoritesStore.getState().addFavorite(item);
    useFavoritesStore.getState().addFavorite(item);

    const { favorites } = useFavoritesStore.getState();
    expect(favorites).toHaveLength(1);
  });

  it("should allow same ID but different Type (ID Collision fix)", () => {
    const luke: FavoriteItem = { id: "1", name: "Luke", type: "people" };
    const tatooine: FavoriteItem = { id: "1", name: "Tatooine", type: "planets" };
    
    useFavoritesStore.getState().addFavorite(luke);
    useFavoritesStore.getState().addFavorite(tatooine);
    
    const { favorites } = useFavoritesStore.getState();
    expect(favorites).toHaveLength(2);
  });

  it("should remove a favorite", () => {
    const item: FavoriteItem = { id: "1", name: "Luke", type: "people" };
    useFavoritesStore.getState().addFavorite(item);

    expect(useFavoritesStore.getState().favorites).toHaveLength(1);

    useFavoritesStore.getState().removeFavorite("1", "people");

    expect(useFavoritesStore.getState().favorites).toHaveLength(0);
  });
});