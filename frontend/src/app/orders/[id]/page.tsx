// src/app/orders/[id]/page.tsx  ->  URL: /orders/1, /orders/2, ...
// Server Component. [id] in the folder name = "any value goes here".
import Link from "next/link";
import { getOrder } from "@/services/order.service";

export default async function OrderDetailPage({ params }: PageProps<"/orders/[id]">) {
  const { id } = await params;               // "/orders/2" -> id = "2" (always text) 
  // Unwrapping  { id: "2" }  ->  id = "2"
  const order = await getOrder(Number(id));  // throws if not found -> error.tsx shows

  return (
    <main>
      <p>
        <Link href="/orders">← Back to orders</Link>
      </p>
      <h1>Order #{order.id}</h1>
      <div className="card order-detail">
        <p>
          <strong>{order.customer}</strong>
        </p>
        <p className="muted">Quantity: {order.quantity}</p>
        <p className="muted">Created: {order.createdAt.slice(0, 10)}</p>
        <span className={`status status-${order.status}`}>{order.status}</span>
      </div>
    </main>
  );
}

// click Leo (id = 2)
// -> <Link href="/orders/2"> takes the user to /orders/2
// -> Next.js matches the URL to the folder orders/[id]/
//    "2" sits where [id] is, so it builds: { id: "2" }
// -> Next.js calls OrderDetailPage({ params: Promise of { id: "2" } })
// -> await params  -> { id: "2" }  -> unwrap to get id = "2"
// -> Number("2") = 2 -> getOrder(2) -> Leo
// -> show detail