// src/components/OrderList.tsx
import type { Order } from "@/types/order";
import OrderItem from "./OrderItem";

interface OrderListProps {
  orders: Order[];   // a list of orders
}

export default function OrderList({ orders }: OrderListProps) {
  // Conditional rendering, Way 1: early return
  if (orders.length === 0) {
    return <p className="muted">No orders yet.</p>;
  }

  // Fragment: return 2 elements without an extra <div>
  return (
    <>
      <p className="muted">{orders.length} orders</p>
      <ul className="order-list">
        {orders.map((order) => (
          // key = a stable, unique id, so React can track each card
          <OrderItem key={order.id} order={order} />
        ))}
      </ul>
    </>
  );
}