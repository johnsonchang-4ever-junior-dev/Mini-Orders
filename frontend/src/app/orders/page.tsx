// src/app/orders/page.tsx  ->  URL: /orders
"use client"; // this page uses a hook, so it runs in the browser

import useOrders from "@/hooks/useOrders";
import OrderList from "@/components/orders/OrderList";

export default function OrdersPage() {
  const { orders, loading, error, removeOrder } = useOrders();

  return (
    <main>
      <h1>Orders</h1>
      {loading && <p className="muted">Loading orders...</p>}
      {error && <p className="error-text">Error: {error}</p>}
      {!loading && !error && <OrderList orders={orders} onDelete={removeOrder} />}
    </main>
  );
}
// click Delete on Mia -> onDelete(1) -> removeOrder(1)
// -> await deleteOrder(1)                       (0.5s mock wait)
// -> dispatch({ type: "removed", id: 1 })       (slip queued)
// -> React re-runs OrdersPage
//    -> useOrders() -> useReducer
//       -> ordersReducer runs: keeps orders where id !== 1 -> [Leo, Ava]
//       -> saved in OrdersPage's slot 1
//    -> page passes [Leo, Ava] to OrderList -> 2 OrderItems
// -> React compares by key: 1 gone, 2 and 3 the same
// -> removes ONLY Mia's <li> from the real page