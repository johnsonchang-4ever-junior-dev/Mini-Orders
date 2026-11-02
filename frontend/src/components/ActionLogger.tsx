// src/components/ActionLogger.tsx
// ONE click listener for the whole site. Any element with data-action gets logged.
"use client"; // this file calls a hook itself, so it marks itself

import { useEffect } from "react";
import logAction from "@/lib/logAction";

export default function ActionLogger() {
  useEffect(() => {
    function handleClick(event: MouseEvent) {
      // Walk up from what was clicked to the nearest element with data-action
      const target = event.target as HTMLElement;
      const element = target.closest<HTMLElement>("[data-action]"); // find the closest element with data-action (where it started from)
      if (!element) return; // a click on something we don't track

      // data-action="delete-order" data-order-id="2"
      // -> dataset = { action: "delete-order", orderId: "2" }
      const { action, ...details } = element.dataset;
      if (action) logAction(action, details);
    }

    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick); // cleanup
    };
  }, []);

  return null; // draws nothing; it only listens
}


// ActionLogger isn’t a Provider. 
// ActionLogger doesn’t accept children, so it doesn’t need to wrap them. 
// It listens on document, which already covers the whole page.

// click Delete (Leo)
// -> <button data-action="delete-order">
// -> <div class="order-actions">
// -> <li class="card order-item">
// -> <ul class="order-list">
// -> <main>
// -> <body>
// -> <html>
// -> document   <- ActionLogger's ONE listener hears it here