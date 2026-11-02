// src/components/OrderItem.tsx
import { memo } from "react";
import Link from "next/link";
import type { Order } from "@/types/order";

// Props shape: this component receives ONE order
interface OrderItemProps {
  order: Order;
  onDelete: (id: number) => void;
}
// Order: The box that take { id, customer, quantity, status, createdAt }
// OrderItemProps: The box that take { order }

// Only use Export Default when file only export 1 function, if Export 2 or more function, use Name Export. Never use hybrid Export 

function OrderItem({ order, onDelete }: OrderItemProps) {
  return (
    <li className="card order-item">
      <div>
        <Link href={`/orders/${order.id}`} data-action="open-order" data-order-id={order.id}>
          <strong>{order.customer}</strong>
        </Link>
        <p className="muted">
          Qty {order.quantity} · {order.createdAt.slice(0, 10)}
        </p>
      </div>
      {/* class becomes "status status-shipped", etc. */}
      <div className="order-actions">
        <span className={`status status-${order.status}`}>{order.status}</span>
        {/* Arrow function: runs onDelete(order.id) only WHEN clicked */}
        <button
          className="button-danger"
          data-action="delete-order"
          data-order-id={order.id}
          aria-label={`Delete ${order.customer}`}
          onClick={() => onDelete(order.id)}
        >
          Delete
        </button>
      </div>
    </li>
  );
}


// memo: skip re-rendering when order and onDelete are the same as last time
export default memo(OrderItem);