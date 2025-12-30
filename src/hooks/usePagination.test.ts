import { describe, it, expect } from "vitest";
import { renderHook, act } from "@/test/test-utils";
import { usePagination } from "./usePagination";

describe("usePagination Hook", () => {
  const mockItems = Array.from({ length: 25 }, (_, i) => ({ id: i }));

  it("should initialize on page 1 with correct total pages", () => {
    const { result } = renderHook(() => usePagination(mockItems, 10));

    expect(result.current.page).toBe(1);
    expect(result.current.totalPages).toBe(3);
    expect(result.current.paginated).toHaveLength(10);
  });

  it("should go to the next page", () => {
    const { result } = renderHook(() => usePagination(mockItems, 10));

    if (result.current.page !== 1) {
      act(() => {
        result.current.goTo(1);
      });
    }

    act(() => {
      result.current.next();
    });

    expect(result.current.page).toBe(2);
    expect(result.current.paginated[0].id).toBe(10);
  });

  it("should not go past the last page", () => {
    const { result } = renderHook(() => usePagination(mockItems, 10));

    act(() => { result.current.goTo(3); });
    expect(result.current.page).toBe(3);

    act(() => { result.current.next(); });
    expect(result.current.page).toBe(3);
  });

  it("should reset to page 1 if data changes drastically", () => {
    const { result, rerender } = renderHook(
      ({ data }) => usePagination(data, 10),
      { initialProps: { data: mockItems } }
    );

    act(() => { result.current.goTo(3); });
    expect(result.current.page).toBe(3);

    const smallData = [{ id: 1 }, { id: 2 }];
    rerender({ data: smallData });

    expect(result.current.page).toBe(1);
    expect(result.current.totalPages).toBe(1);
  });
});