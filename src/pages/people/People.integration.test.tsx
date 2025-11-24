import { vi, describe, beforeEach, it, expect } from "vitest";
import { render, screen } from "@/utilities/testing-utils";
import userEvent from "@testing-library/user-event";
import { People } from "./People";
import { mockPeople } from "@/api/people/mock";
import { useUiStore } from "@/store/useUiStore";

vi.mock("@/api/people/use-get-people", async () => {
  const actual = await vi.importActual("@/api/people/use-get-people");
  return {
    ...actual,
    useGetPeople: vi.fn(),
  };
});

import { useGetPeople } from "@/api/people/use-get-people";
const mockUseGetPeople = vi.mocked(useGetPeople);

describe("People page - integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    useUiStore.setState({
      peopleFilters: { name: "", gender: "" },
    });

    try {
      localStorage.removeItem("sw-explorer-ui");
    } catch (e) {
    }
  });

  it("loads people and allows filtering by name (real filtering + pagination hooks)", async () => {
    mockUseGetPeople.mockReturnValue({
      data: mockPeople,
      isLoading: false,
      error: null,
    } as any);

    const user = userEvent.setup();
    render(<People />);

    const initialCards = await screen.findAllByTestId("person-card");
    expect(initialCards.length).toBe(mockPeople.length);

    await user.type(screen.getByPlaceholderText(/search by name/i), "Luke");
    await user.click(screen.getByRole("button", { name: /filter/i }));

    const filtered = await screen.findAllByTestId("person-card");
    expect(filtered).toHaveLength(1);
    expect(screen.getByText(/Luke Skywalker/)).toBeInTheDocument();
  });

  it("reset returns full list (click the form Reset button)", async () => {
    mockUseGetPeople.mockReturnValue({
      data: mockPeople,
      isLoading: false,
      error: null,
    } as any);

    const user = userEvent.setup();
    render(<People />);

    await user.type(screen.getByPlaceholderText(/search by name/i), "C-3PO");
    await user.click(screen.getByRole("button", { name: /filter/i }));

    expect((await screen.findAllByTestId("person-card")).length).toBe(1);

    await user.click(screen.getByRole("button", { name: /^Reset$/i }));

    const all = await screen.findAllByTestId("person-card");
    expect(all.length).toBe(mockPeople.length);
  });
});