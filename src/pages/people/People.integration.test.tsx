import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@/test/test-utils";
import { People } from "./People";
import * as apiModule from "@/api/api";
import type { IPeople } from "@/types";

const MOCK_PEOPLE = [
  { name: "Luke Skywalker", gender: "male", url: "https://swapi.info/api/people/1" },
  { name: "Leia Organa", gender: "female", url: "https://swapi.info/api/people/5" },
  { name: "R2-D2", gender: "n/a", url: "https://swapi.info/api/people/3" },
];

describe("People Page - Integration", () => {
  it("loads people and allows filtering by name", async () => {
    vi.spyOn(apiModule, "getPeople").mockResolvedValue({
      count: 3,
      next: null,
      previous: null,
      results: MOCK_PEOPLE as unknown as IPeople[],
    });

    render(<People />);

    await waitFor(() => {
      expect(screen.getByText("Luke Skywalker")).toBeInTheDocument();
    });
    expect(screen.getByText("Leia Organa")).toBeInTheDocument();

    const input = screen.getByPlaceholderText(/search/i);
    fireEvent.change(input, { target: { value: "Leia" } });
    
    const filterBtn = screen.getByText("Filter");
    fireEvent.click(filterBtn);

    await waitFor(() => {
      expect(screen.queryByText("Luke Skywalker")).not.toBeInTheDocument();
      expect(screen.getByText("Leia Organa")).toBeInTheDocument();
    });
  });
});