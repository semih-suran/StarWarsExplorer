import { describe, it, expect } from "vitest";
import { render, screen } from "@/test/test-utils";
import { Home } from "./Home";

describe("Home Page", () => {
  it("renders the dashboard with all categories", () => {
    render(<Home />);
    expect(screen.getByText("StarWars Explorer")).toBeInTheDocument();
    expect(screen.getByText("People")).toBeInTheDocument();
    expect(screen.getByText("Browse characters from the Star Wars universe.")).toBeInTheDocument();
    expect(screen.getByText("Films")).toBeInTheDocument();
    expect(screen.getByText("Explore Starships")).toBeInTheDocument();
  });
});