import { render, screen } from "@testing-library/react";
import { People } from "./People";
import { useUiStore } from "@/store/useUiStore";
import { useGetResource } from "@/hooks/useGetResource";
import { vi, describe, it, expect, beforeEach } from "vitest";

vi.mock("@/hooks/useGetResource");
vi.mock("@/hooks/useUrlFilters", () => ({
  useUrlFilters: (initialState: any) => ({
    filters: initialState,
    setFilters: vi.fn(),
    resetFilters: vi.fn(),
  }),
}));

vi.mock("@/components", () => ({
  GenericResourcePage: ({ title, FilterForm, List }: any) => (
    <div data-testid="generic-page">
      <h1>{title}</h1>
      <FilterForm />
      <List />
    </div>
  ),
}));

vi.mock("./components/PeopleFilterForm/PeopleFilterForm", () => ({
  PeopleFilterForm: () => <div data-testid="people-filter-form" />,
}));
vi.mock("./components/PeopleList/PeopleList", () => ({
  PeopleList: () => <div data-testid="people-list" />,
}));
vi.mock("./components/PeopleModal/PeopleModal", () => ({
  PeopleModal: () => <div data-testid="people-modal" />,
}));

describe("People Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    useUiStore.setState({
      selectedPersonId: null,
    });

    (useGetResource as any).mockReturnValue({
      data: { results: [] },
      isLoading: false,
      error: null,
    });
  });

  it("renders the People page correctly", () => {
    render(<People />);
    expect(screen.getByTestId("generic-page")).toBeInTheDocument();
    expect(screen.getByText("People")).toBeInTheDocument();
    expect(screen.getByTestId("people-filter-form")).toBeInTheDocument();
    expect(screen.getByTestId("people-list")).toBeInTheDocument();
  });
});