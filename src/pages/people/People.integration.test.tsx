import { vi } from "vitest";
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
      selectedPersonId: null,
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

/*
TEST DOCUMENTATION (bottom of file)

File purpose:
- Integration-style tests for the People page that exercise the full page wiring:
  form -> zustand UI store -> filtering predicate (useFilteredList) -> pagination (usePagination) -> list UI.
- Network is mocked by replacing the data hook (useGetPeople) so tests stay fast and deterministic while still exercising real filtering/pagination logic.

Tests and what they validate:

1) "loads people and allows filtering by name"
   - WHAT: Ensures the page initially renders the full list (from the mocked hook), then typing a name and submitting the form reduces the visible items to the expected result.
   - WHY: Verifies the critical user flow where the user interacts with the form and the page applies filters correctly. This covers multiple layers: component wiring, predicate correctness, and pagination slicing.
   - CONFIDENCE: 90%
   - REASONING / STEPS:
     - Mock hook returns known dataset -> render People -> assert initial card count equals dataset length.
     - Simulate user typing and clicking Filter -> assert the rendered cards match the predicate results and expected text is present.

2) "reset returns full list (click the form Reset button)"
   - WHAT: After applying a filter, clicking the form's Reset button restores the full dataset in the UI.
   - WHY: Ensures the reset path clears the UI store and re-applies the pipeline (filter + pagination) correctly - an important UX guarantee.
   - CONFIDENCE: 88%
   - REASONING / STEPS:
     - Mock hook returns dataset -> render People -> apply filter -> confirm reduced list.
     - Click the form Reset button (exact string match) -> assert list length equals original dataset length.

Extra test details / implementation notes:
- Tests explicitly reset the zustand UI store and remove the persist key from localStorage in `beforeEach` so persisted state doesn't leak between tests. This makes tests hermetic.
- The integration tests intentionally *do not* contact the network; they mock only the data hook to exercise client-side logic deterministically.

Limitations and recommended next tests:
- Add a modal flow test: click "View" -> modal opens -> content fetched (mock fetch) displays correctly.
- Add tests for loading / error states by mocking `isLoading` and `error` on the hook.
- Add pagination behaviour tests (next/prev) using a larger mock set so the pagination slice changes across pages.
- Consider an e2e test (Cypress/Playwright) or MSW-based suite to exercise actual network behavior if you want to validate integration with the remote API.

Why these integration tests matter for hiring:
- They demonstrate you can compose hooks, global UI state (Zustand), and components correctly; they show an ability to test real user flows without flakiness.
*/
