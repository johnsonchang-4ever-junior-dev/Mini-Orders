// src/app/orders/error.tsx
// Shown automatically when anything under /orders throws while rendering.
"use client"; // error boundaries must be Client Components

import { useEffect } from "react";

interface ErrorPageProps {
  error: unknown;     // what was thrown
  retry: () => void;  // Next.js: fetch + render this part again
}

export default function OrdersError({ error, retry }: ErrorPageProps) {
  // Log the real error for developers (browser console)
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main>
      <h1>Something went wrong</h1>
      <p className="error-text">We couldn&apos;t load this order.</p>
      <button type="button" onClick={() => retry()}>
        Try again
      </button>
    </main>
  );
}

// Trty orders/2k and you will see this error page