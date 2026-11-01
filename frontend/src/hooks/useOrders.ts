// src/hooks/useOrders.ts
// The waiter: holds the orders list and the actions on it.
// Components call addOrder / removeOrder and never touch the service directly.
import { useCallback, useEffect, useReducer } from "react";
import type { NewOrder, Order } from "@/types/order";
import { createOrder, deleteOrder, getOrders } from "@/services/order.service";

// 1. State shape
interface OrdersState {
  orders: Order[];
  loading: boolean;
  error: string | null;
}

// 2. All allowed actions. Some carry data with them.
type OrdersAction =
  | { type: "loaded"; orders: Order[] }
  | { type: "failed"; error: string }
  | { type: "added"; order: Order }
  | { type: "removed"; id: number };

// 3. Reducer: (old state + action) -> new state
function ordersReducer(state: OrdersState, action: OrdersAction): OrdersState {
  switch (action.type) {
    case "loaded":
      return { orders: action.orders, loading: false, error: null };
    case "failed":
      return { ...state, loading: false, error: action.error };
    case "added":
      return { ...state, orders: [...state.orders, action.order] };
    case "removed":
      return { ...state, orders: state.orders.filter((order) => order.id !== action.id) };
    default:
      return state;
  }
}
// That reducer only changes the browser’s copy of the list, which is the state in RAM.

const initialState: OrdersState = { orders: [], loading: true, error: null };

export default function useOrders() {
  const [state, dispatch] = useReducer(ordersReducer, initialState);
  // useReducer(ordersReducer, initialState)
  //           │              └─ the starting value: { orders: [], loading: true, error: null }
  //           └─ the rulebook: how each action changes the state

  // returns [state, dispatch]
  //         │      └─ the function you call to hand the teller a slip
  //         └─ the current value (starts as initialState)

  // 4. Fetch once, when the page first appears
  useEffect(() => {
    let ignore = false; // set to true by the cleanup below
    // 0.0s  You open /orders        -> effect runs, ignore = false, mock starts its 0.5s wait
    // 0.2s  You click to go Home    -> the page disappears -> React calls cleanup -> ignore = true
    // 0.5s  Mock answers [Mia, Leo, Ava]
    //       -> if (!ignore) dispatch(...)   -> ignore is true 
    //       -> skipped updating a page that no longer exists ✅

    async function load() {
      try {
        const orders = await getOrders(); 
        if (!ignore) dispatch({ type: "loaded", orders });
      } catch (caughtError) {
        if (!ignore) dispatch({ type: "failed", error: (caughtError as Error).message });
      }
    }

    load();
    return () => {
      ignore = true; // cleanup: throw away a late answer
    };
  }, []);
  // useEffect( () => { ...the job... },  [] )
  //          └─ what to run              └─ empty list = run only once, after the first draw

  // 5. Actions. useCallback keeps the SAME function between renders (pays off in Part 7)
  const addOrder = useCallback(async (input: NewOrder) => {
    const order = await createOrder(input); // a validation error is thrown to the caller (Part 5 form)
    dispatch({ type: "added", order });
  }, []); // dependency list: [] = keep this same function forever

  const removeOrder = useCallback(async (id: number) => {
    await deleteOrder(id);   // 1. changes the DATA   (mock array now, backend server's DB 
    dispatch({ type: "removed", id });  // 2. changes the SCREEN (state in browser RAM)
  }, []);
  // useCallback remembers a function forever, so it doesn't need to be recreated every time the component renders.
  // useMemo remembers a value forever

  return {
    orders: state.orders,
    loading: state.loading,
    error: state.error,
    addOrder,
    removeOrder,
  };
}

