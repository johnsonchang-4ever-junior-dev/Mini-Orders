// tests/OrderList.test.tsx
import { afterEach, describe, expect, test, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import OrderList from "@/components/orders/OrderList";
import type { Order } from "@/types/order";

// Real sample data, same as the mock
const twoOrders: Order[] = [
  { id: 2, customer: "Leo", quantity: 5, status: "shipped",   createdAt: "2026-10-30T14:40:00Z" },
  { id: 3, customer: "Ava", quantity: 1, status: "cancelled", createdAt: "2026-10-31T08:05:00Z" },
];

// Remove what the last test drew, so tests don't see each other's output
afterEach(() => {
  cleanup();
});

describe("OrderList", () => {
  test("shows one list item per order, and the total", () => {
    render(<OrderList orders={twoOrders} totalCount={2} onDelete={() => {}} />);

    expect(screen.getAllByRole("listitem")).toHaveLength(2);
    // every <li> has role "listitem" 
    expect(screen.getByText("2 orders")).toBeDefined();
    // find THE ONE element whose text is exactly "2 orders"
  });

  test("shows a message when there are no orders", () => {
    render(<OrderList orders={[]} totalCount={0} onDelete={() => {}} />);

    expect(screen.getByText("No orders found.")).toBeDefined();
  });

  test("calls onDelete with Leo's id when Leo's Delete is clicked", () => {
    const onDelete = vi.fn(); // a fake function that remembers how it was called
    render(<OrderList orders={twoOrders} totalCount={2} onDelete={onDelete} />);

    fireEvent.click(screen.getByRole("button", { name: "Delete Leo" }));
    // { name: "Delete Leo" } …whose accessible name is “Delete Leo” (from aria-label).

    expect(onDelete).toHaveBeenCalledWith(2);
    // : “was there a call with exactly 2? because Leo’s id is 2”
  });
});

// npm test = a test drive 🚗
// It runs your code in a pretend browser and checks the results match what you expect:
// “Given Leo and Ava, are there 2 list items?”

// npm run lint = a spell-checker ✍️
// It reads your code without running it and flags mistakes and risky patterns:
// a hook called after an early return (rules of hooks)
// a variable you made but never use (like unUsedmockOrders)
// let that never changes and should be const
// a missing dependency in useEffect or useMemo

// vi.fn() makes a fake function writes down every call in a notebook.
// const onDelete = vi.fn();
// onDelete(2);
// onDelete(3);
// onDelete.mock.calls   // -> [[2], [3]]   the notebook: one entry per call
