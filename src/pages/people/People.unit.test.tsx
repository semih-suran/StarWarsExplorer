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

    expect(onSubmit).toHaveBeenLastCalledWith(
      expect.objectContaining({
        name: "Leia",
        gender: "female",
      }),
      expect.anything()
    );
  });

  it("reset button clears inputs and calls onSubmit with empty values", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<PeopleFilterForm onSubmit={onSubmit} />);

    await user.type(screen.getByPlaceholderText(/search by name/i), "Darth");
    await user.click(screen.getByRole("button", { name: /reset/i }));

    expect(onSubmit).toHaveBeenCalled();
    expect(onSubmit).toHaveBeenLastCalledWith(
      expect.objectContaining({ name: "", gender: "" })
    );
  });
});