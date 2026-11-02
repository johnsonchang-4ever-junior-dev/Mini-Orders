// src/app/page.tsx  ->  URL: /
// No "use client", so it's a Server Component: it runs on the Next.js frontend server.
import { Suspense } from "react";
import Link from "next/link";
import { getOrders } from "@/services/order.service";

// An async Server Component: it can await data directly, no useEffect needed
async function OrderCount() {
  const orders = await getOrders(); // ~0.5s mock wait, on the Next.js frontend server
  return <p className="muted">{orders.length} orders in the system</p>;
}

export default function Home() {
  const appName = "Mini Orders";

  return (
    <main>
      <h1>Welcome to {appName} 🛒</h1>
      {/* The heading shows at once; the count streams in when it's ready */}
      <Suspense fallback={<p className="muted">Counting orders...</p>}>
        <OrderCount />
      </Suspense>
      <p>
        <Link href="/orders">Go to orders →</Link>
      </p>
    </main>
  );
}