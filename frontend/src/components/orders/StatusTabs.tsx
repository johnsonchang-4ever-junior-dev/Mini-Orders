// src/components/orders/StatusTabs.tsx
"use client"; // this file calls a hook itself, so it marks itself

import { useTransition } from "react";
import type { StatusFilter } from "@/types/order";

const TABS: StatusFilter[] = ["all", "pending", "shipped", "cancelled"];

interface StatusTabsProps {
  value: StatusFilter;
  onChange: (tab: StatusFilter) => void;
}

export default function StatusTabs({ value, onChange }: StatusTabsProps) {
  const [isPending, startTransition] = useTransition();

  function selectTab(tab: StatusFilter) {
    // Mark the list update as "not urgent", so the click stays snappy
    startTransition(() => {
      onChange(tab);
    });
  }

  return (
    <div className="status-tabs">
      {TABS.map((tab) => (
        <button
          key={tab}
          type="button"
          className={tab === value ? "tab tab-active" : "tab"}
          aria-pressed={tab === value}
          onClick={() => selectTab(tab)}
        >
          {tab}
        </button>
      ))}
      {isPending && <span className="muted">Updating...</span>}
    </div>
  );
}

// 1. Click "shipped"  -> startTransition(() => setStatus("shipped"))
//                        screen: "all" blue, old list          (old)
// 2. Background render starts, status = "shipped":
//    -> OrdersPage runs
//    -> useMemo filters -> [Leo]
//    -> <StatusTabs value="shipped" />  -> "shipped" tab gets tab-active
//    -> <OrderList orders={[Leo]} />
//                        screen: STILL "all" blue, old list, "Updating..."
// 3. Background render done -> React swaps the screen in one go
//                        screen: "shipped" blue, [Leo]          (new)