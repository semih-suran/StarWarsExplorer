import { expect, test } from "vitest";
import { Home } from "./Home";
import { render } from "@/utilities/testing-utils";

test("Home component renders without an issue", () => {
  const { container } = render(<Home />);
  expect(container).toBeInTheDocument();
});
