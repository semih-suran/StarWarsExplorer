import { describe, it, expect, beforeEach } from "vitest";
import { useFavoritesStore } from "./useFavoritesStore";

describe("useFavoritesStore", () => {
  const itemUrl = "https://swapi.info/api/people/1";

  beforeEach(() => {
    useFavoritesStore.setState({ favoriteIds: [] });
  });

  it("should start with an empty list", () => {
    const { favoriteIds } = useFavoritesStore.getState();
    expect(favoriteIds).toEqual([]);
  });

  it("should add a favorite item", () => {
    useFavoritesStore.getState().addFavorite(itemUrl);

    const { favoriteIds } = useFavoritesStore.getState();
    expect(favoriteIds).toHaveLength(1);
    expect(favoriteIds[0]).toBe(itemUrl);
  });

  it("should prevent duplicate favorites", () => {
    useFavoritesStore.getState().addFavorite(itemUrl);
    useFavoritesStore.getState().addFavorite(itemUrl);

    const { favoriteIds } = useFavoritesStore.getState();
    expect(favoriteIds).toHaveLength(1);
  });

  it("should remove a favorite", () => {
    useFavoritesStore.getState().addFavorite(itemUrl);
    expect(useFavoritesStore.getState().favoriteIds).toHaveLength(1);

    useFavoritesStore.getState().removeFavorite(itemUrl);
    expect(useFavoritesStore.getState().favoriteIds).toHaveLength(0);
  });

  it("should toggle a favorite", () => {
    useFavoritesStore.getState().toggleFavorite(itemUrl);
    expect(useFavoritesStore.getState().favoriteIds).toContain(itemUrl);

    useFavoritesStore.getState().toggleFavorite(itemUrl);
    expect(useFavoritesStore.getState().favoriteIds).not.toContain(itemUrl);
  });
});