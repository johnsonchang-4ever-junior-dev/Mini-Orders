// src/types/order.ts

// The 3 allowed statuses. A "union type": only these exact strings are allowed.
// export so other files can use it
export type OrderStatus = "pending" | "shipped" | "cancelled";

// One full order, as the backend (or mock) sends it back
export interface Order {
  id: number;
  customer: string;
  quantity: number;
  status: OrderStatus;
  createdAt: string;    // ISO date text, e.g. "2026-10-31T10:00:00Z"
}
// interface can only describe objects
// Object shape → interface
// Anything else (a list of choices) → type

// What the form sends when creating an order.
// Omit<...> = "Order, minus these fields", because the backend server decides
// id, status and createdAt, not the user.
export type NewOrder = Omit<Order, "id" | "status" | "createdAt">;


