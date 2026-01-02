import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { ComparisonModal } from "./ComparisonModal";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { SelectedItem } from "@/store/useSelectionStore";

const mockFetch = vi.fn();
globalThis.fetch = mockFetch as unknown as typeof fetch;

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

const mockItems: SelectedItem[] = [
  { id: "1", name: "Luke", type: "person", url: "api/people/1" },
  { id: "2", name: "Vader", type: "person", url: "api/people/2" },
];

describe("ComparisonModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render and display comparison data", async () => {
    mockFetch
      .mockResolvedValueOnce({
        json: async () => ({ name: "Luke", height: "172", mass: "77" }),
      })
      .mockResolvedValueOnce({
        json: async () => ({ name: "Vader", height: "202", mass: "136" }),
      });

    render(<ComparisonModal items={mockItems} onClose={vi.fn()} />, {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(screen.getByText("172")).toBeInTheDocument();
      expect(screen.getByText("202")).toBeInTheDocument();
    });

    expect(screen.getByText((content) => content.includes('VS:') && content.includes('person')))
      .toBeInTheDocument();
  });

  it("should correctly highlight the 'Winner' (Higher Value)", async () => {
    mockFetch
      .mockResolvedValueOnce({
        json: async () => ({ name: "Luke", height: "172", mass: "77" }),
      })
      .mockResolvedValueOnce({
        json: async () => ({ name: "Vader", height: "202", mass: "136" }),
      });

    render(<ComparisonModal items={mockItems} onClose={vi.fn()} />, {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
        expect(screen.getByText("202")).toBeInTheDocument();
    });

    const vaderValue = screen.getByText("202");
    const container = vaderValue.parentElement;
    
    expect(container).toHaveClass("text-success");
    expect(container).toHaveClass("bg-success/20");
    expect(container).toHaveClass("font-bold");

    const lukeValue = screen.getByText("172");
    expect(lukeValue.parentElement).toHaveClass("text-error");
  });
  
  it("should handle 'unknown' values gracefully", async () => {
     mockFetch
      .mockResolvedValueOnce({
        json: async () => ({ name: "Yoda", height: "66", mass: "17" }),
      })
      .mockResolvedValueOnce({
        json: async () => ({ name: "Ghost", height: "unknown", mass: "unknown" }),
      });

    render(<ComparisonModal items={mockItems} onClose={vi.fn()} />, {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
        const unknowns = screen.getAllByText("unknown");
        expect(unknowns.length).toBeGreaterThan(0);
    });
    
    const yodaHeight = screen.getByText("66");
    expect(yodaHeight.parentElement).not.toHaveClass("text-success");
  });
});