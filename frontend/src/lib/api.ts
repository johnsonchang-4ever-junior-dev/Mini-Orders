// src/lib/api.ts
// One shared fetch wrapper for every call to the backend server.

// Read from .env.local. NEXT_PUBLIC_ = the browser is allowed to see it.
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export default async function apiFetch<T>(
  path: string, options: RequestInit = {}
): Promise<T> { 
  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...options.headers },
  });

  // Turn 400 / 404 / 500 into a real error, so callers can catch it
  if (!response.ok) throw new Error(`HTTP ${response.status}`);

  // 204 = "done, nothing to send back" (e.g. after DELETE)
  if (response.status === 204) return undefined as T;

  return response.json();
}
  // T is a placeholder type.
  // apiFetch<Order>(...)    -> T = Order    -> you get back one Order
  // apiFetch<Order[]>(...)  -> T = Order[]  -> you get back a list of Orders
  // Promise<T>: the return type

  // When ...options.headers matters
  // apiFetch<Order[]>("/api/orders", {
  //   method: "POST",
  //   body: '{"customer":"Zoe","quantity":3}',
  //   headers: { Authorization: "Bearer abc123" },
  // });
  // fetch receives:
  // {
  //   method : "POST",
  //   body: '{"customer":"Zoe","quantity":3}',
  //   headers: {
  //     "Content-Type": "application/json",   // ours
  //     Authorization: "Bearer abc123",        // the caller's, merged in
  //   },
  // }

