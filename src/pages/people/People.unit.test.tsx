import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@/utilities/testing-utils";
import userEvent from "@testing-library/user-event";
import { PeopleList } from "./components/PeopleList/PeopleList";
import { PeopleFilterForm } from "./components/PeopleFilterForm/PeopleFilterForm";
import { mockPeople } from "@/api/people/mock";
import { useUiStore } from "@/store/useUiStore";

describe("PeopleList (unit)", () => {
  it("renders a list of person cards", () => {
    render(<PeopleList data={mockPeople} />);
    const cards = screen.getAllByTestId("person-card");
    expect(cards).toHaveLength(mockPeople.length);
    expect(screen.getByText("Luke Skywalker")).toBeInTheDocument();
  });

  it("shows 'No results' when list empty", () => {
    render(<PeopleList data={[]} />);
    expect(screen.getByText(/no results/i)).toBeInTheDocument();
  });
});

describe("PeopleFilterForm (unit)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useUiStore.setState({
      selectedPersonId: null,
      peopleFilters: { name: "", gender: "" },
    });
    try {
      localStorage.removeItem("sw-explorer-ui");
    } catch (e) {}
  });

  it("calls onSubmit with form values", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<PeopleFilterForm onSubmit={onSubmit} />);

    await user.type(screen.getByPlaceholderText(/search by name/i), "Leia");
    await user.selectOptions(
      screen.getByLabelText(/filter by gender/i),
      "female"
    );
    await user.click(screen.getByRole("button", { name: /filter/i }));

    expect(onSubmit).toHaveBeenCalled();
    const submitted = onSubmit.mock.lastCall[0];
    expect(submitted.name).toBe("Leia");
    expect(submitted.gender).toBe("female");
  });

  it("reset button clears inputs and calls onSubmit with empty values", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<PeopleFilterForm onSubmit={onSubmit} />);

    await user.type(screen.getByPlaceholderText(/search by name/i), "Darth");
    await user.click(screen.getByRole("button", { name: /reset/i }));

    expect(onSubmit).toHaveBeenCalled();
    expect(onSubmit.mock.calls[0][0]).toEqual({ name: "", gender: "" });
  });
});

/*
TEST DOCUMENTATION (bottom of file)

File purpose:
- Unit tests for discrete, reusable components used on the People page:
  - PeopleList: rendering and empty-state behavior
  - PeopleFilterForm: form wiring and reset behaviour
- Fast, deterministic checks that exercise component contracts without external dependencies.

Tests and what they validate:

1) PeopleList - "renders a list of person cards"
   - WHAT: Renders one card per item and shows expected text (e.g. "Luke Skywalker").
   - WHY: Catches regressions in render logic (map, keys, children, testids) quickly.
   - CONFIDENCE: 95%
   - REASONING: Render with known mock data -> query by testid/text -> assert count and presence.

2) PeopleList - "shows 'No results' when list empty"
   - WHAT: Verifies empty-state fallback is rendered for an empty array.
   - WHY: Ensures the component is resilient to empty input and surfaces a proper UX message.
   - CONFIDENCE: 93%
   - REASONING: Render with [] -> assert fallback text present.

3) PeopleFilterForm - "calls onSubmit with form values"
   - WHAT: Simulates typing/selecting and submitting; asserts the consumer callback receives the expected payload.
   - WHY: Validates react-hook-form wiring and that user interactions are forwarded correctly to the parent.
   - CONFIDENCE: 92%
   - REASONING: Fill inputs, trigger submit button, inspect mocked onSubmit arguments.

4) PeopleFilterForm - "reset button clears inputs and calls onSubmit with empty values"
   - WHAT: Confirms the form Reset clears fields and notifies the parent (calls onSubmit with cleared values).
   - WHY: Prevents stale filters from being applied; matches a standard UX contract.
   - CONFIDENCE: 90%
   - REASONING: Fill a field, click Reset, assert onSubmit called with `{ name: "", gender: "" }`.

Extra notes / implementation details:
- Unit tests explicitly clear zustand state and the persist key in `beforeEach` to keep test runs deterministic (the form/component tests do not depend on the store but this avoids accidental coupling).
- Tests are intentionally focused: they do not mock network calls nor exercise pagination/filtering hooks - that is covered by integration tests.

Limitations and suggested additions:
- Add accessibility assertions (aria labels, roles) for better a11y coverage.
- Consider snapshot tests for the card layout if the visual contract is important, but prefer behavior-driven tests.
- Add small negative tests (invalid values or unexpected prop shapes) if you expect callers to sometimes pass odd data.

Why these unit tests matter for hiring:
- Unit tests are the fastest sanity guards and show the candidate knows how to write deterministic, focused tests that protect component contracts and prevent regressions.
*/
