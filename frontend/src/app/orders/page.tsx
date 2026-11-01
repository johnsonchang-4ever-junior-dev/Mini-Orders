// src/app/orders/page.tsx  ->  URL: /orders
import type { Order } from "@/types/order";
import OrderList from "@/components/OrderList";

// Temporary hardcoded data. Part 3 moves this into the mock service.
const sampleOrders: Order[] = [
  { id: 1, customer: "Mia", quantity: 2, status: "pending",   createdAt: "2026-10-29T09:15:00Z" },
  { id: 2, customer: "Leo", quantity: 5, status: "shipped",   createdAt: "2026-10-30T14:40:00Z" },
  { id: 3, customer: "Ava", quantity: 1, status: "cancelled", createdAt: "2026-10-31T08:05:00Z" },
];

export default function OrdersPage() {
  return (
    <main>
      <h1>Orders</h1>
      <OrderList orders={sampleOrders} />
    </main>
  );
}