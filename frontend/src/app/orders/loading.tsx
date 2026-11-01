// src/app/orders/loading.tsx
// Shown automatically while orders/page.tsx is waiting for data.
export default function Loading() {
  return <p className="muted">Loading orders...</p>;
}
// app/orders/page.tsx     -> "this is the page for /orders"
// app/orders/loading.tsx  -> "show this while page.tsx is waiting"
// app/orders/error.tsx    -> "show this if page.tsx crashes"   (Part 8)
// app/layout.tsx          -> "wrap every page in this"