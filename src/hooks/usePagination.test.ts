import { renderHook, act } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { usePagination } from "./usePagination";

const mockItems = Array.from({ length: 25 }, (_, i) => ({ id: i + 1 }));

describe("usePagination", () => {
  it("should initialize correctly", () => {
    const { result } = renderHook(() => 
      usePagination({ totalItems: mockItems.length, itemsPerPage: 10 })
    );

    expect(result.current.page).toBe(1);
    expect(result.current.totalPages).toBe(3);
    expect(result.current.startIndex).toBe(0);
    expect(result.current.endIndex).toBe(10);
  });

  it("should navigate to next page", () => {
    const { result } = renderHook(() => 
      usePagination({ totalItems: mockItems.length, itemsPerPage: 10 })
    );

    act(() => {
      result.current.nextPage();
    });

    expect(result.current.page).toBe(2);
    expect(result.current.startIndex).toBe(10);
    expect(result.current.endIndex).toBe(20);
  });

  it("should jump to specific page", () => {
    const { result } = renderHook(() => 
      usePagination({ totalItems: mockItems.length, itemsPerPage: 10 })
    );

    act(() => {
      result.current.setPage(3);
    });

    expect(result.current.page).toBe(3);
  });

  it("should not exceed bounds", () => {
    const { result } = renderHook(() => 
      usePagination({ totalItems: mockItems.length, itemsPerPage: 10 })
    );

    act(() => {
      result.current.nextPage();
      result.current.nextPage();
      result.current.nextPage();
    });

    expect(result.current.page).toBe(3);
  });
  
  it("should adjust page if totalItems decreases", () => {
    const { result, rerender } = renderHook(
      ({ total }) => usePagination({ totalItems: total, itemsPerPage: 10 }),
      { initialProps: { total: 100 } }
    );

    act(() => {
        result.current.setPage(10);
    });
    expect(result.current.page).toBe(10);

    rerender({ total: 5 });

    expect(result.current.page).toBe(1);
  });
});