import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@/test/test-utils"; 
import { People } from "./People";

vi.mock("@/hooks/useResourceLogic", () => ({
  useResourceLogic: () => ({
    data: [
      { name: "Luke Skywalker", url: "https://swapi.info/api/people/1" },
      { name: "C-3PO", url: "https://swapi.info/api/people/2" },
    ],
    isLoading: false,
    error: null,
    filters: {},
    setFilters: vi.fn(),
    resetFilters: vi.fn(),
    pagination: {
      page: 1,
      totalPages: 5,
      goToPage: vi.fn(),
      nextPage: vi.fn(),
      prevPage: vi.fn(),
    },
  }),
}));

describe("People Page", () => {
  it("renders the People page correctly", () => {
    render(<People />);
    
    expect(screen.getByText("People")).toBeInTheDocument();
    
    expect(screen.getByText("Luke Skywalker")).toBeInTheDocument();
    expect(screen.getByText("C-3PO")).toBeInTheDocument();
  });
});