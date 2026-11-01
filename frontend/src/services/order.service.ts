// src/services/order.service.ts
// The messenger: every order call goes through here.
// USE_MOCK = true  -> use the in-memory array below (pretend backend server)
// USE_MOCK = false -> call the real backend server through apiFetch
import type { NewOrder, Order } from "@/types/order";
import apiFetch from "@/lib/api";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";

// ---------- Mock data (only used when USE_MOCK is true) ----------
const MOCK_DELAY_MS = 500; // mock-only: pretend the network takes half a second

let mockOrders: Order[] = [
  { id: 1, customer: "Mia", quantity: 2, status: "pending",   createdAt: "2026-10-29T09:15:00Z" },
  { id: 2, customer: "Leo", quantity: 5, status: "shipped",   createdAt: "2026-10-30T14:40:00Z" },
  { id: 3, customer: "Ava", quantity: 1, status: "cancelled", createdAt: "2026-10-31T08:05:00Z" },
];
let nextId = 4;

// Wait ms milliseconds, then carry on
function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ---------- The 4 functions the rest of the app uses ----------

export async function getOrders(): Promise<Order[]> {
  if (USE_MOCK) {
    await wait(MOCK_DELAY_MS);
    return [...mockOrders]; // a copy, so callers can't change the mock by accident
  }
  return apiFetch<Order[]>("/api/orders");
}
// Async functions always return a Promise, not a value.

export async function getOrder(id: number): Promise<Order> {
  if (USE_MOCK) {
    await wait(MOCK_DELAY_MS);
    const found = mockOrders.find((o) => o.id === id);
    if (!found) throw new Error(`Order ${id} not found`); // like a 404
    return found;
  }
  return apiFetch<Order>(`/api/orders/${id}`);
}

export async function createOrder(input: NewOrder): Promise<Order> {
  if (USE_MOCK) {
    await wait(MOCK_DELAY_MS);
    // Pretend backend server validation (like a 400 Bad Request)
    if (input.customer.trim() === "") throw new Error("Customer is required");
    if (input.quantity < 1) throw new Error("Quantity must be at least 1");

    // The backend server decides these 3 fields, not the user
    const order: Order = {
      ...input,
      id: nextId,
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    nextId += 1;
    mockOrders = [...mockOrders, order];
    return order;
  }
  return apiFetch<Order>("/api/orders", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function deleteOrder(id: number): Promise<void> {
  if (USE_MOCK) {
    await wait(MOCK_DELAY_MS);
    mockOrders = mockOrders.filter((o) => o.id !== id);
    return;
  }
  return apiFetch<void>(`/api/orders/${id}`, { method: "DELETE" });
}