// src/app/orders/page.tsx  ->  URL: /orders
"use client"; // this page uses a hook, so it runs in the browser

import { useDeferredValue, useMemo, useState } from "react";
import type { StatusFilter } from "@/types/order";
import useOrders from "@/hooks/useOrders";
import OrderList from "@/components/orders/OrderList";
import OrderForm from "@/components/orders/OrderForm";
import SearchBox from "@/components/orders/SearchBox";
import StatusTabs from "@/components/orders/StatusTabs";
import Pagination from "@/components/orders/Pagination";

const PAGE_SIZE = 10; // orders per page


export default function OrdersPage() {
  const { orders, loading, error, addOrder, removeOrder } = useOrders();

  // What the user picked
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [currentPage, setCurrentPage] = useState(1);

  // The input updates instantly; the list uses this "lagging" copy
  const deferredSearch = useDeferredValue(search);
  const isStale = search !== deferredSearch; // true while the list is catching up

  // Re-filter ONLY when orders, deferredSearch or status change
  const visibleOrders = useMemo(() => {
    const searchText = deferredSearch.trim().toLowerCase();
    return orders.filter(
      (order) =>
        (status === "all" || order.status === status) &&
        order.customer.toLowerCase().includes(searchText)
    );
  }, [orders, deferredSearch, status]);

  // Pagination: work out which 10 orders to show
  const totalPages = Math.max(1, Math.ceil(visibleOrders.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages); // e.g. after deleting the last order on page 2
  const pageOrders = visibleOrders.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  // A new search or tab starts again at page 1
  function handleSearchChange(text: string) {
    setSearch(text);
    setCurrentPage(1);
  }

  function handleStatusChange(tab: StatusFilter) {
    setStatus(tab);
    setCurrentPage(1);
  }

  return (
    <main>
      <h1>Orders</h1>
      <OrderForm onAdd={addOrder} />
      <div className="toolbar">
        <SearchBox value={search} onChange={handleSearchChange} />
        <StatusTabs value={status} onChange={handleStatusChange} />
      </div>
      {loading && <p className="muted">Loading orders...</p>}
      {error && <p className="error-text">Error: {error}</p>}
      {!loading && !error && (
        <div className={isStale ? "stale" : undefined}> 
          <OrderList orders={pageOrders} totalCount={visibleOrders.length} onDelete={removeOrder} />
          <Pagination currentPage={safePage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
      )}
    </main>
  );
}
// click Delete on Mia -> onDelete(1) -> removeOrder(1)
// -> await deleteOrder(1)                       (0.5s mock wait)
// -> dispatch({ type: "removed", id: 1 })       (slip queued)
// -> React re-runs OrdersPage
//    -> useOrders() -> useReducer
//       -> ordersReducer runs: keeps orders where id !== 1 -> [Leo, Ava]
//       -> saved in OrdersPage's slot 1
//    -> page passes [Leo, Ava] to OrderList -> 2 OrderItems
// -> React compares by key: 1 gone, 2 and 3 the same
// -> removes ONLY Mia's <li> from the real page

// return orders.filter((order) => condition1 && condition2);
// Keeps only the orders where both conditions are true.


// For 3 orders,  Using `search` directly works fine:
// const searchText = search.trim().toLowerCase();   // no deferred copy
// `useDeferredValue`is for thousands of orders. 
// If each re-render of the list takes 300 ms (a big list). You type `L`, `e`, `o` quickly.

// Without `useDeferredValue`, one render does both jobs:

// type "L" -> render: input + list (300ms)  -> the box shows "L" only after 300ms
// type "e" -> render: input + list (300ms)  -> "Le" after another 300ms
// type "o" -> render: input + list (300ms)  -> "Leo" after another 300ms

// The input freezes while you type It feels broken.

// With `useDeferredValue`, React splits the work into 2 renders:

// Render 1 (urgent, cheap): update the input only        -> "L" shows instantly
// Render 2 (background, slow): redraw the list with "L"  -> 300ms, but it can be interrupted

// 0ms    type "L" -> Render 1: box shows "L" instantly
//                -> Render 2 starts: list for "L" (needs 300ms)
// 100ms  type "e" -> React STOPS the "L" list half-way (throws it away)
//                -> Render 1: box shows "Le" instantly
//                -> Render 2 starts again: list for "Le"
// 400ms  you stop typing -> the "Le" list finishes -> the list shows [Leo]



// useMemo works visibleOrders out while the page is drawing. 
// Only needed when you have more than 1000 orders.
// useEffect only runs after the page has been drawn, which is too late.
// useEffect way:
// Render 1 -> status = "shipped", but visibleOrders is still [Mia, Leo, Ava]  -> draws WRONG list
// Effect   -> setVisibleOrders([Leo])
// Render 2 -> draws [Leo]                                                    -> 2 renders, a flash of wrong data

// useMemo way:
// Render 1 -> status = "shipped" -> useMemo filters right now -> [Leo]       -> 1 render, correct first time 

// className={tab === value ? "tab tab-active" : "tab"}
//         is this tab the one the page says is chosen?
//         yes -> "tab tab-active" (blue fill)   no -> "tab" (outline, text-primary)