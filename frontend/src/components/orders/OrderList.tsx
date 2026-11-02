// src/components/OrderList.tsx
import type { Order } from "@/types/order";
import OrderItem from "./OrderItem";

// A Props interface is used by one component, so it lives in that component’s file.
interface OrderListProps {
  orders: Order[];   // a list of orders
  totalCount: number; // all matching orders, not just this page
  onDelete: (id: number) => void; // a function passed down from the page
}

export default function OrderList({ orders, totalCount, onDelete }: OrderListProps) {
  // Conditional rendering, Way 1: early return
  if (orders.length === 0) {
    return <p className="muted">No orders found.</p>;
  }

  // Fragment: return 2 elements without an extra <div>
  return (
    <>
      <p className="muted">{totalCount} orders</p>
      <ul className="order-list">
        {orders.map((order) => (
          // key = a stable, unique id, so React can track each card
          <OrderItem key={order.id} order={order} onDelete={onDelete} />
        ))}
      </ul>
    </>
  );
}