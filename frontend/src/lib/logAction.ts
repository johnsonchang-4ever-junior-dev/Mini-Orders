// src/lib/logAction.ts
// Records one user action as a JSON event.
// No NEXT_PUBLIC_EVENTS_URL -> print it in the browser console (dev, no backend yet)
// With NEXT_PUBLIC_EVENTS_URL -> send it to the backend server (later)

const EVENTS_URL = process.env.NEXT_PUBLIC_EVENTS_URL;

export default function logAction(action: string, details: Record<string, string | undefined> = {}) {
  const event = {
    action,                            // e.g. "delete-order"
    details,                           // e.g. { orderId: "2" }
    path: window.location.pathname,    // e.g. "/orders"
    time: new Date().toISOString(),    // e.g. "2026-11-02T07:40:00.000Z"
  };

  if (!EVENTS_URL) {
    console.info("[action]", JSON.stringify(event));
    return;
  }

  // sendBeacon: fire-and-forget, still delivered if the user leaves the page
  navigator.sendBeacon(EVENTS_URL, JSON.stringify(event));
}