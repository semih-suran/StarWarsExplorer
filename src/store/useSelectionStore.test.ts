import { describe, it, expect, beforeEach } from "vitest";
import { useSelectionStore, type SelectedItem } from "./useSelectionStore";
import type { ResourceType } from "@/types";

const createItem = (id: string, type: ResourceType): SelectedItem => ({
  id,
  name: `Item ${id}`,
  type,
  url: `https://swapi.info/api/${type}s/${id}`
});

describe("useSelectionStore", () => {
  beforeEach(() => {
    useSelectionStore.setState({ selectedItems: [] });
  });

  it("should add an item to selection", () => {
    const item = createItem("1", "person");
    useSelectionStore.getState().toggleSelection(item);
    
    expect(useSelectionStore.getState().selectedItems).toHaveLength(1);
    expect(useSelectionStore.getState().selectedItems[0].id).toBe("1");
  });

  it("should remove an item if toggled again", () => {
    const item = createItem("1", "person");
    
    useSelectionStore.getState().toggleSelection(item);
    expect(useSelectionStore.getState().selectedItems).toHaveLength(1);
    
    useSelectionStore.getState().toggleSelection(item);
    expect(useSelectionStore.getState().selectedItems).toHaveLength(0);
  });

  it("should enforce max 2 items (FIFO Logic)", () => {
    const item1 = createItem("1", "person");
    const item2 = createItem("2", "person");
    const item3 = createItem("3", "person");

    useSelectionStore.getState().toggleSelection(item1);
    useSelectionStore.getState().toggleSelection(item2);
    
    expect(useSelectionStore.getState().selectedItems).toHaveLength(2);

    useSelectionStore.getState().toggleSelection(item3);

    const items = useSelectionStore.getState().selectedItems;
    expect(items).toHaveLength(2);
    expect(items.map(i => i.id)).toEqual(["2", "3"]);
  });

  it("should strictly enforce Type Locking (Context Switch)", () => {
    const person = createItem("1", "person");
    const planet = createItem("2", "planet");

    useSelectionStore.getState().toggleSelection(person);
    expect(useSelectionStore.getState().selectedItems[0].type).toBe("person");

    useSelectionStore.getState().toggleSelection(planet);

    const items = useSelectionStore.getState().selectedItems;
    expect(items).toHaveLength(1);
    expect(items[0].type).toBe("planet");
    expect(items[0].id).toBe("2");
  });
});