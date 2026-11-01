// src/app/orders/page.tsx  ->  URL: /orders
import { getOrders } from "@/services/order.service";
import OrderList from "@/components/orders/OrderList";

// TEMPORARY: async Server Component. Part 4 swaps this for the useOrders hook.
export default async function OrdersPage(): Promise<React.ReactElement> {
  const orders = await getOrders(); // waits ~0.5s for the mock
  
  return (
    <main>
      <h1>Orders</h1>
      <OrderList orders={orders} />
    </main>
  );
}