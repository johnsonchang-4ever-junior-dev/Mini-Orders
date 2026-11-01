// src/components/OrderItem.tsx
import type { Order } from "@/types/order";

// Props shape: this component receives ONE order
interface OrderItemProps {
  order: Order;
}
// Order: The box that take { id, customer, quantity, status, createdAt }
// OrderItemProps: The box that take { order }

// Only use Export Default when file only export 1 function, if Export 2 or more function, use Name Export. Never use hybrid Export 

export default function OrderItem({ order }: OrderItemProps) {
  return (
    <li className="card order-item">
      <div>
        <strong>{order.customer}</strong>
        <p className="muted">
          Qty {order.quantity} · {order.createdAt.slice(0, 10)}
        </p>
      </div>
      {/* class becomes "status status-shipped", etc. */}
      <span className={`status status-${order.status}`}>{order.status}</span>
    </li>
  );
}