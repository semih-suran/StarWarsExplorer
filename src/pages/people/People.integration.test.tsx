import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { People } from "./People";
import * as api from "@/api/api";
import { userEvent } from "@testing-library/user-event";

const mockPeople = [
  {
    name: "Luke Skywalker",
    height: "172",
    mass: "77",
    gender: "male",
    birth_year: "19BBY",
    url: "https://swapi.info/api/people/1",
  },
  {
    name: "C-3PO",
    height: "167",
    mass: "75",
    gender: "n/a",
    birth_year: "112BBY",
    url: "https://swapi.info/api/people/2",
  },
];

const renderWithClient = (ui: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  return {
    ...render(
      <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
    ),
  };
};

describe("People page - integration", () => {
  it("loads people and allows filtering by name", async () => {
    vi.spyOn(api, "getPeople").mockResolvedValue({
      count: 2,
      next: null,
      previous: null,
      results: mockPeople as any,
    });

    renderWithClient(<People />);

    await waitFor(() => {
      expect(screen.getByText("Luke Skywalker")).toBeInTheDocument();
      expect(screen.getByText("C-3PO")).toBeInTheDocument();
    });

    const user = userEvent.setup();
    const nameInput = screen.getByPlaceholderText(/search by name/i);

    const filterButton = screen.getByRole("button", { name: "Filter" });

    await user.type(nameInput, "Luke");
    await user.click(filterButton);

    await waitFor(() => {
       expect(screen.queryByText("C-3PO")).not.toBeInTheDocument();
       expect(screen.getByText("Luke Skywalker")).toBeInTheDocument();
    });
  });

  it("reset returns full list", async () => {
    vi.spyOn(api, "getPeople").mockResolvedValue({
      count: 2,
      next: null,
      previous: null,
      results: mockPeople as any,
    });

    renderWithClient(<People />);

    await waitFor(() => expect(screen.getByText("Luke Skywalker")).toBeInTheDocument());

    const user = userEvent.setup();

    const resetButton = screen.getByRole("button", { name: "Reset" });
    
    const nameInput = screen.getByPlaceholderText(/search by name/i);
    const filterButton = screen.getByRole("button", { name: "Filter" });

    await user.type(nameInput, "Luke");
    await user.click(filterButton);
    await waitFor(() => expect(screen.queryByText("C-3PO")).not.toBeInTheDocument());

    await user.click(resetButton);

    await waitFor(() => {
      expect(screen.getByText("C-3PO")).toBeInTheDocument();
      expect(screen.getByText("Luke Skywalker")).toBeInTheDocument();
    });
  });
});