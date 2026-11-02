// src/components/orders/OrderForm.tsx
"use client"; // this file calls hooks itself, so it marks itself

import { useRef, useState } from "react";
import type { NewOrder } from "@/types/order";

interface OrderFormProps {
  onAdd: (input: NewOrder) => Promise<void>; // addOrder from useOrders
}

export default function OrderForm({ onAdd }: OrderFormProps) {
  // Controlled inputs: state is the single source of truth
  const [customer, setCustomer] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);

  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState<boolean>(false);

  // Points at the real <input> element, so we can focus it
  const customerInputRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); // stop the page from reloading
    setSaving(true);
    setError(null);

    try {
      await onAdd({ customer, quantity });
      // Success: clear the form, put the cursor back in "Customer"
      setCustomer("");
      setQuantity(1);
      customerInputRef.current?.focus();
    } catch (caughtError) {
      // The mock (pretend backend server) rejected it, e.g. "Customer is required"
      setError((caughtError as Error).message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="card order-form" onSubmit={handleSubmit}>
      <div className="field field-grow">
        <label htmlFor="customer">Customer</label>
        <input
          id="customer"
          ref={customerInputRef}
          value={customer}
          onChange={(event) => setCustomer(event.target.value)}
        />
      </div>

      <div className="field field-quantity">
        <label htmlFor="quantity">Quantity</label>
        <input
          id="quantity"
          type="number"
          value={quantity}
          onChange={(event) => setQuantity(Number(event.target.value))}
        />
      </div>

      <button type="submit" disabled={saving}>
        {saving ? "Adding..." : "Add order"}
      </button>

      {error && <p className="error-text">{error}</p>}
    </form>
  );
}

// customerInputRef           -> { current: <input id="customer" /> }   the box
// customerInputRef.current   ->   <input id="customer" />              what's inside the box
// ?. checks whether the box is empty (null): yes -> stop, do nothing, no  -> call focus()