```user
Plan a project for me about NextJs But build only Frontend(with docker) now and help me study Web UI. Plan a project that practice and spin up the frontend using local host. 

I want this project use every skill at least once in this practice project is enough. 
Don't over complicate it. Make it as lean as possible, don't use same  easyreact skill 100 times and other important 0 times.
You can use the code I provide you. 
Plan it now and tell me what's your the Frontend project plan.
```

Do you mean: "Plan a Next.js project for me. For now, build only the frontend (with Docker) so I can study web UI. It should run on localhost."

## The project: "Mini Orders" 🛒

It's the **dining room only** from your restaurant plan. The kitchen (backend) comes later.

There's no backend yet, so the frontend uses a **pretend kitchen**: a mock service that keeps orders in memory. When the real backend exists, you change **one env variable** and nothing else.

```
USE_MOCK=true  -> services read/write an in-memory array
USE_MOCK=false -> services call NEXT_PUBLIC_API_URL (real backend later)
```

**Screens (only 3):**
- `/` is the home page: total orders and a link. It's a Server Component.
- `/orders` lists orders with search, status tabs, an add form and delete buttons.
- `/orders/[id]` shows one order's details.

## Router choice ⚠️

I picked the **App Router**, because the Server Components and App Router lessons (Part 3) only work there, and `loading.tsx` and `error.tsx` come from your plan. All your Pages Router hook code still works; it just needs `"use client"` at the top.

If you'd rather match your material and use the Pages Router, the trade-off is losing Part 3 practice. Tell me before Step 1.

## Folder structure (lean)

```
mini-orders/
├── docker-compose.yml           # 1 service: frontend on localhost:3000
├── .gitignore
└── frontend/
    ├── src/
    │   ├── app/
    │   │   ├── layout.tsx       # frame + ThemeProvider
    │   │   ├── providers.tsx    # "use client" wrapper for context
    │   │   ├── page.tsx         # home (Server Component, async)
    │   │   ├── globals.css
    │   │   └── orders/
    │   │       ├── page.tsx     # orders screen
    │   │       ├── loading.tsx  # auto loading UI
    │   │       ├── error.tsx    # auto error UI
    │   │       └── [id]/page.tsx
    │   ├── components/
    │   │   ├── OrderList.tsx
    │   │   ├── OrderItem.tsx
    │   │   ├── OrderForm.tsx
    │   │   ├── SearchBox.tsx
    │   │   ├── StatusTabs.tsx
    │   │   └── ThemeToggle.tsx
    │   ├── context/ThemeContext.tsx
    │   ├── hooks/useOrders.ts
    │   ├── services/order.service.ts
    │   ├── types/order.ts
    │   └── lib/api.ts
    ├── tests/OrderList.test.tsx
    ├── .env.local / .env.example
    ├── Dockerfile / .dockerignore
    └── next.config.ts           # output: "standalone"
```

## How one click flows

```
Click "Add" in OrderForm
-> useOrders.addOrder()        (custom hook)
-> dispatch({ type: "add" })   (useReducer updates the list)
-> order.service.createOrder() (mock or real API)
-> lib/api.ts                  (only used when USE_MOCK=false)
-> OrderList re-renders with the new order
```

## Build steps (one per session, you say "next")

1. **Scaffold.** Run `npx create-next-app@latest` with TypeScript and the App Router, and add `types/order.ts`.
2. **Static UI.** Build `layout.tsx`, `OrderItem` and `OrderList` with hardcoded data. This covers TSX, components, the component tree, props, fragments and keys.
3. **Mock data layer.** Add `services/` and `lib/api.ts`, plus the env switch in `.env.local`.
4. **Custom hook.** Write `useOrders.ts` using useReducer, useEffect (fetch + cleanup) and useCallback.
5. **Form.** Build `OrderForm` as a controlled input with events, conditional error text and useRef auto-focus.
6. **Search and tabs.** `SearchBox` uses useDeferredValue, `StatusTabs` uses useTransition, and a useMemo filter connects them.
7. **Theme.** Add `ThemeContext` and `ThemeToggle` with useContext, plus `memo(OrderItem)`.
8. **App Router extras.** Make the home page an async Server Component, and add `[id]` dynamic params, `loading.tsx` and `error.tsx`.
9. **Quality.** Write one React Testing Library test, check labels and `htmlFor` for accessibility, and fix any rules-of-hooks mistakes.
10. **Docker.** Write a multi-stage `Dockerfile`, then run `docker compose up` and open `http://localhost:3000`.

## Skill coverage (each used once)

| Skill | Where it lives |
|---|---|
| TSX `{}` | `OrderItem.tsx` |
| Functional components | every component |
| Component tree | `orders/page.tsx` → List → Item |
| Props (read-only) | `OrderItem` receives `order` |
| Events | delete button `onClick`, form `onSubmit` |
| Conditional rendering | empty list message, form error |
| Controlled form | `OrderForm.tsx` |
| Fragments + keys | `OrderList.tsx` |
| `useState` | `OrderForm` input value |
| `useEffect` + cleanup | `useOrders` initial fetch (`ignore` flag) |
| `useRef` | `OrderForm` focus after submit |
| `useMemo` | filtered orders in `orders/page.tsx` |
| `useCallback` + `memo` | `onDelete` → `memo(OrderItem)` |
| `useContext` | `ThemeContext` + `ThemeToggle` |
| `useReducer` | orders list inside `useOrders` |
| `useDeferredValue` | `SearchBox` |
| `useTransition` | `StatusTabs` |
| Custom hook | `useOrders.ts` |
| Rules of hooks | Step 9 review |
| Fetching data / async | `services/` + `lib/api.ts` |
| Env variables | `USE_MOCK`, `NEXT_PUBLIC_API_URL` |
| Server Component | `app/page.tsx` (async) |
| Dynamic route | `orders/[id]/page.tsx` |
| `loading.tsx` / Suspense | `orders/loading.tsx` |
| `error.tsx` | `orders/error.tsx` |
| Testing | `tests/OrderList.test.tsx` |
| Docker | `Dockerfile` + `docker-compose.yml` |

```user
Guide me and to teach me build the project.  Explain step by step, break it down into parts. tell me how many parts you have and give me the part 1, when I say 'move on' move on to the next part. 

should I start with Create docker file and run the image? or creating folders using command line?
```

Do you mean: "Guide me and teach me to build the project. Explain it step by step and break it into parts. Tell me how many parts there are and give me Part 1. When I say 'move on', go to the next part. Should I start by creating the Dockerfile and running the image, or by creating folders with the command line?"

**Start with the command line, and do Docker last.** Docker is a lunchbox 🍱 for your app: you need to cook the food (the app) before there's anything to pack. If you write the Dockerfile first, it would package an empty folder.

There are **10 parts**, matching the plan:

1. **Scaffold** ← now
2. Static UI
3. Mock data layer
4. Custom hook
5. Form
6. Search and tabs
7. Theme
8. App Router extras
9. Quality
10. Docker

# Part 1: Scaffold 🏗️

**Goal:** a running Next.js app on `localhost:3000`, empty folders ready, and your first real file (`types/order.ts`).

## Step 1: Check your tools

```bash
node -v      # look for v20 or higher
npm -v       # any number is fine
git --version
```

If Node is below 20, update it first (from nodejs.org, or `brew install node` on a Mac).

## Step 2: Clone your empty repo

```bash
cd ~/Projects          # or wherever you keep code
git clone https://github.com/johnsonchang-4ever-junior-dev/Mini-Orders.git
cd Mini-Orders
```

You'll see a warning, "You appear to have cloned an empty repository". That's normal. ✅

## Step 3: Create the frontend

```bash
npx create-next-app@latest frontend \
  --typescript --eslint --app --src-dir \
  --no-tailwind --import-alias "@/*" --use-npm
```

What each flag means:
- `frontend` makes the app inside a folder called `frontend/`, which leaves room for `backend/` later.
- `--typescript` gives you `.tsx` files instead of `.jsx`.
- `--eslint` adds a code checker that warns about mistakes, including breaking the rules of hooks.
- `--app` chooses the App Router.
- `--src-dir` puts your code inside `src/`.
- `--no-tailwind` means you'll use plain CSS, so there's one less thing to learn.
- `--import-alias "@/*"` lets you write `@/types/order` instead of `../../types/order`.

If it asks any other question (such as Turbopack or React Compiler), press **Enter** to accept the default.

## Step 4: Look at what you got

```
frontend/
├── src/app/
│   ├── layout.tsx      # frame around every page
│   ├── page.tsx        # home page at "/"
│   ├── page.module.css # styles for the starter page (unused soon)
│   └── globals.css     # site-wide styles
├── public/             # images, served as-is
├── .gitignore          # already ignores node_modules, .next, .env*
├── next.config.ts
├── package.json
└── tsconfig.json
```

## Step 5: Run it

```bash
cd frontend
npm run dev
```

Open `http://localhost:3000`. **Look for:** the Next.js starter page. Press `Ctrl + C` in the terminal to stop the server.

## Step 6: Replace the starter page

Open `frontend/src/app/page.tsx`.

**Old:** the whole `Home` function (and its imports at the top).

**New:**
```tsx
// src/app/page.tsx
// The home page at "/". No "use client", so it's a Server Component.
export default function Home() {
  const appName = "Mini Orders";   // a plain TS variable

  return (
    <main>
      {/* {} switches to "code mode" inside TSX */}
      <h1>Welcome to {appName} 🛒</h1>
    </main>
  );
}
```

Run `npm run dev` again. **Look for:** "Welcome to Mini Orders 🛒".

## Step 7: Create the empty folders

From inside `frontend/`:

```bash
mkdir -p src/components src/hooks src/services src/types src/lib src/context tests
```

`-p` means "make parent folders too, and don't complain if they already exist".

⚠️ Git **doesn't track empty folders**, so they won't appear on GitHub until they hold a file. That's normal.

## Step 8: Your first real file, `types/order.ts`

**Why first:** every other layer (services, hooks, components) needs to agree on what an "order" looks like. It's the **menu description** 📐 everyone reads from.

Create `frontend/src/types/order.ts`:

```ts
// src/types/order.ts

// The 3 allowed statuses. A "union type": only these exact strings are allowed.
export type OrderStatus = "pending" | "shipped" | "cancelled";

// One full order, as the backend (or mock) sends it back
export interface Order {
  id: number;
  customer: string;
  quantity: number;
  status: OrderStatus;
  createdAt: string;    // ISO date text, e.g. "2026-10-31T10:00:00Z"
}

// What the form sends when creating an order.
// Omit<...> = "Order, minus these fields", because the server decides
// id, status and createdAt, not the user.
export type NewOrder = Omit<Order, "id" | "status" | "createdAt">;
```

```
Order    = { id, customer, quantity, status, createdAt }
NewOrder = { customer, quantity }   <- Omit removed 3 fields
```

## Step 9: First commit and push

From the `Mini-Orders/` root:

```bash
cd ..
git add .
git commit -m "Scaffold Next.js frontend and add Order types"
git push -u origin main
```

**Look for:** GitHub showing `frontend/`, and no `node_modules/` folder (the `.gitignore` blocked it ✅).

When it's pushed, say **"move on"**. I'll check your repo, then start Part 2 (Static UI).

| Part | Name | Skills you'll practise |
|---|---|---|
| 1 | Scaffold | CLI, TSX `{}`, TypeScript types, Git |
| 2 | Static UI | components, tree, props, fragments, keys |
| 3 | Mock data layer | services, fetch wrapper, env vars |
| 4 | Custom hook | `useReducer`, `useEffect` + cleanup, `useCallback` |
| 5 | Form | controlled form, events, conditionals, `useRef` |
| 6 | Search and tabs | `useDeferredValue`, `useTransition`, `useMemo` |
| 7 | Theme | `useContext`, `memo` |
| 8 | App Router extras | Server Component, `[id]`, `loading.tsx`, `error.tsx` |
| 9 | Quality | testing, accessibility, rules of hooks |
| 10 | Docker | Dockerfile, compose, `localhost:3000` |

```user
oh, all the UI will be able to be in Dark Mode with toggles.

Design the UI with light and dark mode using semantic colour tokens as CSS variables.

Rules:
1. Name tokens by role, not colour: --background, --surface, --surface-raised,
   --text-primary, --text-secondary, --border, --accent, --accent-text,
   --danger, --success.
2. Components must only use these tokens. No raw hex values inside components.
3. Light mode is the default in :root. Dark mode overrides the same tokens
   (via prefers-color-scheme and a [data-theme="dark"] attribute for a manual toggle).
4. Dark mode: no pure black (#000) or pure white (#fff) for main surfaces/text.
   Use dark greys like #121212 and off-white text like #ededed.
5. Show elevation in dark mode with lighter surfaces, not shadows.
6. Desaturate/lighten accent colours in dark mode so they don't glow.
7. Keep text contrast at WCAG AA (4.5:1 for normal text) in both modes.
8. Don't invert images or logos.
9. Set `color-scheme: light dark` so native inputs and scrollbars match.

```
Do you mean: "All the UI should support dark mode with a toggle."

This fits the plan without adding a part:
- **Part 1** gets one more step (Step 10): write the colour tokens in `globals.css` now, so every component from Part 2 onwards uses them.
- **Part 7** builds the toggle button, which sets `data-theme="dark"` on `<html>`.

## How the tokens work 🎨

**Analogy:** A theatre 🎭. Components are actors who are told "stand in the *spotlight*", not "stand in the yellow light". Switching to dark mode changes what the spotlight colour *is*, and no actor needs new instructions.

```
Component uses var(--surface)
-> :root says --surface = #ffffff                       (light, default)
-> prefers-color-scheme: dark says --surface = #1e1e1e  (follows the OS)
-> [data-theme="dark"] says --surface = #1e1e1e         (your toggle wins)
```

Which theme wins:
1. You clicked the toggle → `data-theme` decides.
2. You didn't click → your computer's setting decides.
3. No setting → light.

## Step 10: Write the tokens

Open `frontend/src/app/globals.css`.

**Old:** everything in the file. It's only the starter's two variables (`--background`, `--foreground`), a dark-mode block for them and some body styles. Nothing you wrote is lost.

**New:**
```css
/* src/app/globals.css
   Semantic colour tokens: named by ROLE, not colour.
   Components only use var(--token). No raw hex values outside this file. */

/* ---------- 1. LIGHT (the default) ---------- */
:root {
  --background: #f5f6f8;      /* page behind everything */
  --surface: #ffffff;         /* cards, panels */
  --surface-raised: #ffffff;  /* things above cards: menus, dialogs */
  --text-primary: #1a1d23;    /* main text */
  --text-secondary: #555b66;  /* hints, dates, labels */
  --border: #d8dce3;          /* dividers, input outlines */
  --accent: #2f5bd3;          /* buttons, links, focus ring */
  --accent-text: #ffffff;     /* text ON an accent button */
  --danger: #b42318;          /* delete, errors */
  --success: #1e7a3c;         /* shipped, saved */

  /* Light mode shows height with SHADOWS */
  --shadow: 0 1px 3px rgb(0 0 0 / 0.12);

  /* Native inputs and scrollbars can follow either mode */
  color-scheme: light dark;
}

/* ---------- 2. DARK: follow the OS, unless the user forced light ---------- */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --background: #121212;     /* dark grey, not pure black */
    --surface: #1e1e1e;        /* one step lighter = higher up */
    --surface-raised: #2a2a2a; /* two steps lighter = even higher */
    --text-primary: #ededed;   /* off-white, not pure white */
    --text-secondary: #a8adb6;
    --border: #3a3d42;
    --accent: #8aa8f0;         /* softer, lighter blue so it doesn't glow */
    --accent-text: #121212;    /* dark text on the light-blue button */
    --danger: #f28b82;
    --success: #81c995;
    --shadow: none;            /* dark mode shows height with LIGHTER surfaces */
  }
}

/* ---------- 3. DARK: the manual toggle (Part 7) ---------- */
:root[data-theme="dark"] {
  --background: #121212;
  --surface: #1e1e1e;
  --surface-raised: #2a2a2a;
  --text-primary: #ededed;
  --text-secondary: #a8adb6;
  --border: #3a3d42;
  --accent: #8aa8f0;
  --accent-text: #121212;
  --danger: #f28b82;
  --success: #81c995;
  --shadow: none;
  color-scheme: dark;          /* native inputs match the toggle, not the OS */
}

:root[data-theme="light"] {
  color-scheme: light;
}

/* ---------- 4. Base styles: tokens only ---------- */
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 24px;
  background: var(--background);
  color: var(--text-primary);
  font-family: var(--font-geist-sans), system-ui, sans-serif;
}

/* Images and logos stay as they are: no filter: invert() */
img {
  max-width: 100%;
}

a {
  color: var(--accent);
}

/* A reusable card. Height comes from --shadow (light) or the surface colour (dark) */
.card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 16px;
  box-shadow: var(--shadow);
}

button {
  background: var(--accent);
  color: var(--accent-text);
  border: none;
  border-radius: 6px;
  padding: 8px 14px;
  cursor: pointer;
}

input,
select {
  background: var(--surface);
  color: var(--text-primary);
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 8px;
}

/* Visible keyboard focus in both modes */
:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}
```

**Why the dark block appears twice:** plain CSS can't say "media query **or** attribute" in one rule. Block 2 handles the OS setting, and block 3 handles your toggle. Part 7 explains a way to avoid the repeat if you're curious.

## Step 11: Test it before any toggle exists

1. Run `npm run dev` and open `http://localhost:3000`.
2. In Chrome, open DevTools (`Cmd + Option + I`), then press `Cmd + Shift + P`, type **"Rendering"**, and set **"Emulate CSS prefers-color-scheme"** to `dark`.
3. **Look for:** the page turning `#121212` grey with off-white text.
4. In the **Elements** tab, double-click `<html>` and add `data-theme="light"`. **Look for:** the page going light again, even though dark is emulated. That proves the manual override wins. ✅

Commit:
```bash
git add .
git commit -m "Add semantic light/dark colour tokens"
git push
```

## Contrast check (WCAG AA needs 4.5 or more)

I ran every text colour against every surface with the WCAG formula:

| Token used as text | Light: background / surface / raised | Dark: background / surface / raised |
|---|---|---|
| `--text-primary` | 15.6 / 16.9 / 16.9 ✅ | 16.0 / 14.2 / 12.3 ✅ |
| `--text-secondary` | 6.3 / 6.8 / 6.8 ✅ | 8.3 / 7.4 / 6.4 ✅ |
| `--accent` | 5.5 / 5.9 / 5.9 ✅ | 8.0 / 7.1 / 6.1 ✅ |
| `--danger` | 6.1 / 6.6 / 6.6 ✅ | 7.8 / 7.0 / 6.0 ✅ |
| `--success` | 5.0 / 5.4 / 5.4 ✅ | 9.6 / 8.5 / 7.3 ✅ |
| `--accent-text` on `--accent` | 5.9 ✅ | 8.0 ✅ |

```user
"What does it mean by server? frontend hook? backend controller?

Be clear next time, say backend server not just server while keep the comment minimal

Also, when you are using something like Omit<> that is easy concept but that's not from the material I provide

you need to leave a head up like ⚠️ and tell me this is not from "prompt material" I provide. 

before the code session

```
In that comment, "the server" meant **the backend server**: the kitchen you'll build later. For now, the **mock service** (Part 3) plays that role and decides `id`, `status` and `createdAt`. Sorry for the vague word. I'll name which server from now on, and add a ⚠️ before any code that uses something outside your material.

There are **two different servers** in this project, which is why the word was confusing:

```
Next.js frontend server  -> runs your pages (Server Components run here)
Backend server           -> owns the data (later; the mock stands in for now)
```

## Fix the comment in `frontend/src/types/order.ts`

⚠️ **Not from your prompt material:** `Omit<Type, "a" | "b">` is a built-in TypeScript helper. It means "copy this type, minus these fields". Your material only covers `interface` and union types (`"light" | "dark"`).

**Old:**
```ts
// What the form sends when creating an order.
// Omit<...> = "Order, minus these fields", because the server decides
// id, status and createdAt, not the user.
```

**New:**
```ts
// What the form sends to create an order.
// Omit removes id, status, createdAt: the backend server (mock for now) sets those.
```

```user
move on

```
# Part 2: Static UI 🧱

Your repo looks right: `types/order.ts`, the tokens in `globals.css`, and the new home page. You're on **Next.js 16.4** and **React 19.3**.

**Goal:** an `/orders` page showing 3 order cards built from **hardcoded** data. There's no clicking yet; that's Parts 4 and 5.

**The component tree you'll build:**
```
OrdersPage   (app/orders/page.tsx)   owns the data
└── OrderList   (props: orders)      decides "empty message" or "list"
    └── OrderItem × 3   (props: order)   draws one card
```

Data flows one way, like the lunchbox 🍱 from your notes:
```
OrdersPage -> orders -> OrderList -> order -> OrderItem
```

💡 None of these use hooks or `onClick`, so none need `"use client"`. They all stay Server Components, and the Next.js frontend server renders them to HTML.

## Step 1: `OrderItem.tsx` (the smallest piece first)

Create `frontend/src/components/OrderItem.tsx`.

⚠️ **Not from your prompt material:** `.slice(0, 10)` is a plain JavaScript string method that keeps the first 10 characters, turning `"2026-10-30T14:40:00Z"` into `"2026-10-30"`.

```tsx
// src/components/OrderItem.tsx
import type { Order } from "@/types/order";

// Props shape: this component receives ONE order
interface OrderItemProps {
  order: Order;
}

export default function OrderItem({ order }: OrderItemProps) {
  return (
    <li className="card order-item">
      <div>
        <strong>{order.customer}</strong>
        <p className="muted">
          Qty {order.quantity} · {order.createdAt.slice(0, 10)}
        </p>
      </div>
      {/* class becomes "status status-shipped", etc. */}
      <span className={`status status-${order.status}`}>{order.status}</span>
    </li>
  );
}
```

## Step 2: `OrderList.tsx`

Create `frontend/src/components/OrderList.tsx`:

```tsx
// src/components/OrderList.tsx
import type { Order } from "@/types/order";
import OrderItem from "./OrderItem";

interface OrderListProps {
  orders: Order[];   // a list of orders
}

export default function OrderList({ orders }: OrderListProps) {
  // Conditional rendering, Way 1: early return
  if (orders.length === 0) {
    return <p className="muted">No orders yet.</p>;
  }

  // Fragment: return 2 elements without an extra <div>
  return (
    <>
      <p className="muted">{orders.length} orders</p>
      <ul className="order-list">
        {orders.map((order) => (
          // key = a stable, unique id, so React can track each card
          <OrderItem key={order.id} order={order} />
        ))}
      </ul>
    </>
  );
}
```

## Step 3: the `/orders` page

```bash
mkdir -p src/app/orders
```

Create `frontend/src/app/orders/page.tsx`:

```tsx
// src/app/orders/page.tsx  ->  URL: /orders
import type { Order } from "@/types/order";
import OrderList from "@/components/OrderList";

// Temporary hardcoded data. Part 3 moves this into the mock service.
const sampleOrders: Order[] = [
  { id: 1, customer: "Mia", quantity: 2, status: "pending",   createdAt: "2026-10-29T09:15:00Z" },
  { id: 2, customer: "Leo", quantity: 5, status: "shipped",   createdAt: "2026-10-30T14:40:00Z" },
  { id: 3, customer: "Ava", quantity: 1, status: "cancelled", createdAt: "2026-10-31T08:05:00Z" },
];

export default function OrdersPage() {
  return (
    <main>
      <h1>Orders</h1>
      <OrderList orders={sampleOrders} />
    </main>
  );
}
```

## Step 4: Styles (tokens only)

⚠️ **Not from your prompt material:** `display: flex` lines things up in a row, and `display: grid` with `gap` stacks cards with even spacing. Both are standard CSS layout tools.

Paste this at the **bottom** of `frontend/src/app/globals.css`:

```css
/* ---------- 5. Orders list ---------- */
.muted {
  color: var(--text-secondary);
  margin: 4px 0 0;
}

.order-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 12px;
  max-width: 560px;
}

.order-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Status badge: the border uses the same colour as the text */
.status {
  font-size: 0.85rem;
  padding: 2px 8px;
  border-radius: 999px;
  border: 1px solid currentColor;
}

.status-pending   { color: var(--text-secondary); }
.status-shipped   { color: var(--success); }
.status-cancelled { color: var(--danger); }
```

## Step 5: Run and check

```bash
npm run dev
```

Open `http://localhost:3000/orders`. **Look for:**
- "3 orders", then 3 cards: **Mia** (grey "pending"), **Leo** (green "shipped") and **Ava** (red "cancelled").
- In emulated dark mode (DevTools → Rendering): cards a little **lighter** than the page, with no shadow.

## Step 6: Three experiments 🔮 (predict first, then save)

1. Change `sampleOrders` to `[]`. **Predict:** what text shows? Then undo.
2. Remove `key={order.id}` in `OrderList.tsx`. **Look for:** a warning about a missing "key" in the terminal or browser console. Then put it back.
3. Change Leo's `status` to `"lost"`. **Look for:** a red TypeScript error in VS Code, because `"lost"` isn't one of the 3 allowed statuses. Then undo.

## Step 7: Commit

```bash
cd ..
git add .
git commit -m "Add static orders page with OrderList and OrderItem"
git push
```

Say **"move on"** for Part 3 (Mock data layer).

| Skill | Where you used it |
|---|---|
| TSX `{}` | `{order.customer}`, `{orders.length}` |
| Functional components | `OrderItem`, `OrderList`, `OrdersPage` |
| Component tree | Page → List → Item |
| Props + interface | `OrderItemProps`, `OrderListProps` |
| Conditional rendering | empty-list early return |
| Fragment `<>` | `OrderList` return |
| Keys in lists | `key={order.id}` |
| Semantic tokens | `.status-*` and `.muted` classes |

```user

why not put the order component under 
components/order ?
```
You can, and it's a good habit. I left it flat only because this project has **6 components** and the plan said "lean". Flat is enough at this size.

**Analogy:** A bookshelf 📚. With 6 books you just line them up. With 60 you sort them by topic, or you can't find anything.

| | Flat `components/` | Grouped `components/orders/` |
|---|---|---|
| Good when | under ~10 components | many components, several features |
| Import | `@/components/OrderItem` | `@/components/orders/OrderItem` |
| This project | 5 order pieces + `ThemeToggle` | `orders/` (5) + `ThemeToggle` on its own |

A grouped version looks like this:
```
components/
├── orders/
│   ├── OrderList.tsx
│   ├── OrderItem.tsx
│   ├── OrderForm.tsx
│   ├── SearchBox.tsx
│   └── StatusTabs.tsx
└── ThemeToggle.tsx      # not about orders, so it stays outside
```

## If you want to switch now

1. Move the two files you've already made:
   ```bash
   cd frontend
   mkdir -p src/components/orders
   git mv src/components/OrderItem.tsx src/components/OrderList.tsx src/components/orders/
   ```
2. Fix the one import that changes, in `frontend/src/app/orders/page.tsx`:

   **Old:**
   ```tsx
   import OrderList from "@/components/OrderList";
   ```
   **New:**
   ```tsx
   import OrderList from "@/components/orders/OrderList";
   ```

The `import OrderItem from "./OrderItem";` line in `OrderList.tsx` stays the same, because both files moved together.

If you switch, tell me, and I'll use `components/orders/` paths in every later part.

```user
Yes I applied it. 
add extra rule, Only use Export Default when file only export 1 function, if Export 2 or more function, use Name Export. Never use hybrid Export .

```
Rule added. From now on:
- A file that exports **one** thing uses `export default`.
- A file that exports **2 or more** things uses named exports only.
- No file mixes the two.

## One clash you need to know about ⚠️

Next.js **requires** a default export in its special route files (`page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`). Your `layout.tsx` already mixes both, because the starter put them there:

```tsx
export const metadata: Metadata = { ... };             // named export
export default function RootLayout(...) { ... }        // default export
```

Next.js only reads `metadata` as a named export from that file, so it can't be moved somewhere else.

**My suggestion:** keep one exception, "Next.js route files follow Next.js rules". The only other way to follow your rule there is to delete the `metadata` export and lose the page title setup, which costs more than it's worth.

## How the rule maps onto the project

| File | Exports | Style |
|---|---|---|
| `types/order.ts` | `OrderStatus`, `Order`, `NewOrder` | named ✅ (already) |
| `components/orders/OrderItem.tsx` | `OrderItem` | default ✅ (already) |
| `components/orders/OrderList.tsx` | `OrderList` | default ✅ (already) |
| `services/order.service.ts` | `getOrders`, `getOrder`, `createOrder`, `deleteOrder` | named |
| `lib/api.ts` | `apiFetch` | default |
| `hooks/useOrders.ts` | `useOrders` | default |
| `context/ThemeContext.tsx` | `ThemeProvider`, `useTheme` | named |
| `app/layout.tsx` | `metadata` + `RootLayout` | Next.js exception |

All your files so far already follow the rule, and there's nothing to change.

```user
move on



```
# Part 3: Mock data layer 📮

**Goal:** move the hardcoded orders out of the page and into a **pretend backend server** (the mock). One env switch decides whether the app talks to the mock or to the real backend server later.

I ran this code here first, and `/orders` showed Mia, Leo and Ava. ✅

```
OrdersPage
-> getOrders()                  (services/order.service.ts)
   -> USE_MOCK true?  -> mock array in memory, wait 0.5s
   -> USE_MOCK false? -> apiFetch("/api/orders")  (lib/api.ts)
                          -> real backend server (later)
```

**Analogy:** A messenger 📮. Pages hand their message to the messenger. Today the messenger walks to a pretend kitchen down the hall; later, to the real one. The pages never notice the difference.

## ⚠️ Correction to my plan

The plan said `USE_MOCK`. That was wrong. Next.js only lets the **browser** read env variables starting with `NEXT_PUBLIC_`, and in Part 4 the browser calls this service. So the name is `NEXT_PUBLIC_USE_MOCK`.

## Step 1: Env files

Create `frontend/.env.local` (your real values, never committed):
```
NEXT_PUBLIC_USE_MOCK=true
NEXT_PUBLIC_API_URL=http://localhost:4000
```

Create `frontend/.env.example` (the same names, committed so others know what to set):
```
NEXT_PUBLIC_USE_MOCK=true
NEXT_PUBLIC_API_URL=http://localhost:4000
```

⚠️ The starter's `frontend/.gitignore` has `.env*`, which would **also hide `.env.example`** from Git. Add one line underneath it:

**Old:**
```
.env*
```
**New:**
```
.env*
!.env.example
```

`!` means "except this one".

## Step 2: `lib/api.ts` (the phone line ☎️)

This file has one export, so it uses `export default`.

⚠️ **Not from your prompt material:**
- `RequestInit` is TypeScript's built-in type for fetch options (`method`, `body`, `headers`).
- `...options.headers` uses the spread syntax you've seen in `{...pageProps}`, but on an object. It copies the caller's headers in **after** ours, so the caller can override them.
- `undefined as T` tells TypeScript "trust me, there's nothing to return".

Create `frontend/src/lib/api.ts`:
```ts
// src/lib/api.ts
// One shared fetch wrapper for every call to the backend server.

// Read from .env.local. NEXT_PUBLIC_ = the browser is allowed to see it.
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export default async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...options.headers },
  });

  // Turn 400 / 404 / 500 into a real error, so callers can catch it
  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  // 204 = "done, nothing to send back" (e.g. after DELETE)
  if (res.status === 204) return undefined as T;

  return res.json();
}
```

## Step 3: `services/order.service.ts` (the messenger)

This file has 4 exports, so it uses **named exports**.

⚠️ **Not from your prompt material:**
- `new Promise((resolve) => setTimeout(resolve, ms))` is a "sleep" that pauses an `async` function for `ms` milliseconds.
- `.find()` returns the first item that matches, or `undefined`.
- `.trim()` removes spaces at both ends, so `"  "` becomes `""`.
- `new Date().toISOString()` gives the time now as text, for example `"2026-11-01T05:07:00.000Z"`.
- `JSON.stringify()` turns an object into JSON text for the request body.
- `throw new Error(...)` inside an `async` function makes the caller's `await` fail. Your `useFetch` example catches errors like this with `try/catch`.

Create `frontend/src/services/order.service.ts`:
```ts
// src/services/order.service.ts
// The messenger: every order call goes through here.
// USE_MOCK = true  -> use the in-memory array below (pretend backend server)
// USE_MOCK = false -> call the real backend server through apiFetch
import type { NewOrder, Order } from "@/types/order";
import apiFetch from "@/lib/api";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";

// ---------- Mock data (only used when USE_MOCK is true) ----------
const MOCK_DELAY_MS = 500; // mock-only: pretend the network takes half a second

let mockOrders: Order[] = [
  { id: 1, customer: "Mia", quantity: 2, status: "pending",   createdAt: "2026-10-29T09:15:00Z" },
  { id: 2, customer: "Leo", quantity: 5, status: "shipped",   createdAt: "2026-10-30T14:40:00Z" },
  { id: 3, customer: "Ava", quantity: 1, status: "cancelled", createdAt: "2026-10-31T08:05:00Z" },
];
let nextId = 4;

// Wait ms milliseconds, then carry on
function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ---------- The 4 functions the rest of the app uses ----------

export async function getOrders(): Promise<Order[]> {
  if (USE_MOCK) {
    await wait(MOCK_DELAY_MS);
    return [...mockOrders]; // a copy, so callers can't change the mock by accident
  }
  return apiFetch<Order[]>("/api/orders");
}

export async function getOrder(id: number): Promise<Order> {
  if (USE_MOCK) {
    await wait(MOCK_DELAY_MS);
    const found = mockOrders.find((o) => o.id === id);
    if (!found) throw new Error(`Order ${id} not found`); // like a 404
    return found;
  }
  return apiFetch<Order>(`/api/orders/${id}`);
}

export async function createOrder(input: NewOrder): Promise<Order> {
  if (USE_MOCK) {
    await wait(MOCK_DELAY_MS);
    // Pretend backend server validation (like a 400 Bad Request)
    if (input.customer.trim() === "") throw new Error("Customer is required");
    if (input.quantity < 1) throw new Error("Quantity must be at least 1");

    // The backend server decides these 3 fields, not the user
    const order: Order = {
      ...input,
      id: nextId,
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    nextId += 1;
    mockOrders = [...mockOrders, order];
    return order;
  }
  return apiFetch<Order>("/api/orders", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function deleteOrder(id: number): Promise<void> {
  if (USE_MOCK) {
    await wait(MOCK_DELAY_MS);
    mockOrders = mockOrders.filter((o) => o.id !== id);
    return;
  }
  return apiFetch<void>(`/api/orders/${id}`, { method: "DELETE" });
}
```

💡 `MOCK_DELAY_MS` is a plain constant, not an env variable, because it only exists in the mock and is deleted when the real backend server arrives.

## Step 4: Use the service in the page

In `frontend/src/app/orders/page.tsx`:

**Old:** the `import type { Order } ...` line, the `sampleOrders` array, and `export default function OrdersPage()`.

**New:** the whole file becomes:
```tsx
// src/app/orders/page.tsx  ->  URL: /orders
import { getOrders } from "@/services/order.service";
import OrderList from "@/components/orders/OrderList";

// TEMPORARY: async Server Component. Part 4 swaps this for the useOrders hook.
export default async function OrdersPage() {
  const orders = await getOrders(); // waits ~0.5s for the mock

  return (
    <main>
      <h1>Orders</h1>
      <OrderList orders={orders} />
    </main>
  );
}
```

Making the page `async` lets it `await` data directly, which is a sneak peek at Part 8.

## Step 5: Run and check

⚠️ Restart the dev server after changing `.env.local`, because env values are read only when it starts.

```bash
# Ctrl + C to stop, then:
npm run dev
```

Open `http://localhost:3000/orders`. **Look for:**
1. The same 3 cards as Part 2, but the page takes about **half a second** to appear (that's the mock delay).
2. **Experiment 🔮:** set `NEXT_PUBLIC_USE_MOCK=false` and restart. **Predict** what happens, then check. You should see an error screen, because no backend server is listening on port 4000. Set it back to `true`.

## Step 6: Commit

```bash
git status            # look for: .env.example listed, .env.local NOT listed
cd ..
git add .
git commit -m "Add mock order service and apiFetch wrapper with env switch"
git push
```

⚠️ **One limitation to know before Part 4:** the mock array lives in memory, and there are **two copies**. The Next.js frontend server has one (used by Server Components), and each browser tab has one (used by Client Components). In Parts 4 to 8, an order added in the browser won't show up on pages that the Next.js frontend server renders. A real backend server fixes this, because both sides ask the same database.

Say **"move on"** for Part 4 (Custom hook).

| Skill | Where you used it |
|---|---|
| Fetching data / `async` | `apiFetch`, the 4 service functions |
| Env variables | `NEXT_PUBLIC_USE_MOCK`, `NEXT_PUBLIC_API_URL` |
| Generics `<T>` | `apiFetch<T>`, like your `useFetch<T>` |
| Error throwing | `!res.ok`, "not found", validation |
| Named vs default export | service = named (4), `api.ts` = default (1) |

A safety check said my copy of your repo had uncommitted changes. They were only my test copies of the Part 3 files, so I deleted them instead of committing.

I didn't push anything to your GitHub. You're typing the code yourself, and this session can only read your repo anyway. Your repo is still at your last commit, "Add static orders page with OrderList and OrderItem".

Part 3 above is unchanged and ready for you to build.

```user

store it into the setting. Always put the secret file name inside gitignore before creating it

and when you ask me to create files, give me 'touch' command line for it
```
Both rules are saved: secret file names go into `.gitignore` before the file exists, and every new file comes with a `touch` command.

Here's Part 3's **Step 1 redone** in that order, plus the `touch` commands for Steps 2 and 3. Everything else in Part 3 stays the same.

## Step 1 (redone): `.gitignore` first, then the env files

**1a. Protect the secret file before it exists.**

Open `frontend/.gitignore`. The starter's `.env*` line already hides `.env.local` (and every other `.env` file). Add one line to let `.env.example` through:

**Old:**
```
.env*
```
**New:**
```
.env*
!.env.example
```

**1b. Check it works before writing anything secret.** From inside `frontend/`:

```bash
touch .env.local .env.example
git status --short
```

**Look for:** `.env.example` listed and `.env.local` **not** listed. If `.env.local` shows up, stop and fix the `.gitignore` first.

**1c. Now fill them in.**

`frontend/.env.local`:
```
NEXT_PUBLIC_USE_MOCK=true
NEXT_PUBLIC_API_URL=http://localhost:4000
```

`frontend/.env.example`:
```
NEXT_PUBLIC_USE_MOCK=true
NEXT_PUBLIC_API_URL=http://localhost:4000
```

## Steps 2 and 3: create the empty files first

From inside `frontend/`:

```bash
mkdir -p src/lib src/services
touch src/lib/api.ts src/services/order.service.ts
```

Then paste in the code from Steps 2 and 3 as before.

```user
Store it into settings. don't use abbreviation e.g. o.id should be order.id
 res should be response

Now change the abbreviation you gave me into clearer version

const MOCK_DELAY_MS abbreviation is acceptable because it is math symbol. 
ms is easily to know it is milliseconds, so abbreviate it

```
I've saved the rule: full words inside functions, with unit abbreviations like `ms` allowed.

Part 3 has **4 changes** across 2 files. Part 2 already used full names (`order`), so it needs no change.

## `frontend/src/lib/api.ts`

**Old:**
```ts
  const res = await fetch(`${BASE_URL}${path}`, {
```
**New:**
```ts
  const response = await fetch(`${BASE_URL}${path}`, {
```

**Old:**
```ts
  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  // 204 = "done, nothing to send back" (e.g. after DELETE)
  if (res.status === 204) return undefined as T;

  return res.json();
```
**New:**
```ts
  if (!response.ok) throw new Error(`HTTP ${response.status}`);

  // 204 = "done, nothing to send back" (e.g. after DELETE)
  if (response.status === 204) return undefined as T;

  return response.json();
```

## `frontend/src/services/order.service.ts`

Inside `getOrder`:

**Old:**
```ts
    const found = mockOrders.find((o) => o.id === id);
    if (!found) throw new Error(`Order ${id} not found`); // like a 404
    return found;
```
**New:**
```ts
    const foundOrder = mockOrders.find((order) => order.id === id);
    if (!foundOrder) throw new Error(`Order ${id} not found`); // like a 404
    return foundOrder;
```

Inside `deleteOrder`:

**Old:**
```ts
    mockOrders = mockOrders.filter((o) => o.id !== id);
```
**New:**
```ts
    mockOrders = mockOrders.filter((order) => order.id !== id);
```

## Names I kept

- `wait(ms)` and `MOCK_DELAY_MS` use `ms`, the milliseconds unit, so they fit your rule.
- `id` and `nextId` match the `id` field in your `Order` type, so renaming them would break the match.
- `<T>` is the same generic letter as your material's `useFetch<T>`.

```user
cacheComponents: true, so should I add orders/loading.tsx and tell the page to use it now?

```
Yes, add it now. With `cacheComponents: true`, the async `/orders` page from Part 3 **won't build** without it. You don't need to tell the page to use it: Next.js finds `loading.tsx` by its file name and uses it on its own.

I tested your exact config (`cacheComponents: true` plus `partialPrefetching: true`) with the Part 3 code:
- **Without** `loading.tsx`, `npm run build` fails with: *"Route "/orders": Next.js encountered uncached or runtime data during prerendering … accessed outside of `<Suspense>`"*.
- **With** `loading.tsx`, the build passes, and `/orders` shows as `◐ Partial Prerender`.

## Why

**Analogy:** A restaurant menu board 🪧. With cache components on, Next.js prints the page ahead of time, at build time. It can't print the orders yet, because they arrive later (the 0.5 s mock wait). So it needs a **placeholder** card ("Loading orders…") to print in that spot until the real data streams in.

```
loading.tsx exists in app/orders/
-> Next.js wraps orders/page.tsx in <Suspense fallback={<Loading />}> for you
-> build: prints the page shell + "Loading orders..."
-> visit: the shell shows instantly, then the 3 orders replace the placeholder
```

## Add it

From inside `frontend/`:
```bash
touch src/app/orders/loading.tsx
```

`frontend/src/app/orders/loading.tsx`:
```tsx
// src/app/orders/loading.tsx
// Shown automatically while orders/page.tsx is waiting for data.
export default function Loading() {
  return <p className="muted">Loading orders...</p>;
}
```

**Look for:** open `http://localhost:3000/orders` and you'll see "Loading orders..." for about half a second before the cards appear. Then run `npm run build` to confirm it passes.

This moves `loading.tsx` from Part 8 into Part 3. In Part 8, I'll explain what it does behind the scenes instead of creating it.

```user
move on

```
# Part 4: Custom hook 🎮

I checked your repo first. Part 3 is pushed ✅, but the **`o` → `order` renames aren't applied yet** in `order.service.ts`: `found` and `(o) => o.id` are still in `getOrder` and `deleteOrder`. Apply the 2 blocks from my earlier message when you get a chance.

**Goal:** move the data into a **custom hook** (`useOrders`), and add a working **Delete** button. I built and ran this code here first: the page loads 3 orders, and clicking Delete on Mia leaves "2 orders". ✅

**Analogy:** A waiter 🧑‍🍳. The page (the table) just says "remove Mia's order". The waiter (the hook) walks to the kitchen (the service), comes back, and updates the bill (the state). The table never goes into the kitchen.

```
Click "Delete" on Mia
-> OrderItem: onDelete(1)
-> OrderList passes it up -> page's removeOrder(1)   (from useOrders)
-> deleteOrder(1)                                    (service, 0.5s mock wait)
-> dispatch({ type: "removed", id: 1 })              (reducer builds the new list)
-> React re-renders: "2 orders"
```

## Step 1: Create the hook

From inside `frontend/`:
```bash
mkdir -p src/hooks
touch src/hooks/useOrders.ts
```

⚠️ **Not from your prompt material:**
- **Actions carrying data.** Your `cartReducer` actions only have a `type` (`{ type: "add" }`). Here some actions also carry data, like `{ type: "removed"; id: number }`, so the reducer knows *which* order to remove.
- **`...state` in the reducer** copies every old field, then changes one. For example, `{ ...state, loading: false }` means "the same as before, but `loading` is now false".
- **Strict Mode runs effects twice in dev.** In `npm run dev`, React runs every effect, then the cleanup, then the effect again, to check your cleanup works. So the mock is called twice, and the `ignore` flag throws away the first answer. This doesn't happen in `npm run build`.

`frontend/src/hooks/useOrders.ts` has one export, so it uses `export default`:
```ts
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

const initialState: OrdersState = { orders: [], loading: true, error: null };

export default function useOrders() {
  const [state, dispatch] = useReducer(ordersReducer, initialState);

  // 4. Fetch once, when the page first appears
  useEffect(() => {
    let ignore = false; // set to true by the cleanup below

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

  // 5. Actions. useCallback keeps the SAME function between renders (pays off in Part 7)
  const addOrder = useCallback(async (input: NewOrder) => {
    const order = await createOrder(input); // a validation error is thrown to the caller (Part 5 form)
    dispatch({ type: "added", order });
  }, []);

  const removeOrder = useCallback(async (id: number) => {
    await deleteOrder(id);
    dispatch({ type: "removed", id });
  }, []);

  return {
    orders: state.orders,
    loading: state.loading,
    error: state.error,
    addOrder,
    removeOrder,
  };
}
```

💡 The hook's functions are called `addOrder` and `removeOrder`, not `createOrder` and `deleteOrder`, so their names don't clash with the service functions they call.

## Step 2: Use the hook in the page

`frontend/src/app/orders/page.tsx` changes almost completely (an `async` Server Component becomes a client page), so here is the whole file. It's only 18 lines:

**Old:** the `getOrders` import and `export default async function OrdersPage()`.

**New:**
```tsx
// src/app/orders/page.tsx  ->  URL: /orders
"use client"; // this page uses a hook, so it runs in the browser

import useOrders from "@/hooks/useOrders";
import OrderList from "@/components/orders/OrderList";

export default function OrdersPage() {
  const { orders, loading, error, removeOrder } = useOrders();

  return (
    <main>
      <h1>Orders</h1>
      {loading && <p className="muted">Loading orders...</p>}
      {error && <p className="error-text">Error: {error}</p>}
      {!loading && !error && <OrderList orders={orders} onDelete={removeOrder} />}
    </main>
  );
}
```

⚠️ Your `loading.tsx` is now mostly idle for this page. It only shows while a page **suspends**, and a client page that fetches in `useEffect` doesn't suspend. The hook shows its own "Loading orders..." text instead. Keep the file: Part 8 puts it back to work.

## Step 3: Pass `onDelete` down through `OrderList`

In `frontend/src/components/orders/OrderList.tsx`:

**Old:**
```tsx
  orders: Order[];   // a list of orders
}
```
**New:**
```tsx
  orders: Order[];   // a list of orders
  onDelete: (id: number) => void; // a function passed down from the page
}
```

**Old:**
```tsx
export default function OrderList({ orders }: OrderListProps) {
```
**New:**
```tsx
export default function OrderList({ orders, onDelete }: OrderListProps) {
```

**Old:**
```tsx
          <OrderItem key={order.id} order={order} />
```
**New:**
```tsx
          <OrderItem key={order.id} order={order} onDelete={onDelete} />
```

## Step 4: Add the Delete button to `OrderItem`

In `frontend/src/components/orders/OrderItem.tsx`:

**Old:**
```tsx
interface OrderItemProps {
  order: Order;
}
```
**New:**
```tsx
interface OrderItemProps {
  order: Order;
  onDelete: (id: number) => void;
}
```

**Old:**
```tsx
export default function OrderItem({ order }: OrderItemProps) {
```
**New:**
```tsx
export default function OrderItem({ order, onDelete }: OrderItemProps) {
```

**Old:**
```tsx
      <span className={`status status-${order.status}`}>{order.status}</span>
```
**New:**
```tsx
      <div className="order-actions">
        <span className={`status status-${order.status}`}>{order.status}</span>
        {/* Arrow function: runs onDelete(order.id) only WHEN clicked */}
        <button className="button-danger" onClick={() => onDelete(order.id)}>
          Delete
        </button>
      </div>
```

**Why the arrow?** `onClick={onDelete(order.id)}` would *call* it straight away, while the page draws, and delete every order. That's the same trap as `handleClick()` in your notes. The arrow wraps it so it only runs on click.

## Step 5: Styles

Paste at the **bottom** of `frontend/src/app/globals.css`:
```css
/* ---------- 6. Delete button + error text ---------- */
.order-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* Outline style: red text and border on the card's surface */
.button-danger {
  background: transparent;
  color: var(--danger);
  border: 1px solid currentColor;
}

.error-text {
  color: var(--danger);
}
```

## Step 6: Run and check

```bash
npm run dev
```

Open `http://localhost:3000/orders`. **Look for:**
1. "Loading orders..." for about half a second, then 3 cards, each with a red outlined **Delete**.
2. Click Delete on **Mia**. About half a second later, "2 orders" with Leo and Ava left.
3. Refresh the page. Mia is **back**, because the mock array lives in browser memory and a refresh resets it. A real backend server fixes this later.

**Experiment 🔮:** add `console.log("fetching orders")` as the first line inside `load()`. **Predict** how many times it prints in the browser console in dev, then check. It should print 2 times, because of Strict Mode. Remove it after.

## Step 7: Commit

```bash
cd ..
git add .
git commit -m "Add useOrders hook with useReducer and delete button"
git push
```

Say **"move on"** for Part 5 (Form).

| Skill | Where you used it |
|---|---|
| Custom hook | `useOrders.ts` |
| `useReducer` | `ordersReducer` with 4 actions |
| `useEffect` + cleanup | `load()` plus the `ignore` flag |
| `useCallback` | `addOrder`, `removeOrder` |
| `"use client"` | `orders/page.tsx` |
| Events + passing functions as props | `onDelete`: page → List → Item |
| Conditional rendering (`&&`) | loading, error, list |

```user
is useOrders act like a ViewModel in MVVM?

```
Yes, very close. `useOrders` plays the same role as a SwiftUI ViewModel: it holds state, exposes actions, and talks to the service so the View doesn't have to.

```
Model      -> types/order.ts             (Order shape)
Service    -> services/order.service.ts  (talks to the backend server / mock)
ViewModel  -> hooks/useOrders.ts         (state + actions)
View       -> orders/page.tsx, OrderList, OrderItem  (draws, calls actions)
```

## Two differences that matter

1. **It's a function, not a class.** In SwiftUI the ViewModel is an object that lives on its own (`@Observable class OrdersViewModel`). A hook has no object. Its state lives *inside the component that calls it*.
2. **Each call is a separate copy.** If `OrdersPage` and some other component both call `useOrders()`, each gets its **own** list and fetches on its own. They don't share. In SwiftUI, you'd share one ViewModel by passing it down. React does that with **Context**, which is Part 7.

**Analogy:** A SwiftUI ViewModel is one waiter 🧑‍🍳 serving the whole restaurant. A hook is a **job description**: every table that calls `useOrders()` hires its own waiter with that job description.

| | SwiftUI MVVM | React (this project) |
|---|---|---|
| ViewModel | `@Observable class` | custom hook `useOrders()` |
| State | `var orders: [Order]` | `useReducer` state |
| View updates when state changes | `@Observable` tracking | `dispatch` → re-render |
| Load on appear | `.task { await load() }` | `useEffect(..., [])` |
| Cancel on disappear | `.task` auto-cancels | cleanup `ignore = true` |
| Share one instance | pass it down / `@Environment` | Context (Part 7) |

```user
I don't understand 

1 [const [state, dispatch] = useReducer(ordersReducer, initialState);]
2 [useEffect(() => {...}, []);]
3. [let ignore = false; // set to true by the cleanup below] what is ignore? 
4 [return () => {
      ignore = true; // cleanup: throw away a late answer
    };]

```
## 1. `const [state, dispatch] = useReducer(ordersReducer, initialState);`

It's `useState` with a rulebook attached, like the bank teller 🏦 from your `cartReducer` notes.

```
useReducer(ordersReducer, initialState)
            │              └─ the starting value: { orders: [], loading: true, error: null }
            └─ the rulebook: how each action changes the state

returns [state, dispatch]
         │      └─ the function you call to hand the teller a slip
         └─ the current value (starts as initialState)
```

The story with your real data:
1. The page opens. `state` = `{ orders: [], loading: true, error: null }`, so the page shows "Loading orders...".
2. The mock answers with Mia, Leo and Ava. The code calls `dispatch({ type: "loaded", orders: [Mia, Leo, Ava] })`.
3. React runs `ordersReducer(oldState, thatAction)`, which hits `case "loaded"` and returns `{ orders: [Mia, Leo, Ava], loading: false, error: null }`.
4. `state` is now that new value, React re-renders, and the page shows "3 orders".

You never change `state` yourself. You only `dispatch` slips, and the reducer decides the new state.

## 2. `useEffect(() => { ... }, []);`

"After the page is drawn, do this job once."

```
useEffect( () => { ...the job... },  [] )
           └─ what to run              └─ empty list = run only once, after the first draw
```

**Why not just fetch at the top of the component?** A component function runs on **every** re-render. If you fetched there, each fetch would update the state, which re-renders, which fetches again… forever 🔁. `useEffect` with `[]` breaks that loop: it runs once.

## 3. `let ignore = false;` (what is `ignore`?)

It's an ordinary `true`/`false` variable you made up. It isn't a React feature. It answers one question: **"Is this answer still wanted?"**
- `false` means yes: when the orders arrive, use them.
- `true` means no: the page is gone, so throw the answer away.

## 4. `return () => { ignore = true; };`

The function you **return** from an effect is the **cleanup**. React calls it when the page disappears (or before re-running the effect). Here the cleanup flips the flag to `true`.

**The story: you leave before the orders arrive** ⏱️

```
0.0s  You open /orders        -> effect runs, ignore = false, mock starts its 0.5s wait
0.2s  You click to go Home    -> the page disappears -> React calls cleanup -> ignore = true
0.5s  Mock answers [Mia, Leo, Ava]
      -> if (!ignore) dispatch(...)   -> ignore is true -> skipped ✅
```

Without the flag, at 0.5s the code would try to update a page that **no longer exists**. That's wasted work, and in other cases it can show stale data.

**The same thing happens in dev Strict Mode**, where React runs the effect twice to test your cleanup:

```
Run 1:   ignore₁ = false, fetch 1 starts
Cleanup: ignore₁ = true            <- React tests your cleanup
Run 2:   ignore₂ = false, fetch 2 starts   (a brand new variable)
0.5s     fetch 1 answers -> ignore₁ is true  -> thrown away
0.5s     fetch 2 answers -> ignore₂ is false -> dispatch "loaded" ✅
```

Each run of the effect gets its **own** `ignore` variable. The cleanup only switches off the one that belongs to its own run, like each delivery order having its own "cancel" note 📝.

```user
dispatch({ type: "loaded", orders })   -> returns void (nothing)
why React runs ordersReducer later  ? what does it mean by later?    
when does React re-renders     ?

```
"Later" means **after your current code finishes running**. `dispatch` only puts a slip in a queue. React waits until your function is done, then processes the whole queue in **one** re-render.

## The timeline, using Delete on Mia

```
removeOrder(1) is running...
  await deleteOrder(1)               (0.5s mock wait)
  dispatch({ type: "removed", id: 1 })  -> slip goes in the queue, returns nothing
  ...rest of removeOrder finishes
-------- your code is done --------
React: runs ordersReducer(oldState, slip)  -> new state with Leo + Ava
React: re-renders OrdersPage with the new state
Browser: shows "2 orders"
```

**Analogy:** A café order pad ☕. The waiter (your code) writes every order on the pad first. The barista (React) only starts making them once the waiter has finished writing, so 3 orders get made in one go rather than one at a time.

## Why wait instead of updating immediately?

Because you might dispatch **more than once** in the same function:

```ts
dispatch({ type: "removed", id: 1 });  // slip 1
dispatch({ type: "removed", id: 2 });  // slip 2
```

React runs both slips through the reducer, then re-renders **once**. Updating straight away would redraw the page twice, and the first drawing would be wasted. This is called **batching**.

## When does React re-render?

A component re-renders when:
1. its **state changes** (through `dispatch` or a `setState`), or
2. its **parent re-renders**, which re-renders the children too. For example, `OrdersPage` re-renders, so `OrderList` and every `OrderItem` re-render. Part 7's `memo` can skip that.

💡 If the reducer returns the **exact same** state object (like `default: return state;`), React sees nothing changed and skips the re-render.

## Try it 🔮

In `frontend/src/hooks/useOrders.ts`, inside `removeOrder`:

**Old:**
```ts
    dispatch({ type: "removed", id });
```
**New:**
```ts
    dispatch({ type: "removed", id });
    console.log("right after dispatch:", state.orders.length);
```

**Predict** what it prints when you delete Mia: 3 or 2? Then check the browser console.

It prints **3**. The reducer hasn't run yet, and this `state` is still the old snapshot from the current render. The screen shows 2 a moment later. Remove the line after.

⚠️ ESLint will warn that `state` is missing from `useCallback`'s dependency list. That's expected for this experiment; just remove the line afterwards.

```user
what is useCallback() ?

```
`useCallback` makes React **keep the same function** between re-renders instead of making a new one each time.

## The problem it solves

Every time a component re-renders, **all the code inside it runs again**, including the lines that create functions:

```ts
// Without useCallback: this line runs on EVERY render
const removeOrder = async (id: number) => { ... };
```

```
Render 1 -> removeOrder is function #1
Render 2 -> removeOrder is function #2   (does the same job, but it's a NEW function)
Render 3 -> removeOrder is function #3
```

To React, function #1 and function #2 are **different things**, even though they do exactly the same job.

**Analogy:** A house key 🔑. Every render, you cut a **new copy** of the key. It opens the same door, but the shop sees a "new key" every time. `useCallback` says: "keep using the original key, unless the lock changes."

## With `useCallback`

```ts
const removeOrder = useCallback(async (id: number) => {
  await deleteOrder(id);
  dispatch({ type: "removed", id });
}, []);   // dependency list: [] = keep this same function forever
```

```
Render 1 -> function #1 (made and remembered)
Render 2 -> function #1 (same one handed back)
Render 3 -> function #1
```

**The dependency list** works like `useEffect`'s:
- `[]` keeps it forever. That's safe here because `dispatch` and `deleteOrder` never change.
- `[something]` makes a new function only when `something` changes.

## Why it matters: the story with your data

`removeOrder` travels down as a prop: page → `OrderList` → `OrderItem` × 3 (Mia, Leo, Ava).

In Part 7 you'll wrap `OrderItem` in `memo()`, which says "only re-render if my props change". Then:
- **Without** `useCallback`, every page re-render hands each card a *new* `onDelete`. `memo` sees a changed prop, so all 3 cards re-render anyway, and `memo` is useless.
- **With** `useCallback`, `onDelete` stays function #1. `memo` sees nothing changed, so Mia, Leo and Ava skip re-rendering. ✅

⚠️ Honest note: **right now** `useCallback` isn't saving anything, because `OrderItem` isn't wrapped in `memo` yet. The two only pay off together, which is why the comment says "pays off in Part 7". It's the same pairing as `handleClear` + `memo(ClearButton)` in your notes (section 12).

| | `useMemo` | `useCallback` |
|---|---|---|
| Remembers | a **value** (e.g. a filtered list) | a **function** |
| Example | `useMemo(() => orders.filter(...), [orders])` | `useCallback(async (id) => {...}, [])` |
| Used in this project | Part 6 (search filter) | Part 4 (`addOrder`, `removeOrder`) |

```user
Let me try to understand. 

<OrderList orders={orders} onDelete={removeOrder} />
Pass the function all the way down to <button className="button-danger" onClick={() => onDelete(order.id)}>, when click delete -> removeOrder run -> [await deleteOrder(id);] run -> run [ dispatch({ type: "removed", id });] -> ordersReducer return a OrdersState { ...state, orders: state.orders.filter((order) => order.id !== action.id) } 

-> ordersReducer returns { orders: [Leo, Ava], loading: false, error: null } 
-> 1. React stores it inside memory for useOrders() not OrdersPage yet .
-> 2. React re-runs the OrdersPage function
-> 3. useOrders() runs again -> useReducer hands back the NEW state
-> 4. the hook returns { orders: [Leo, Ava], ... }
-> 5. the page passes orders={[Leo, Ava]} to <OrderList>
-> 6. OrderList maps 2 orders -> 2 <OrderItem>
-> 7. React compares the new picture with the old one, using the keys
-> 8. React removes ONLY Mia's <li> from the real page

```

Yes, that's correct. Two small fixes and one detail to add.

## Fix 1: in step 1, the state belongs to `OrdersPage`, not to `useOrders`

A hook has **no memory of its own**. It's a job description, as in the waiter analogy. React stores the state **on the component that called the hook**, in a numbered slot:

```
OrdersPage's memory (kept by React)
  slot 1 (its useReducer) -> { orders: [Leo, Ava], loading: false, error: null }
```

So step 1 is: "React stores it in **OrdersPage's** slot for that `useReducer`." That's why step 3 works: when `OrdersPage` re-runs, `useOrders()` calls `useReducer` again, and React hands back what's in slot 1. It's also why the rules of hooks say "same order every time": React finds the slots by their order.

## Fix 2: the reducer runs during the re-render

`dispatch` only queues the slip. React runs `ordersReducer` **as part of** step 2/3, not before it. The result is the same; only the timing is different.

## Detail: steps 6 to 8

In step 6, Leo's and Ava's `OrderItem` functions **do re-run** (their parent re-rendered). But in step 7, React sees that key 2 (Leo) and key 3 (Ava) produced the same picture, so it **doesn't touch** their real `<li>` elements. Only key 1 (Mia) is missing, so only that `<li>` is removed.

Part 7's `memo` will skip even the re-running of Leo's and Ava's functions.

Your corrected flow:
```
click Delete on Mia -> onDelete(1) -> removeOrder(1)
-> await deleteOrder(1)                       (0.5s mock wait)
-> dispatch({ type: "removed", id: 1 })       (slip queued)
-> React re-runs OrdersPage
   -> useOrders() -> useReducer
      -> ordersReducer runs: keeps orders where id !== 1 -> [Leo, Ava]
      -> saved in OrdersPage's slot 1
   -> page passes [Leo, Ava] to OrderList -> 2 OrderItems
-> React compares by key: 1 gone, 2 and 3 the same
-> removes ONLY Mia's <li> from the real page
```

```user

move on
```
# Part 5: Form 📝

**Goal:** an "Add order" form at the top of `/orders`. I built and tested this code here first:
- An empty submit shows "Customer is required".
- Zoe × 3 makes "4 orders", then the form clears and the cursor jumps back to Customer.
- An empty quantity shows "Quantity must be at least 1".

**Analogy:** The puppet 🎭 from your notes. Each input only shows what its state says. Typing pulls the strings (`onChange` → `setState`), and the puppet moves.

```
Type "Zoe" -> onChange -> setCustomer("Zoe") -> re-render -> input shows "Zoe"
Click "Add order"
-> handleSubmit -> preventDefault (no page reload)
-> onAdd({ customer: "Zoe", quantity: 3 })    = addOrder from useOrders
   -> createOrder (mock checks it, 0.5s wait)
   ✅ ok   -> dispatch "added" -> list shows 4 -> form clears -> focus Customer
   ❌ fail -> throws "Customer is required" -> catch -> setError -> red text
```

## Step 1: Create the form

```bash
touch src/components/orders/OrderForm.tsx
```

⚠️ **Not from your prompt material:**
- `finally { ... }` runs **after** `try` or `catch`, whichever happened. Your `useFetch` example has it too, but here it's what turns the "Adding..." button back on.
- `Number(event.target.value)` turns the input's text `"3"` into the number `3`. Inputs give you text, even when `type="number"`.
- `disabled={saving}` greys out the button while saving, so a double-click can't add Zoe twice.
- **`"use client"` on this file:** this component calls hooks itself, so it marks itself as a Client Component. It then works even if a Server Component imports it one day.

`frontend/src/components/orders/OrderForm.tsx` has one export, so it uses `export default`:
```tsx
// src/components/orders/OrderForm.tsx
"use client"; // this file calls hooks itself, so it marks itself

import { useRef, useState } from "react";
import type { NewOrder } from "@/types/order";

interface OrderFormProps {
  onAdd: (input: NewOrder) => Promise<void>; // addOrder from useOrders
}

export default function OrderForm({ onAdd }: OrderFormProps) {
  // Controlled inputs: state is the single source of truth
  const [customer, setCustomer] = useState("");
  const [quantity, setQuantity] = useState(1);

  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

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
      <label htmlFor="customer">Customer</label>
      <input
        id="customer"
        ref={customerInputRef}
        value={customer}
        onChange={(event) => setCustomer(event.target.value)}
      />

      <label htmlFor="quantity">Quantity</label>
      <input
        id="quantity"
        type="number"
        value={quantity}
        onChange={(event) => setQuantity(Number(event.target.value))}
      />

      <button type="submit" disabled={saving}>
        {saving ? "Adding..." : "Add order"}
      </button>

      {error && <p className="error-text">{error}</p>}
    </form>
  );
}
```

**Why no validation in the form?** The mock plays the **backend server**, and your notes say backend validation is the real security. The form just shows what the backend server says. Checking in the form *as well* would be a nice extra, but it isn't needed to learn the skill.

## Step 2: Put the form on the page

In `frontend/src/app/orders/page.tsx`:

**Old:**
```tsx
import OrderList from "@/components/orders/OrderList";
```
**New:**
```tsx
import OrderList from "@/components/orders/OrderList";
import OrderForm from "@/components/orders/OrderForm";
```

**Old:**
```tsx
  const { orders, loading, error, removeOrder } = useOrders();
```
**New:**
```tsx
  const { orders, loading, error, addOrder, removeOrder } = useOrders();
```

**Old:**
```tsx
      <h1>Orders</h1>
```
**New:**
```tsx
      <h1>Orders</h1>
      <OrderForm onAdd={addOrder} />
```

## Step 3: Styles

Paste at the **bottom** of `frontend/src/app/globals.css`:
```css
/* ---------- 7. Order form ---------- */
.order-form {
  display: grid;
  gap: 8px;
  max-width: 560px;
  margin-bottom: 16px;
}

.order-form label {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
```

## Step 4: Run and check

Open `http://localhost:3000/orders`. **Look for:**
1. Click **Add order** with the Customer box empty. The button says "Adding..." for about half a second, then red text says "Customer is required".
2. Type `Zoe`, quantity `3`, and click Add. You should see "4 orders", Zoe last with "pending", an empty Customer box with the cursor blinking in it, and the red text gone.
3. Click the **Label** "Customer". The cursor jumps into its box. That's `htmlFor="customer"` linking to `id="customer"`.

⚠️ Zoe's date may show **yesterday's** date. `toISOString()` gives UTC time, and Melbourne is 11 hours ahead. It isn't a bug in your code, and the real backend server would decide the date later.

**Experiment 🔮:** delete everything in the Quantity box. **Predict** what the box shows. It shows `0` straight away, because `Number("")` is `0`, and the state controls the box. Now submit: "Quantity must be at least 1".

## Step 5: Commit

```bash
cd ..
git add .
git commit -m "Add controlled OrderForm with error message and useRef focus"
git push
```

Say **"move on"** for Part 6 (Search and tabs).

| Skill | Where you used it |
|---|---|
| Controlled form | `customer`, `quantity` state + `value` / `onChange` |
| `useState` | 4 pieces of form state |
| `useRef` | `customerInputRef.current?.focus()` |
| Events | `onSubmit`, `onChange`, `preventDefault` |
| Conditional rendering | `{saving ? ... : ...}`, `{error && ...}` |
| `try` / `catch` / `finally` | `handleSubmit` |
| Labels + `htmlFor` | Customer and Quantity |


```user
move on

```

# Part 6: Search and tabs 🔍

**Goal:** a search box and 4 status tabs that filter the list together. I built and tested this code here first:
- Searching "a" shows Mia and Ava.
- Searching "a" with the cancelled tab shows Ava.
- The shipped tab shows Leo.
- Searching "zz" shows "No orders found."

**Analogy:** The busy café ☕ from your notes. Typing and clicking are urgent jobs, done first. Redrawing the list is a slow job, done when there's time.

```
Type "a"          -> setSearch("a")        (urgent: the input shows "a" now)
                  -> deferredSearch catches up a moment later
                  -> useMemo re-filters with deferredSearch -> [Mia, Ava]
Click "cancelled" -> startTransition(() => setStatus("cancelled"))  (not urgent)
                  -> useMemo re-filters with status -> [Ava]
```

**Which hook goes where** (the rule from your notes):
- The **page** only *receives* the typed text, so it uses `useDeferredValue`.
- **StatusTabs** *owns* the click that calls `setState`, so it uses `useTransition`.

⚠️ Change from my plan: the plan put `useDeferredValue` inside `SearchBox`. It belongs in the **page**, where the filtering happens, so `SearchBox` stays a plain input.

⚠️ Honest note: with 3–4 orders, filtering is instant, so you **won't see** the "Updating..." text or the fade. These two hooks only help when the list is slow to draw, and their payoff appears with Part 7's `memo`. Today you're learning where they go.

## Step 1: Add the filter type

In `frontend/src/types/order.ts`, add this at the **bottom**:
```ts

// The tabs can show one status, or "all" of them
export type StatusFilter = OrderStatus | "all";
```

It lives here, not in `StatusTabs.tsx`, because exporting a type next to the component's default export would break your no-mixed-exports rule.

## Step 2: Create the two components

```bash
touch src/components/orders/SearchBox.tsx src/components/orders/StatusTabs.tsx
```

`frontend/src/components/orders/SearchBox.tsx` uses no hooks, so it doesn't need `"use client"`:
```tsx
// src/components/orders/SearchBox.tsx
// A plain controlled input. The parent owns the text.

interface SearchBoxProps {
  value: string;
  onChange: (text: string) => void;
}

export default function SearchBox({ value, onChange }: SearchBoxProps) {
  return (
    <div className="search-box">
      <label htmlFor="search">Search customer</label>
      <input
        id="search"
        type="search"
        placeholder="e.g. Leo"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}
```

⚠️ **Not from your prompt material:** `type="search"` is a normal text input that browsers give a small ✕ clear button.

`frontend/src/components/orders/StatusTabs.tsx`:
```tsx
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
          onClick={() => selectTab(tab)}
        >
          {tab}
        </button>
      ))}
      {isPending && <span className="muted">Updating...</span>}
    </div>
  );
}
```

💡 `onChange` here is the page's `setStatus`. Calling it **inside** `startTransition` makes that state update low priority, even though the state lives in the page.

## Step 3: Wire it up in the page

In `frontend/src/app/orders/page.tsx`:

**Old:**
```tsx
import useOrders from "@/hooks/useOrders";
```
**New:**
```tsx
import { useDeferredValue, useMemo, useState } from "react";
import type { StatusFilter } from "@/types/order";
import useOrders from "@/hooks/useOrders";
```

**Old:**
```tsx
import OrderForm from "@/components/orders/OrderForm";
```
**New:**
```tsx
import OrderForm from "@/components/orders/OrderForm";
import SearchBox from "@/components/orders/SearchBox";
import StatusTabs from "@/components/orders/StatusTabs";
```

**Old:**
```tsx
  const { orders, loading, error, addOrder, removeOrder } = useOrders();
```
**New:**
```tsx
  const { orders, loading, error, addOrder, removeOrder } = useOrders();

  // What the user picked
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");

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
```

**Old:**
```tsx
      <OrderForm onAdd={addOrder} />
```
**New:**
```tsx
      <OrderForm onAdd={addOrder} />
      <SearchBox value={search} onChange={setSearch} />
      <StatusTabs value={status} onChange={setStatus} />
```

**Old:**
```tsx
      {!loading && !error && <OrderList orders={orders} onDelete={removeOrder} />}
```
**New:**
```tsx
      {!loading && !error && (
        <div className={isStale ? "stale" : undefined}>
          <OrderList orders={visibleOrders} onDelete={removeOrder} />
        </div>
      )}
```

⚠️ **Not from your prompt material:**
- `.toLowerCase()` makes "Leo" and "leo" match.
- `.includes(searchText)` asks "does this text contain that text?" An empty search `""` matches everyone.
- `className={... : undefined}` uses `undefined` to mean "no class at all".

**Rules of hooks check ✅:** all 5 hooks (`useOrders`, 2 × `useState`, `useDeferredValue`, `useMemo`) sit at the **top** of the function, before any `&&` or `?`, so they run in the same order every render.

## Step 4: Fix the empty-list message

In `frontend/src/components/orders/OrderList.tsx`:

**Old:**
```tsx
    return <p className="muted">No orders yet.</p>;
```
**New:**
```tsx
    return <p className="muted">No orders found.</p>;
```

"No orders yet" would be wrong when a search simply matches nobody.

## Step 5: Styles

Paste at the **bottom** of `frontend/src/app/globals.css`:
```css
/* ---------- 8. Search + status tabs ---------- */
.search-box {
  display: grid;
  gap: 4px;
  max-width: 560px;
  margin-bottom: 12px;
}

.search-box label {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.status-tabs {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

/* Inactive tab: outline only */
.tab {
  background: transparent;
  color: var(--text-primary);
  border: 1px solid var(--border);
}

/* Active tab: filled with the accent colour */
.tab-active {
  background: var(--accent);
  color: var(--accent-text);
  border-color: var(--accent);
}

/* The list fades while the search is catching up */
.stale {
  opacity: 0.5;
}
```

## Step 6: Run and check

Open `http://localhost:3000/orders`. **Look for:**
1. Type `a`: **Mia, Ava** (both names contain "a"; Leo doesn't).
2. Click **cancelled**: only **Ava**, and the cancelled tab turns blue.
3. Clear the search and click **shipped**: only **Leo**.
4. Type `zz`: "No orders found."
5. Add **Zoe** with the form while on the **pending** tab. Zoe appears straight away, because `orders` changed and `useMemo` re-filtered.

**Experiment 🔮:** remove `status` from `useMemo`'s list, so it's `[orders, deferredSearch]`. **Predict** what happens when you click a tab. The list doesn't change, because `useMemo` keeps its old answer, and ESLint warns about the missing dependency. Put it back.

## Step 7: Commit

```bash
cd ..
git add .
git commit -m "Add search with useDeferredValue, status tabs with useTransition, useMemo filter"
git push
```

Say **"move on"** for Part 7 (Theme).

| Skill | Where you used it |
|---|---|
| `useDeferredValue` | `deferredSearch` in the page |
| `useTransition` | `selectTab` in `StatusTabs` |
| `useMemo` | `visibleOrders` |
| Union type | `StatusFilter = OrderStatus \| "all"` |
| Lifting state up | `search` and `status` live in the page; children get value + onChange |
| Rules of hooks | all hooks at the top, before conditions |

```user
don't use 5000 mock orders, use [
  { id: 1, customer: "Mia", quantity: 2, status: "pending",   createdAt: "2026-10-29T09:15:00Z" },
  { id: 2, customer: "Leo", quantity: 5, status: "shipped",   createdAt: "2026-10-30T14:40:00Z" },
  { id: 3, customer: "Ava", quantity: 1, status: "cancelled", createdAt: "2026-10-31T08:05:00Z" },
]; 

and only show 10 order per page, you need to click '->' or '<-' to go to the next page

```

I never planned 5000 mock orders. Part 6 and your mock both use exactly those 3 (Mia, Leo, Ava), so the mock stays as it is.

Pagination is added below as **Steps 8 to 11 of Part 6**. Do them after Part 6's Steps 1 to 6, since your repo doesn't have Part 6 yet.

I tested it here by adding 9 orders with the form (12 in total):
- Page 1 shows 10 orders, and **→** goes to page 2 with the last 2.
- After 2 deletes on page 2, it falls back to "Page 1 of 1" by itself.

**Analogy:** A book 📖. All the matching orders are the whole book; `PAGE_SIZE` is how many lines fit on one page; `←` and `→` turn pages.

```
orders (from useOrders)
-> visibleOrders  (search + tab filter, useMemo)   e.g. 12 orders
-> pageOrders     (slice 10 for the current page)  page 2 -> 2 orders
-> OrderList shows pageOrders, and says "12 orders"
```

With only 3 orders, you'll see **"Page 1 of 1"** and both arrows greyed out. Add 8 or more orders with the form to see page 2.

## Step 8: Create the Pagination component

```bash
touch src/components/orders/Pagination.tsx
```

⚠️ **Not from your prompt material:**
- `<nav>` is an HTML tag meaning "navigation controls". It behaves like a `<div>`, but screen readers announce it.
- `aria-label="Previous page"` gives the button a name that screen readers read. Without it, they'd read "left arrow". This is a sneak peek of Part 9 (accessibility).

`frontend/src/components/orders/Pagination.tsx`:
```tsx
// src/components/orders/Pagination.tsx
// "<-  Page 1 of 2  ->". The parent owns currentPage.

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  return (
    <nav className="pagination">
      <button
        type="button"
        aria-label="Previous page"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        ←
      </button>

      <span className="muted">
        Page {currentPage} of {totalPages}
      </span>

      <button
        type="button"
        aria-label="Next page"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        →
      </button>
    </nav>
  );
}
```

## Step 9: Make `OrderList` show the total, not just this page

Without this change, page 1 would say "10 orders" when there are 12.

In `frontend/src/components/orders/OrderList.tsx`:

**Old:**
```tsx
  orders: Order[];   // a list of orders
```
**New:**
```tsx
  orders: Order[];   // a list of orders
  totalCount: number; // all matching orders, not just this page
```

**Old:**
```tsx
export default function OrderList({ orders, onDelete }: OrderListProps) {
```
**New:**
```tsx
export default function OrderList({ orders, totalCount, onDelete }: OrderListProps) {
```

**Old:**
```tsx
      <p className="muted">{orders.length} orders</p>
```
**New:**
```tsx
      <p className="muted">{totalCount} orders</p>
```

## Step 10: Add paging to the page

⚠️ **Not from your prompt material:**
- `Math.ceil(12 / 10)` rounds **up**, giving `2` pages.
- `Math.max(1, ...)` means "at least 1", so 0 orders still shows "Page 1 of 1".
- `Math.min(a, b)` picks the smaller number.
- `array.slice(start, end)` keeps the items from `start` up to, but not including, `end`.

In `frontend/src/app/orders/page.tsx` (after Part 6):

**Old:**
```tsx
import StatusTabs from "@/components/orders/StatusTabs";
```
**New:**
```tsx
import StatusTabs from "@/components/orders/StatusTabs";
import Pagination from "@/components/orders/Pagination";

const PAGE_SIZE = 10; // orders per page
```

**Old:**
```tsx
  const [status, setStatus] = useState<StatusFilter>("all");
```
**New:**
```tsx
  const [status, setStatus] = useState<StatusFilter>("all");
  const [currentPage, setCurrentPage] = useState(1);
```

**Old:**
```tsx
  }, [orders, deferredSearch, status]);
```
**New:**
```tsx
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
```

**Old:**
```tsx
      <SearchBox value={search} onChange={setSearch} />
      <StatusTabs value={status} onChange={setStatus} />
```
**New:**
```tsx
      <SearchBox value={search} onChange={handleSearchChange} />
      <StatusTabs value={status} onChange={handleStatusChange} />
```

**Old:**
```tsx
          <OrderList orders={visibleOrders} onDelete={removeOrder} />
```
**New:**
```tsx
          <OrderList orders={pageOrders} totalCount={visibleOrders.length} onDelete={removeOrder} />
          <Pagination currentPage={safePage} totalPages={totalPages} onPageChange={setCurrentPage} />
```

**The maths with real data:** 12 orders, page 2:
```
totalPages = max(1, ceil(12 / 10)) = 2
safePage   = min(2, 2)             = 2
slice((2 - 1) * 10, 2 * 10) = slice(10, 20) -> items 10 and 11 -> the last 2 orders
```

**Why `safePage`?** Say you're on page 2 with 11 orders, and you delete the only order there. Now there are 10 orders, so `totalPages` = 1, but `currentPage` is still 2. `min(2, 1)` = 1 shows page 1 instead of an empty page, with no extra effect or state needed.

**Why `PAGE_SIZE` isn't an env variable:** it's a design choice that's the same in dev and prod, so a constant at the top of the file is enough.

## Step 11: Styles

Paste at the **bottom** of `frontend/src/app/globals.css`:
```css
/* ---------- 9. Pagination ---------- */
.pagination {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 16px;
}
```

The arrow buttons reuse your existing `button` and `button:disabled` styles.

## Check it

Open `http://localhost:3000/orders`. **Look for:**
1. "3 orders" and "Page 1 of 1", with both arrows greyed out.
2. Add 9 orders with the form (any names). You should see "12 orders", "Page 1 of 2", 10 cards, and **→** turned on.
3. Click **→**: "Page 2 of 2", with 2 cards (your last 2 added).
4. Search `a` while on page 2. It jumps back to **page 1**.

Then commit Part 6 as a whole:
```bash
cd ..
git add .
git commit -m "Add search, status tabs, useMemo filter and pagination"
git push
```



```user
why useMemo not useEffect?

```

Because `visibleOrders` is a **value worked out from data you already have**. `useMemo` works it out **while** the page is drawing. `useEffect` only runs **after** the page has been drawn, which is too late.

**Analogy:** A shop receipt 🧾. `useMemo` adds up the total while printing the receipt, so it comes out correct. `useEffect` prints the receipt first with the old total, then reprints it with the right one.

## The `useEffect` version (don't do this)

```tsx
const [visibleOrders, setVisibleOrders] = useState<Order[]>([]);   // extra state

useEffect(() => {
  setVisibleOrders(orders.filter(...));                             // runs AFTER drawing
}, [orders, deferredSearch, status]);
```

**The timeline when you click the "shipped" tab:**
```
useEffect way:
Render 1 -> status = "shipped", but visibleOrders is still [Mia, Leo, Ava]  -> draws WRONG list
Effect   -> setVisibleOrders([Leo])
Render 2 -> draws [Leo]                                                    -> 2 renders, a flash of wrong data

useMemo way:
Render 1 -> status = "shipped" -> useMemo filters right now -> [Leo]       -> 1 render, correct first time ✅
```

## The rule

- **`useMemo`** (or a plain `const`) is for working something out **from** props or state, like filtering, adding up or sorting.
- **`useEffect`** is for **talking to the outside world**, like fetching from the backend server, timers, or `localStorage`. That's why `useOrders` uses `useEffect` for `getOrders()`.

## Do you even need `useMemo` here?

Honestly, **no**, not with 3 to 12 orders. A plain `const` gives the same result:

```tsx
const visibleOrders = orders.filter(...);   // re-runs every render, but takes microseconds
```

`useMemo` only skips the work when nothing it depends on changed. For example, typing in the **form** re-renders the page, but `orders`, `deferredSearch` and `status` didn't change, so `useMemo` reuses the old list. It pays off with big lists or slow calculations. Here it's in the project so you practise it, once.

| | `useMemo` | `useEffect` + `useState` |
|---|---|---|
| Runs | during render | after render |
| Renders per change | 1 | 2 |
| Wrong data on screen | never | for one frame |
| Use for | values worked out from state/props | fetching, timers, the outside world |
| In this project | `visibleOrders` | `getOrders()` in `useOrders` |

```user
Explain what is useTransition? and why do we need it

How the useTransition and interact with OrderList if it sit inside search tab? 
why the search box didn't use useTransition?
why the search box didn't use useTransition? What does it mean by: "urgent" and "not urgent"

```
Explain what is useTransition? and why do we need it

How the useTransition and interact with OrderList if it sit inside search tab? 
why the search box didn't use useTransition?
why the search box didn't use useTransition? What does it mean by: "urgent" and "not urgent"

```user
move on

```
# Part 7: Theme + memo 🌓

## Step 0: Fix the mock first ⚠️

I need to correct myself. Last time I said your mock had exactly 3 orders, but the commit you pushed after that (`b0c0add`) has **5000** generated orders in `frontend/src/services/order.service.ts`, and the 3 real ones are renamed to `unusedSampleOrders`. That causes 2 problems:
- `npm run lint` fails: *"'unusedSampleOrders' is never reassigned. Use 'const' instead"*.
- `nextId = 4`, but ids 1 to 5000 are taken. Adding Zoe would give her **id 4**, the same as "Customer 4", so two cards share a key.

In `frontend/src/services/order.service.ts`:

**Old:**
```ts
let mockOrders: Order[] = Array.from({ length: 5000 }, (_, index) => ({
  id: index + 1,
  customer: `Customer ${index + 1}`,
  quantity: 1,
  status: "pending" as const,
  createdAt: "2026-11-01T00:00:00Z",
}));

let unusedSampleOrders: Order[] = [
```
**New:**
```ts
let mockOrders: Order[] = [
```

The 3 orders (Mia, Leo, Ava) and `let nextId = 4;` below it stay as they are.

## The goal

1. A **theme button** in a header on every page. It starts on "system" (following your computer), and each click flips between light and dark.
2. **`memo(OrderItem)`**, so cards skip re-rendering when nothing about them changed.

I built and tested this here. In both light and dark computer modes, clicking the button flips the page background between `#f5f6f8` and `#121212`. I also tested `memo` with your 5000 orders: typing in the search box re-rendered **0** cards with `memo`, and **all 5000** without it.

**Analogy:** The radio station 📻 from your notes. `ThemeProvider` broadcasts the theme, and any component can tune in with `useTheme()`, with no props passed down through every level.

```
layout.tsx
└── ThemeProvider (broadcasts { theme, toggle })
    ├── header
    │   └── ThemeToggle   <- useTheme() hears it directly
    └── {children} = every page (Home, Orders...)

click ThemeToggle
-> toggle() -> setTheme("dark")
-> useEffect: <html data-theme="dark">
-> globals.css block 3 ([data-theme="dark"]) swaps every token
-> the whole page turns dark, without any component re-rendering for colour
```

💡 The colours change through **CSS**, not React. React only flips one attribute on `<html>`, and your tokens from Part 1 do the rest.

## Step 1: Create the files

```bash
mkdir -p src/context
touch src/context/ThemeContext.tsx src/components/ThemeToggle.tsx
```

`ThemeToggle` goes in `components/`, not `components/orders/`, because it isn't about orders.

## Step 2: `ThemeContext.tsx`

It exports 2 functions (`ThemeProvider`, `useTheme`), so it uses **named exports**.

⚠️ **Not from your prompt material:**
- `type ReactNode` inside the `import { ... }` braces imports only the type, the same idea as `import type`.
- `document.documentElement` is the real `<html>` element. `setAttribute` and `removeAttribute` add or remove `data-theme` on it.
- `window.matchMedia("(prefers-color-scheme: dark)").matches` asks the browser "is the computer in dark mode?" and gets `true` or `false`.
- `theme ?? "x"` means "use `theme`, unless it's `null` or `undefined`, then use `"x"`".

`frontend/src/context/ThemeContext.tsx`:
```tsx
// src/context/ThemeContext.tsx
"use client"; // context + hooks need the browser

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

// null = no choice yet, so follow the computer's setting (prefers-color-scheme)
type Theme = "light" | "dark" | null;

interface ThemeContextType {
  theme: Theme;
  toggle: () => void;
}

// 1. The radio station (undefined until a Provider supplies a value)
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// 2. Provider: wraps the app and broadcasts the value
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(null);

  // Put the choice on <html data-theme="..."> so globals.css can react to it
  useEffect(() => {
    const html = document.documentElement;
    if (theme === null) {
      html.removeAttribute("data-theme"); // follow the computer
    } else {
      html.setAttribute("data-theme", theme);
    }
  }, [theme]);

  function toggle() {
    // What is showing right now? (a choice, or the computer's setting)
    const computerPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const showing = theme ?? (computerPrefersDark ? "dark" : "light");
    setTheme(showing === "dark" ? "light" : "dark");
  }

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

// 3. Consumer helper: any component below the Provider can call useTheme()
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used inside ThemeProvider");
  return context;
}
```

**Why `useEffect` here?** Changing `<html>` is "talking to the outside world" (the real page outside React), which is exactly what `useEffect` is for. Compare that with `useMemo` in Part 6.

**Why start at `null`, not `"light"`?** If it started at `"light"`, the effect would set `data-theme="light"` on load and **override** a computer in dark mode. Your Part 1 rule says the computer's setting should win until the user clicks.

## Step 3: `ThemeToggle.tsx`

`frontend/src/components/ThemeToggle.tsx`:
```tsx
// src/components/ThemeToggle.tsx
"use client"; // this file calls a hook itself, so it marks itself

import { useTheme } from "@/context/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggle } = useTheme(); // tune in to the radio station

  return (
    <button type="button" className="tab" onClick={toggle}>
      Theme: {theme ?? "system"}
    </button>
  );
}
```

It reuses the `.tab` outline style from Part 6.

## Step 4: Wrap the app in `layout.tsx`

⚠️ **Not from your prompt material:** `<Link href="/orders">` from `next/link` is Next.js's version of `<a>`. It switches pages **without reloading** the whole browser tab.

💡 My plan had a separate `providers.tsx`. It isn't needed: `ThemeContext.tsx` already has `"use client"`, so the Server Component `layout.tsx` can render `<ThemeProvider>` directly. That's one file fewer.

In `frontend/src/app/layout.tsx`:

**Old:**
```tsx
import "./globals.css";
```
**New:**
```tsx
import Link from "next/link";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import ThemeToggle from "@/components/ThemeToggle";
```

**Old:**
```tsx
      <body>{children}</body>
```
**New:**
```tsx
      <body>
        <ThemeProvider>
          <header className="site-header">
            <Link href="/">Mini Orders</Link>
            <Link href="/orders">Orders</Link>
            <ThemeToggle />
          </header>
          {children}
        </ThemeProvider>
      </body>
```

## Step 5: `memo(OrderItem)`

In `frontend/src/components/orders/OrderItem.tsx`:

**Old:**
```tsx
import type { Order } from "@/types/order";
```
**New:**
```tsx
import { memo } from "react";
import type { Order } from "@/types/order";
```

**Old:**
```tsx
export default function OrderItem({ order, onDelete }: OrderItemProps) {
```
**New:**
```tsx
function OrderItem({ order, onDelete }: OrderItemProps) {
```

Then add this at the **very bottom** of the file, after the closing `}` of the function:
```tsx

// memo: skip re-rendering when order and onDelete are the same as last time
export default memo(OrderItem);
```

It's still one default export, so it follows your export rule. The export just moved to the bottom, because `memo()` wraps the finished function.

**Why it works now:** `memo` compares the 2 props. `order` is the same object as before (filtering keeps the same objects), and `onDelete` is the same function thanks to Part 4's `useCallback`. If both match, React skips the card.

## Step 6: Styles

Paste at the **bottom** of `frontend/src/app/globals.css`:
```css
/* ---------- 10. Site header ---------- */
.site-header {
  display: flex;
  align-items: center;
  gap: 16px;
  padding-bottom: 16px;
  margin-bottom: 16px;
  border-bottom: 1px solid var(--border);
}

/* Push the theme button to the right */
.site-header button {
  margin-left: auto;
}
```

## Step 7: Run and check

Open `http://localhost:3000/orders`. **Look for:**
1. A header saying "Mini Orders · Orders" with **"Theme: system"** on the right.
2. Click it: the page flips to the opposite of your computer's mode, and the button says "Theme: dark" or "Theme: light".
3. Click again: it flips back.
4. In dark mode, cards are a **lighter grey** than the page, with no shadow (your Part 1 elevation rule).
5. Click **Mini Orders** to go to the home page. The theme **stays**, because the Provider lives in the layout, which doesn't reload.
6. Refresh the browser: it's back to "system". The choice is kept in memory only, not saved.

**Experiment 🔮 (`memo`):** add this as the first line inside `function OrderItem(...)`:
```tsx
  console.log("OrderItem rendered:", order.customer);
```
Type `a` in the search box. **Predict** how many logs you'll see in the browser console, then check. Matching cards that stay on screen print **nothing**. Now temporarily change the bottom line to `export default OrderItem;` and type again: every card prints, twice in dev because of Strict Mode. Put `memo` back and remove the `console.log`.

## Step 8: Commit

```bash
cd ..
git add .
git commit -m "Add ThemeContext with toggle, site header, memo(OrderItem); restore 3 mock orders"
git push
```

Say **"move on"** for Part 8 (App Router extras).

| Skill | Where you used it |
|---|---|
| `createContext` + Provider | `ThemeContext.tsx` |
| `useContext` (via `useTheme`) | `ThemeToggle.tsx` |
| `useEffect` for the outside world | setting `data-theme` on `<html>` |
| `memo` | `export default memo(OrderItem)` |
| `memo` + `useCallback` together | `onDelete` stays the same function |
| Semantic tokens + manual override | `[data-theme="dark"]` block from Part 1 |
| `next/link` | header links |

```user
Could you teach me formatting in order page? it's too ugly. 
for example in swift there's Hstack, Vstack, Zstack, navigationStack.

```

# Layout: SwiftUI → CSS 📐

Most SwiftUI layout has a CSS twin. Here's the mapping, then the fixes for your orders page. I applied the fixes to a copy and took screenshots: the before and after images are `before-light-1000.png`, `after-light-1000.png` and `after-dark-390.png`.

## The mapping

**`HStack` is `display: flex`** (a row):
```css
.row {
  display: flex;
  align-items: center;     /* HStack(alignment: .center) */
  gap: 12px;               /* HStack(spacing: 12) */
}
```

**`VStack` is `display: flex` plus `flex-direction: column`** (a column):
```css
.column {
  display: flex;
  flex-direction: column;
  gap: 4px;                /* VStack(spacing: 4) */
}
```

**`Spacer()` is `flex: 1`**, which means "take all the spare room":
```css
.grow { flex: 1; }         /* HStack { TextField; Spacer(); Button } */
```

**`ZStack` is `position: relative` on the parent plus `position: absolute` on the child:**
```css
.card   { position: relative; }                          /* the ZStack */
.corner { position: absolute; top: 8px; right: 8px; }    /* layered on top */
```

**`NavigationStack` isn't CSS at all.** In Next.js it's the `app/` **folders** (each `page.tsx` is a screen), `layout.tsx` (the frame around every screen, like the navigation bar) and `<Link>` (like `NavigationLink`).

**How the orders page breaks down:**
```
body (centred column, max 720px)        = .frame(maxWidth: 720) + centred
└── main (VStack)
    ├── h1 "Orders"
    ├── form (HStack, wraps on phones)
    │   ├── field (VStack: label + input)  flex: 1 = Spacer-like grow
    │   ├── field (VStack: label + input)  fixed 96px
    │   └── button
    ├── toolbar (HStack, wraps)
    │   ├── search (VStack, grows)
    │   └── tabs (HStack)
    ├── list (VStack of cards)
    │   └── card (HStack: [VStack name + date] ... [HStack badge + Delete])
    └── pagination (HStack, centred)
```

## The fixes

All of it is layout: there are no new colours, and every colour still comes from a token.

### 1. Centre the page and fix the fonts (`frontend/src/app/globals.css`)

**Old:**
```css
body {
  margin: 0;
  padding: 24px;
```
**New:**
```css
body {
  max-width: 720px;   /* content column never gets wider than this */
  margin: 0 auto;     /* auto left + right = centred */
  padding: 32px 16px;
```

**Old:**
```css
button {
  background: var(--accent);
```
**New:**
```css
/* Buttons and inputs don't copy the page font by default */
button,
input {
  font: inherit;
}

h1 {
  margin: 0 0 20px;
}

label {
  color: var(--text-secondary);
  font-size: 0.875rem;
}

button {
  background: var(--accent);
```

The new `label` rule replaces the two label rules removed in steps 3 and 4 below, so all labels share one style.

### 2. Space the list, and capitalise the badges and tabs

**Old:**
```css
  gap: 12px;
  max-width: 560px;
}
```
**New:**
```css
  gap: 12px;
  margin-top: 8px;
}
```

That's the `.order-list` rule. `body` now controls the width, so the `max-width: 560px` limits go.

**Old:**
```css
  border: 1px solid currentColor;
}

.status-pending
```
**New:**
```css
  border: 1px solid currentColor;
  text-transform: capitalize;
}

.status-pending
```

**Old:**
```css
.tab {
  background: transparent;
  color: var(--text-primary);
  border: 1px solid var(--border);
}
```
**New:**
```css
.tab {
  background: transparent;
  color: var(--text-primary);
  border: 1px solid var(--border);
  text-transform: capitalize;
}
```

### 3. Make the form an HStack of VStacks

**Old:**
```css
.order-form {
  display: grid;
  gap: 8px;
  max-width: 560px;
  margin-bottom: 16px;
}

.order-form label {
  color: var(--text-secondary);
  font-size: 0.9rem;
}
```
**New:**
```css
.order-form {
  display: flex;          /* HStack */
  flex-wrap: wrap;        /* wrap onto a new line on narrow screens */
  align-items: flex-end;  /* line the bottoms up: inputs + button */
  gap: 12px;
  margin-bottom: 24px;
}

/* One label + input pair = a VStack */
.field {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.field-grow {
  flex: 1;            /* take all the spare width, like a Spacer() */
  min-width: 180px;
}

.field-quantity {
  width: 96px;
}

/* The error takes a whole line of its own */
.order-form .error-text {
  flex-basis: 100%;
  margin: 0;
}
```

⚠️ **Not from your prompt material:** `flex-wrap: wrap` lets items drop to the next line when the screen is too narrow (there's no direct SwiftUI twin; it's closest to `ViewThatFits`). `flex-basis: 100%` says "I want a full line", so the error always sits underneath.

Then group each label with its input in `frontend/src/components/orders/OrderForm.tsx`:

**Old:**
```tsx
      <label htmlFor="customer">Customer</label>
      <input
        id="customer"
        ref={customerInputRef}
        value={customer}
        onChange={(event) => setCustomer(event.target.value)}
      />

      <label htmlFor="quantity">Quantity</label>
      <input
        id="quantity"
        type="number"
        value={quantity}
        onChange={(event) => setQuantity(Number(event.target.value))}
      />
```
**New:**
```tsx
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
```

### 4. Put search and tabs on one row

**Old:**
```css
.search-box {
  display: grid;
  gap: 4px;
  max-width: 560px;
  margin-bottom: 12px;
}

.search-box label {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.status-tabs {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}
```
**New:**
```css
.toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 12px;
  margin-bottom: 16px;
}

.search-box {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  min-width: 200px;
}

.status-tabs {
  display: flex;
  align-items: center;
  gap: 8px;
}
```

In `frontend/src/app/orders/page.tsx`:

**Old:**
```tsx
      <SearchBox value={search} onChange={handleSearchChange} />
      <StatusTabs value={status} onChange={handleStatusChange} />
```
**New:**
```tsx
      <div className="toolbar">
        <SearchBox value={search} onChange={handleSearchChange} />
        <StatusTabs value={status} onChange={handleStatusChange} />
      </div>
```

### 5. Centre the pagination (`globals.css`)

**Old:**
```css
.pagination {
  display: flex;
  align-items: center;
```
**New:**
```css
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
```

`justify-content` positions items along the row; `align-items` lines them up across it.

## Check it

Refresh `/orders`. **Look for:**
- the page centred, the form on one line, and search and tabs on one row;
- at phone width (DevTools → device toolbar, `Cmd + Shift + M`), the form and toolbar wrapping neatly.

One more thing in your repo: the 5000-order array is now called `unUsedmockOrders` but is never used, so `npm run lint` will fail on it. Delete that block when you get a chance.

| SwiftUI | CSS | Where in this page |
|---|---|---|
| `HStack` | `display: flex` | form, toolbar, card, pagination |
| `VStack` | `flex` + `flex-direction: column` | `.field`, `.search-box` |
| `spacing:` | `gap` | everywhere |
| `Spacer()` | `flex: 1` (or `margin-left: auto`) | Customer field, search box, theme button |
| `alignment:` | `align-items` | `flex-end` in form and toolbar |
| `.frame(maxWidth:)` | `max-width` | `body` 720px |
| `.padding()` | `padding` | `body`, `.card` |
| `ZStack` | `position: relative` + `absolute` | not used yet |
| `NavigationStack` | `app/` folders + `layout.tsx` + `<Link>` | header links (Part 7) |

```user
move on

```

# Part 8: App Router extras 🗺️

**Goal:** 3 App Router features, each used once:
1. The **home page** becomes an async Server Component with a manual `<Suspense>`.
2. A **dynamic route** `/orders/[id]`: click Leo and you get Leo's own page.
3. **`error.tsx`**: a missing order shows a friendly error page.

I built and tested this here:
- The home page shows "3 orders in the system".
- Clicking Leo opens `/orders/2` showing "Order #2 · Leo · Quantity: 5 · Shipped".
- `/orders/99` shows "Something went wrong" with a Try again button.

## Step 0: Remove the unused 5000-order block

It's still in your repo and will fail `npm run lint`. In `frontend/src/services/order.service.ts`, delete the whole block from `let unUsedmockOrders: Order[] = Array.from({ length: 5000 }, ...` down to its closing `}));`.

## How the 3 pieces fit

```
/                 page.tsx (Server)  -> <Suspense> around <OrderCount/> (async)
/orders           orders/page.tsx (Client, useOrders)
/orders/2         orders/[id]/page.tsx (Server, async) -> getOrder(2)
                    while waiting  -> orders/loading.tsx
                    if it throws   -> orders/error.tsx
```

`loading.tsx` and `error.tsx` sit in `orders/`, so they cover `orders/[id]/` too, like an umbrella ☂️ over every folder underneath. This is where `loading.tsx` gets back to work: I checked, and with `cacheComponents` the `[id]` page **won't build** without it.

## Step 1: Create the files

```bash
mkdir -p "src/app/orders/[id]"
touch "src/app/orders/[id]/page.tsx" src/app/orders/error.tsx
```

The quotes around the path are needed because some shells (like zsh on a Mac) treat `[ ]` as special characters.

## Step 2: Home page = async Server Component + `<Suspense>`

⚠️ **Not from your prompt material:** `<Suspense fallback={...}>` written **by hand**. It's the same thing `loading.tsx` does for you, but around just one part of a page, so the heading shows at once and only the count waits.

In `frontend/src/app/page.tsx`, the starter page is completely replaced, so here is the whole file (24 lines):

**Old:** the whole `Home` function and its comments.

**New:**
```tsx
// src/app/page.tsx  ->  URL: /
// No "use client", so it's a Server Component: it runs on the Next.js frontend server.
import { Suspense } from "react";
import Link from "next/link";
import { getOrders } from "@/services/order.service";

// An async Server Component: it can await data directly, no useEffect needed
async function OrderCount() {
  const orders = await getOrders(); // ~0.5s mock wait, on the Next.js frontend server
  return <p className="muted">{orders.length} orders in the system</p>;
}

export default function Home() {
  const appName = "Mini Orders";

  return (
    <main>
      <h1>Welcome to {appName} 🛒</h1>
      {/* The heading shows at once; the count streams in when it's ready */}
      <Suspense fallback={<p className="muted">Counting orders...</p>}>
        <OrderCount />
      </Suspense>
      <p>
        <Link href="/orders">Go to orders →</Link>
      </p>
    </main>
  );
}
```

💡 This file holds 2 functions, but only `Home` is exported, so `export default` still follows your rule.

**Compare the two ways of loading data:**
```
Server Component (this page)      Client Component (orders page)
async + await getOrders()          useEffect + dispatch
runs on the Next.js frontend server runs in the browser
no state, no ignore flag            loading/error state, cleanup
can't have onClick                  can have onClick
```

## Step 3: The dynamic route `orders/[id]/page.tsx`

⚠️ **Not from your prompt material:**
- **`params` is a Promise** in this Next.js version, so you `await params` before reading `id`.
- **`PageProps<"/orders/[id]">`** is a type Next.js generates for you. It's the same kind of helper as the `LayoutProps<"/">` already in your `layout.tsx`.
- **`id` is text.** URLs are text, so `"2"` must become `2` with `Number(id)`. `Number("abc")` gives `NaN`, which matches no order, so it shows the error page.

`frontend/src/app/orders/[id]/page.tsx`:
```tsx
// src/app/orders/[id]/page.tsx  ->  URL: /orders/1, /orders/2, ...
// Server Component. [id] in the folder name = "any value goes here".
import Link from "next/link";
import { getOrder } from "@/services/order.service";

export default async function OrderDetailPage({ params }: PageProps<"/orders/[id]">) {
  const { id } = await params;               // "/orders/2" -> id = "2" (always text)
  const order = await getOrder(Number(id));  // throws if not found -> error.tsx shows

  return (
    <main>
      <p>
        <Link href="/orders">← Back to orders</Link>
      </p>
      <h1>Order #{order.id}</h1>
      <div className="card order-detail">
        <p>
          <strong>{order.customer}</strong>
        </p>
        <p className="muted">Quantity: {order.quantity}</p>
        <p className="muted">Created: {order.createdAt.slice(0, 10)}</p>
        <span className={`status status-${order.status}`}>{order.status}</span>
      </div>
    </main>
  );
}
```

**The story with real data:** you visit `/orders/2`:
```
Next.js sees folder [id] -> params = Promise of { id: "2" }
-> await params -> id = "2"
-> getOrder(2) -> mock finds Leo (0.5s; loading.tsx shows meanwhile)
-> page draws "Order #2 · Leo · Quantity: 5 · Shipped"
```

## Step 4: Link each card to its page

In `frontend/src/components/orders/OrderItem.tsx`:

**Old:**
```tsx
import { memo } from "react";
```
**New:**
```tsx
import { memo } from "react";
import Link from "next/link";
```

**Old:**
```tsx
        <strong>{order.customer}</strong>
```
**New:**
```tsx
        <Link href={`/orders/${order.id}`}>
          <strong>{order.customer}</strong>
        </Link>
```

## Step 5: `error.tsx`

⚠️ **Not from your prompt material:**
- **`retry`** is a function Next.js gives you that loads and draws this part of the page again.
- **`error: unknown`** means "we don't know what was thrown". It's usually an `Error`, but not guaranteed.
- **`&apos;`** is how you write `'` inside JSX text. ESLint asks for it.

`frontend/src/app/orders/error.tsx`:
```tsx
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
```

**Why not show `error.message` ("Order 99 not found")?** In a production build (Part 10's Docker image), Next.js **hides** error messages from Server Components and replaces them with a generic one, so a secret like a database password in an error never reaches the browser. A fixed friendly sentence works the same in dev and prod. The real message still goes to the console.

**Honest note:** for "this order doesn't exist", real apps use Next.js's `notFound()` (a proper 404 page). Here `error.tsx` handles it so you practise one error boundary.

## Step 6: Styles

Paste at the **bottom** of `frontend/src/app/globals.css`:
```css
/* ---------- 11. Order detail ---------- */
.order-detail {
  display: flex;            /* VStack */
  flex-direction: column;
  align-items: flex-start;  /* VStack(alignment: .leading) */
  gap: 8px;
}

.order-detail p {
  margin: 0;
}
```

## Step 7: Run and check

```bash
npm run dev
```

**Look for:**
1. `http://localhost:3000`: the heading, then "3 orders in the system". "Counting orders..." flashes first for about half a second.
2. On `/orders`, click **Leo**. You should land on `/orders/2` showing "Order #2", "Leo", "Quantity: 5" and a green "Shipped" badge. **← Back to orders** returns you.
3. Type `http://localhost:3000/orders/99` in the address bar. "Something went wrong" appears, and the browser console shows the real error.
4. Run `npm run build`. **Look for** `◐ /` and `◐ /orders/[id]` in the route table (Partial Prerender).

⚠️ **The two-mock-copies limitation from Part 3 shows up here.** The detail and home pages run on the Next.js frontend server, so they read **its** copy of the mock:
- Add Zoe on `/orders`, then click her. `/orders/4` shows the **error page**, because the Next.js frontend server's copy has no Zoe.
- Delete Mia, and the home page still says "3 orders".

That's expected with a mock, and a real backend server fixes it.

## Step 8: Commit

```bash
cd ..
git add .
git commit -m "Add async home page with Suspense, order detail [id] route, error.tsx; remove unused mock"
git push
```

Say **"move on"** for Part 9 (Quality).

| Skill | Where you used it |
|---|---|
| Async Server Component | `OrderCount`, `OrderDetailPage` |
| Manual `<Suspense>` | home page count |
| `loading.tsx` (automatic Suspense) | covers `orders/` and `orders/[id]/` |
| Dynamic route `[id]` + `params` | `orders/[id]/page.tsx` |
| `error.tsx` (error boundary) | `orders/error.tsx` |
| `next/link` | card name → detail, back link |

```user

move on

```

Good. Now clean up.

# Part 9: Quality ✅

Your GitHub still ends at the layout commit, so Part 8 isn't pushed yet. Push it before starting so Part 10 builds the full app.

**Goal:** 3 quality checks, each done once:
1. **Testing:** 3 tests for `OrderList`.
2. **Accessibility:** screen readers can tell the buttons apart.
3. **Rules of hooks:** let ESLint check them for you.

I ran all of this here: **3 tests pass**. When I removed the accessibility fix, the Delete test **failed**, so the test really checks it.

## Step 1: Install the test tools

⚠️ **Not from your prompt material:** your notes mention **Jest** for tests. I'm using **Vitest** because the Next.js docs in your project recommend it and it needs less setup. The test code (`test`, `expect`, `render`, `screen`) looks almost the same as Jest.

From inside `frontend/`:
```bash
npm install -D @types/node@^22 vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/dom
```

What each package is for:
- `vitest` runs the tests.
- `jsdom` is a pretend browser, so components can render without Chrome.
- `@testing-library/react` provides `render` and `screen`, which draw a component and find things in it.
- `@vitejs/plugin-react` lets Vitest understand TSX.
- `@types/node@^22`: I hit a conflict here, because Vitest 5 needs Node types version 22 or newer and your project has 20. Your Node is probably 22+ (check with `node -v`).

## Step 2: Config + test script

```bash
touch vitest.config.mts
mkdir -p tests
touch tests/OrderList.test.tsx
```

`frontend/vitest.config.mts`:
```ts
// vitest.config.mts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    tsconfigPaths: true, // makes "@/..." imports work in tests, like in Next.js
  },
  test: {
    environment: "jsdom", // a pretend browser, so components can render
  },
});
```

In `frontend/package.json`:

**Old:**
```json
    "lint": "eslint"
```
**New:**
```json
    "lint": "eslint",
    "test": "vitest"
```

## Step 3: Fix accessibility (before the test, because the test uses it)

**The problem:** a screen reader on `/orders` hears "Delete, Delete, Delete". Which one is Mia's? Sighted people see the card, but blind users only hear the button's name.

In `frontend/src/components/orders/OrderItem.tsx`:

**Old:**
```tsx
        <button className="button-danger" onClick={() => onDelete(order.id)}>
```
**New:**
```tsx
        <button
          className="button-danger"
          aria-label={`Delete ${order.customer}`}
          onClick={() => onDelete(order.id)}
        >
```

Now it reads "Delete Leo". The screen still shows just "Delete".

Two more small fixes.

`frontend/src/components/orders/StatusTabs.tsx` tells screen readers which tab is on:

**Old:**
```tsx
          className={tab === value ? "tab tab-active" : "tab"}
```
**New:**
```tsx
          className={tab === value ? "tab tab-active" : "tab"}
          aria-pressed={tab === value}
```

`frontend/src/components/orders/OrderForm.tsx` makes screen readers announce the error as soon as it appears:

**Old:**
```tsx
      {error && <p className="error-text">{error}</p>}
```
**New:**
```tsx
      {error && <p className="error-text" role="alert">{error}</p>}
```

⚠️ **Not from your prompt material:** `aria-label` (a name for screen readers), `aria-pressed` ("this button is switched on") and `role="alert"` ("read this out now") are standard HTML accessibility attributes.

**Already done in earlier parts ✅:**
- Labels with `htmlFor` (form, search).
- `aria-label` on the ← → buttons.
- Visible focus rings (`:focus-visible`).
- Contrast of 4.5 or more in both modes (Part 1).

## Step 4: Write the test

⚠️ **Not from your prompt material:**
- `describe` groups tests, `test` is one check, and `expect(x).toHaveLength(2)` means "x should have 2 items".
- `vi.fn()` is a **fake function** that remembers every call, so you can ask "were you called with 2?".
- `fireEvent.click` pretends to click.
- `cleanup()` wipes the pretend browser between tests.

`frontend/tests/OrderList.test.tsx`:
```tsx
// tests/OrderList.test.tsx
import { afterEach, describe, expect, test, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import OrderList from "@/components/orders/OrderList";
import type { Order } from "@/types/order";

// Real sample data, same as the mock
const twoOrders: Order[] = [
  { id: 2, customer: "Leo", quantity: 5, status: "shipped",   createdAt: "2026-10-30T14:40:00Z" },
  { id: 3, customer: "Ava", quantity: 1, status: "cancelled", createdAt: "2026-10-31T08:05:00Z" },
];

// Remove what the last test drew, so tests don't see each other's output
afterEach(() => {
  cleanup();
});

describe("OrderList", () => {
  test("shows one list item per order, and the total", () => {
    render(<OrderList orders={twoOrders} totalCount={2} onDelete={() => {}} />);

    expect(screen.getAllByRole("listitem")).toHaveLength(2);
    expect(screen.getByText("2 orders")).toBeDefined();
  });

  test("shows a message when there are no orders", () => {
    render(<OrderList orders={[]} totalCount={0} onDelete={() => {}} />);

    expect(screen.getByText("No orders found.")).toBeDefined();
  });

  test("calls onDelete with Leo's id when Leo's Delete is clicked", () => {
    const onDelete = vi.fn(); // a fake function that remembers how it was called
    render(<OrderList orders={twoOrders} totalCount={2} onDelete={onDelete} />);

    fireEvent.click(screen.getByRole("button", { name: "Delete Leo" }));

    expect(onDelete).toHaveBeenCalledWith(2);
  });
});
```

**Why find things by role and name?** `getByRole("button", { name: "Delete Leo" })` finds the button **the same way a screen reader does**. If the test can't find it, a blind user can't either. That's why removing `aria-label` broke the test.

**Why test `OrderList` and not the page?** It only needs props: no hooks, no mock and no waiting. The Next.js docs also say Vitest can't run `async` Server Components yet.

## Step 5: Run the tests

```bash
npm test
```

**Look for:** `Tests  3 passed (3)`. It keeps watching for changes, so press `q` to quit.

**Experiment 🔮:** delete the `aria-label` line in `OrderItem.tsx` and save. **Predict** which test fails. It should be the third one, with *"Unable to find an accessible element with the role "button" and name "Delete Leo""*. Put the line back.

## Step 6: Rules of hooks check

ESLint already has a rules-of-hooks checker built in (`react-hooks/rules-of-hooks`). Run it:
```bash
npm run lint
```

**Look for:** no errors. If you haven't removed the unused 5000-order block yet, that's the error you'll see (`prefer-const` on `unUsedmockOrders`).

**Experiment 🔮:** break the rule on purpose. In `OrderList.tsx`, add `useState` **after** the early `return` (the "No orders found." line):
```tsx
  const [expanded, setExpanded] = useState(false);
```
Run `npm run lint`. **Look for:** *"React Hook "useState" is called conditionally… Did you accidentally call a React Hook after an early return?"* That's the seat-numbers 🪑 rule from your notes, caught for you. Undo it.

## Step 7: Commit

```bash
cd ..
git add .
git commit -m "Add Vitest + RTL tests for OrderList and accessibility labels"
git push
```

Say **"move on"** for Part 10 (Docker), the last one.

| Skill | Where you used it |
|---|---|
| Testing (React Testing Library) | `tests/OrderList.test.tsx` |
| Fake functions | `vi.fn()` for `onDelete` |
| Accessibility | `aria-label`, `aria-pressed`, `role="alert"` |
| Testing like a user | `getByRole("button", { name })` |
| Rules of hooks | `npm run lint` + the break-it experiment |

```user
Explain vi.fn(),     fireEvent.click(screen.getByRole("button", { name: "Delete Leo" }));

    expect(onDelete).toHaveBeenCalledWith(2);

```

The 3 lines answer one question: **"When someone clicks Leo's Delete, does `OrderList` call `onDelete` with Leo's id (2)?"**

## 1. `const onDelete = vi.fn();`: a spy 🕵️

`vi.fn()` makes a **fake function**. It does nothing when called, but it **writes down every call** in a notebook.

```ts
const onDelete = vi.fn();

onDelete(2);
onDelete(3);

onDelete.mock.calls   // -> [[2], [3]]   the notebook: one entry per call
```

**Why not pass the real `removeOrder`?** That would need the hook, the mock and a 0.5s wait. `OrderList`'s only job is to **pass the id up**, so a spy is enough to check that.

**Analogy:** A spy at the door. They don't stop anyone; they just note down who came through.

## 2. `fireEvent.click(screen.getByRole("button", { name: "Delete Leo" }));`

Read it **inside-out**, like maths brackets.

**First, `screen.getByRole("button", { name: "Delete Leo" })`:**
- `screen` is the whole pretend page.
- `getByRole("button", ...)` looks for a button…
- `{ name: "Delete Leo" }` …whose accessible name is "Delete Leo" (from `aria-label`).
- It returns that `<button>` element, or **fails the test** if it finds none or more than one.

**Then `fireEvent.click(thatButton)`:** pretends a user clicked it.

## 3. What happens inside after the click

```
fireEvent.click(Leo's button)
-> React runs Leo's onClick: () => onDelete(order.id)
-> order.id is 2 -> onDelete(2)
-> onDelete is the spy -> notebook: [[2]]
```

The spy travelled the same path as in the real app:
```
test passes onDelete -> OrderList -> OrderItem (Leo) -> button onClick
```

## 4. `expect(onDelete).toHaveBeenCalledWith(2);`

It checks the notebook: **"was there a call with exactly `2`?"**
- Notebook `[[2]]`: ✅ pass.
- Notebook `[[3]]` (say `OrderItem` wrongly used Ava's id): ❌ fail, with "Expected: 2, Received: 3".
- Notebook `[]` (the button didn't call anything): ❌ fail, with "Number of calls: 0".

**Experiment 🔮:** in `OrderItem.tsx`, change `onDelete(order.id)` to `onDelete(order.quantity)`. **Predict** the failure message. Leo's quantity is 5, so it should say "Received: 5". Undo it.

| Other spy checks | Means |
|---|---|
| `toHaveBeenCalled()` | called at least once, with anything |
| `toHaveBeenCalledTimes(1)` | called exactly once |
| `toHaveBeenCalledWith(2)` | called with exactly `2` |
| `not.toHaveBeenCalled()` | never called |

```user

Could you help me build the logging for users action e.g. data-action?

should we log it in json file or how does people usually do?

```

## How people usually do it

**Not a JSON file in the browser.** A web page isn't allowed to write files on the user's computer, and even if it could, you'd never see the file. The usual flow is:

```
User clicks
-> the browser sends a small JSON event       { action: "delete-order", orderId: "2", time }
-> to a backend server endpoint (POST /api/events), or to an analytics service
-> stored where you can query it:
   - a database table "events"  (your Postgres skills)
   - or log lines, one JSON per line, collected by a log tool
   - or a ready-made tool: PostHog, Plausible, Google Analytics
```

So **JSON is the right format** (one JSON object per event, called *structured logging*), but it's **stored on a server**, not in a file in the browser.

**For this project (no backend server yet):** print each event as a JSON line in the **browser console**. One env variable switches it to "send to the backend server" later, the same idea as `NEXT_PUBLIC_USE_MOCK`.

## How `data-action` works

**Analogy:** Price tags 🏷️ on shop items. You don't train every item to report itself. You put a tag on it, and **one** cashier at the door (a single click listener) reads the tag on anything that comes past.

```
<button data-action="delete-order" data-order-id="2">   <- the tag
click anywhere on the page
-> ActionLogger (one listener on the whole document) catches it
-> walks up from what was clicked to the nearest [data-action]
-> reads its tags: { action: "delete-order", orderId: "2" }
-> logAction() -> console now, backend server later
```

The benefit is that components don't import or call anything. Tracking a new button is just one attribute.

I built and tested this here. Clicking around printed:
```
[action] {"action":"filter-status","details":{"status":"shipped"},"path":"/orders","time":"2026-11-02T07:37:04.306Z"}
[action] {"action":"delete-order","details":{"orderId":"2"},"path":"/orders","time":"2026-11-02T07:37:04.416Z"}
[action] {"action":"add-order","details":{},"path":"/orders","time":"2026-11-02T07:37:04.451Z"}
[action] {"action":"open-order","details":{"orderId":"1"},"path":"/orders","time":"2026-11-02T07:37:04.505Z"}
[action] {"action":"toggle-theme","details":{},"path":"/orders/1","time":"2026-11-02T07:37:05.349Z"}
```

This works on top of Part 8, so you can do it before or after Part 9.

## Step 1: Create the files

```bash
touch src/lib/logAction.ts src/components/ActionLogger.tsx
```

## Step 2: `logAction.ts` (the sender)

⚠️ **Not from your prompt material:**
- `Record<string, string | undefined>` is a type meaning "an object with any text keys whose values are text".
- `navigator.sendBeacon(url, text)` is a browser function for sending small data that **still arrives if the user leaves the page**, unlike a normal `fetch`.
- `window.location.pathname` is the current URL path, like `"/orders"`.

`frontend/src/lib/logAction.ts`:
```ts
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
```

Leave `NEXT_PUBLIC_EVENTS_URL` **unset** for now. When the backend server exists, add it to `.env.local` and `.env.example`, for example `NEXT_PUBLIC_EVENTS_URL=http://localhost:4000/api/events`.

## Step 3: `ActionLogger.tsx` (the one listener)

⚠️ **Not from your prompt material:**
- `document.addEventListener("click", ...)` listens for **every** click on the page, the same idea as `onClick` but for the whole document.
- `.closest("[data-action]")` starts at the clicked element and walks **up** through its parents until one has `data-action`. That way, clicking the `<strong>Leo</strong>` inside a link still finds the link's tag.
- `element.dataset` holds all `data-*` attributes, **renamed to camelCase**: `data-order-id` becomes `orderId`.
- `const { action, ...details } = element.dataset` takes `action` out, and puts **everything else** into `details`.
- `return null` means the component draws nothing.

`frontend/src/components/ActionLogger.tsx`:
```tsx
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
      const element = target.closest<HTMLElement>("[data-action]");
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
```

The cleanup works like the `ignore` flag in Part 4: without it, Strict Mode in dev would attach **two** listeners, and every click would log twice.

## Step 4: Mount it once in `layout.tsx`

In `frontend/src/app/layout.tsx`:

**Old:**
```tsx
import ThemeToggle from "@/components/ThemeToggle";
```
**New:**
```tsx
import ThemeToggle from "@/components/ThemeToggle";
import ActionLogger from "@/components/ActionLogger";
```

**Old:**
```tsx
        <ThemeProvider>
```
**New:**
```tsx
        <ThemeProvider>
          <ActionLogger />
```

## Step 5: Tag the elements

`frontend/src/components/orders/OrderItem.tsx`, the delete button:

**Old:**
```tsx
        <button className="button-danger" onClick={() => onDelete(order.id)}>
```
**New:**
```tsx
        <button
          className="button-danger"
          data-action="delete-order"
          data-order-id={order.id}
          onClick={() => onDelete(order.id)}
        >
```

(If you've already done Part 9, the button is split over several lines with `aria-label`. Just add the two `data-` lines under `className`.)

`OrderItem.tsx`, the name link:

**Old:**
```tsx
        <Link href={`/orders/${order.id}`}>
```
**New:**
```tsx
        <Link href={`/orders/${order.id}`} data-action="open-order" data-order-id={order.id}>
```

`frontend/src/components/orders/OrderForm.tsx`:

**Old:**
```tsx
      <button type="submit" disabled={saving}>
```
**New:**
```tsx
      <button type="submit" disabled={saving} data-action="add-order">
```

`frontend/src/components/orders/StatusTabs.tsx`:

**Old:**
```tsx
          type="button"
```
**New:**
```tsx
          type="button"
          data-action="filter-status"
          data-status={tab}
```

`frontend/src/components/orders/Pagination.tsx`:

**Old:**
```tsx
        aria-label="Previous page"
```
**New:**
```tsx
        aria-label="Previous page"
        data-action="page-previous"
```

**Old:**
```tsx
        aria-label="Next page"
```
**New:**
```tsx
        aria-label="Next page"
        data-action="page-next"
```

`frontend/src/components/ThemeToggle.tsx`:

**Old:**
```tsx
    <button type="button" className="tab" onClick={toggle}>
```
**New:**
```tsx
    <button type="button" className="tab" data-action="toggle-theme" onClick={toggle}>
```

## Step 6: Check it

Open `/orders` with the browser console open. **Look for** one `[action] {...}` line per click: tabs, Delete, Add order, a name, the theme button. Clicking empty space or a card's background logs **nothing**.

## Things to know

- **Log ids, not names.** `orderId: "2"`, not `customer: "Leo"`. A customer name is personal data, and event logs get copied around and kept for a long time. I didn't tag the search box for the same reason: typed text can contain anything.
- **`data-action` logs the click (what the user tried), not the result.** "add-order" is logged even when it fails with "Customer is required". To log outcomes, call `logAction("add-order-failed", { reason })` inside `handleSubmit`'s `catch`.
- `npm run lint` will still fail on the unused 5000-order block in `order.service.ts` until you delete it. It's still in your latest commit.

Commit:
```bash
cd ..
git add .
git commit -m "Add data-action click logging with one document listener and env switch"
git push
```

| Option | Where events go | Good for |
|---|---|---|
| Console (now) | browser DevTools | learning, dev |
| Your backend server + Postgres `events` table | your database | full control, SQL reports |
| Backend server → stdout JSON lines | `docker logs` / a log tool | debugging what happened |
| PostHog / Plausible / GA | a hosted service | dashboards without building them |

```user

move on, what's next? docker?

```

# Part 10: Docker 🐳

Yes, the last part. **Goal:** `docker compose up --build`, then open `http://localhost:3000` and the whole app runs from a container.

**Honest note on testing:** this sandbox can't download Docker images (the registry is blocked), so I couldn't run the container itself. What I did test:
- `docker compose config` reads the compose file correctly.
- I built the **exact standalone output** the Dockerfile copies and ran it with `node server.js` the same way the container does. Home, `/orders`, `/orders/2` and the error page all worked, with styles loaded.

⚠️ **Not from your prompt material:** this whole part. Dockerfiles and compose come from your work experience, not the course slides. The Next.js-specific bits are explained below.

## The big picture

**Analogy:** A meal-kit factory 🏭 with 3 rooms. Room 1 collects the ingredients, room 2 cooks, and room 3 packs only the finished meal into a lunchbox 🍱. The pots, peelings and 690 MB of `node_modules` stay behind. That's a **multi-stage build**.

```
Stage 1 deps:    package.json -> npm ci -> node_modules (690 MB)
Stage 2 builder: + your code -> npm run build -> .next/standalone (~68 MB)
Stage 3 runner:  copy ONLY standalone + static + public -> node server.js
docker-compose:  reads root .env -> passes build args -> maps port 3000
```

**The one Next.js trap:** `NEXT_PUBLIC_` values are **baked into the browser code at build time**, not read when the container starts. So they're passed as **build args**, and changing them needs `--build`. You'll prove this in the experiment.

## Step 0: Free up port 3000

Stop `npm run dev` (`Ctrl + C`), because the container will use port 3000.

## Step 1: Standalone output

In `frontend/next.config.ts`:

**Old:**
```ts
  cacheComponents: true,
```
**New:**
```ts
  output: "standalone", // build a small self-contained server for Docker
  cacheComponents: true,
```

`standalone` makes `npm run build` produce a folder with a `server.js` and **only** the packages the server actually uses. That's how 690 MB becomes about 68 MB.

## Step 2: Root `.gitignore` first, then the env files

The root folder needs its own `.env`, because compose reads `.env` from the folder it runs in. From the **repo root** (`Mini-Orders/`):

```bash
touch .gitignore
```

`.gitignore` (root):
```
.env
```

Check it before creating the secret file:
```bash
touch .env .env.example
git status --short
```

**Look for:** `.env.example` and `.gitignore` listed, `.env` **not** listed.

`.env` and `.env.example` (same content for now):
```
NEXT_PUBLIC_USE_MOCK=true
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_EVENTS_URL=
FRONTEND_PORT=3000
```

## Step 3: `.dockerignore`

```bash
touch frontend/.dockerignore
```

`frontend/.dockerignore`:
```
# Never copy these into the image
node_modules
.next
.git
.env*
!.env.example
tsconfig.tsbuildinfo
```

**Why `.env*` matters:** the Dockerfile has `COPY . .`. Without this line, your `.env.local` would be **copied into the image**, and anyone with the image could read it. It's the same idea as `.gitignore`, but for Docker.

## Step 4: `Dockerfile`

```bash
touch frontend/Dockerfile
```

`frontend/Dockerfile`:
```dockerfile
# ---------- Stage 1: install packages ----------
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# ---------- Stage 2: build the app ----------
FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# NEXT_PUBLIC_ values are baked into the browser code at BUILD time
ARG NEXT_PUBLIC_USE_MOCK
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_EVENTS_URL
ENV NEXT_PUBLIC_USE_MOCK=$NEXT_PUBLIC_USE_MOCK
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_EVENTS_URL=$NEXT_PUBLIC_EVENTS_URL

RUN npm run build

# ---------- Stage 3: run (only what's needed) ----------
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

# Copy only the built server + static files, owned by the non-root "node" user
COPY --from=builder --chown=node:node /app/public ./public
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static

USER node
EXPOSE 3000
CMD ["node", "server.js"]
```

The lines that matter:
- `node:22-alpine` uses Node 22, which matches the `@types/node@^22` from Part 9. "Alpine" is a tiny Linux.
- `npm ci` installs **exactly** what's in `package-lock.json`, unlike `npm install`, which may pick newer versions.
- `ARG` then `ENV` takes a value from compose, then makes it visible to `npm run build`.
- `HOSTNAME=0.0.0.0` makes the server listen on **all** network doors. With the default `localhost`, it only listens *inside* the container, and your browser couldn't reach it.
- `.next/static` and `public` are copied separately because `standalone` doesn't include them (they're the CSS, JS and images).
- `USER node` runs as a normal user, not root, so a hacked app can't take over the container.

## Step 5: `docker-compose.yml` (repo root)

```bash
touch docker-compose.yml
```

`docker-compose.yml`:
```yaml
# docker-compose.yml  (repo root)
# Values come from the root .env file (not committed)
services:
  frontend:
    build:
      context: ./frontend
      args:
        NEXT_PUBLIC_USE_MOCK: ${NEXT_PUBLIC_USE_MOCK}
        NEXT_PUBLIC_API_URL: ${NEXT_PUBLIC_API_URL}
        NEXT_PUBLIC_EVENTS_URL: ${NEXT_PUBLIC_EVENTS_URL}
    ports:
      - "${FRONTEND_PORT}:3000"   # your computer's port : the container's port
    restart: unless-stopped
```

`${...}` is filled in from the root `.env`, so nothing is hardcoded. You can check what compose will use with:
```bash
docker compose config
```

**Look for:** `NEXT_PUBLIC_USE_MOCK: "true"` and `published: "3000"`.

## Step 6: Run it

From the repo root:
```bash
docker compose up --build
```

The first build takes a few minutes. **Look for** `✓ Ready` in the output, then open `http://localhost:3000`:
1. Home: "3 orders in the system".
2. `/orders`: 3 cards; search, tabs, add, delete and the theme toggle all work.
3. `/orders/2`: Leo's detail page.
4. `/orders/99`: the friendly error page.

Stop it with `Ctrl + C`, then:
```bash
docker compose down
```

**Check the size:**
```bash
docker images
```

**Look for** the `mini-orders-frontend` image at a few hundred MB at most, much smaller than with all of `node_modules` inside.

## Step 7: Experiment 🔮 (build-time baking)

1. In the root `.env`, set `NEXT_PUBLIC_USE_MOCK=false`.
2. Run `docker compose up` **without** `--build`. **Predict:** does `/orders` break?
   It **still works with the mock**, because the old image has `true` baked in.
3. `Ctrl + C`, then run `docker compose up --build`.
   Now `/orders` shows "Error: Failed to fetch", because there's no backend server on port 4000.
4. Set it back to `true` and rebuild.

That's the rule: **changing a `NEXT_PUBLIC_` value needs a rebuild.**

## Step 8: Commit

```bash
git status            # look for: .env NOT listed
git add .
git commit -m "Add multi-stage Dockerfile, standalone output and docker compose"
git push
```

That's all 10 parts. Every skill from your plan is now used at least once, the frontend runs in Docker on `localhost:3000`, and it's ready for a backend server: flip `NEXT_PUBLIC_USE_MOCK` and rebuild.

| Skill | Where you used it |
|---|---|
| Multi-stage build | `deps` → `builder` → `runner` |
| Standalone output | `output: "standalone"` |
| Build args for `NEXT_PUBLIC_` | `ARG`/`ENV` + compose `args` |
| Keeping secrets out | `.dockerignore`, root `.gitignore` |
| Non-root container | `USER node`, `--chown` |
| Port mapping | `"${FRONTEND_PORT}:3000"` |
| Config from env | root `.env` → compose `${...}` |



```user

rename deps to dependencies


```

There are 2 places to change, both in `frontend/Dockerfile`. The stage name and the `--from=` that points to it must match, or the build fails with "stage not found".

**Old:**
```dockerfile
FROM node:22-alpine AS deps
```
**New:**
```dockerfile
FROM node:22-alpine AS dependencies
```

**Old:**
```dockerfile
COPY --from=deps /app/node_modules ./node_modules
```
**New:**
```dockerfile
COPY --from=dependencies /app/node_modules ./node_modules
```

Then rebuild, because the Dockerfile changed:
```bash
docker compose up --build
```

```user

Explain what is "FROM node:22-alpine AS dependencies", "WORKDIR /app", "RUN npm ci", "--from", "COPY --from=dependencies /app/node_modules ./node_modules", "ARG NEXT_PUBLIC_USE_MOCK", "ENV NEXT_PUBLIC_USE_MOCK=$NEXT_PUBLIC_USE_MOCK", "ENV NODE_ENV=production", "ENV HOSTNAME=0.0.0.0", "--chown",  "USER node
  EXPOSE 3000
  CMD ["node", "server.js"]""dependencies", "builder", "runner"
is run mean build this layer first? why chose to build here?

```

Do you mean: "Does `RUN` mean 'build this layer first'? And why do we build in this stage?"

**Analogy for the whole file:** a recipe card 📇 that Docker follows from top to bottom. Each `FROM` starts a new kitchen (stage), and most lines are one step in that kitchen.

## The 3 stages: `dependencies`, `builder`, `runner`

These are **names you choose**, labels on each kitchen. Docker doesn't care what they're called; only `--from=` uses them. Only the **last** stage (`runner`) becomes your final image. The other two are thrown away after the build.

```
dependencies -> gets node_modules
builder      -> borrows node_modules, builds the app
runner       -> borrows only the built app        <- this is the image you run
```

## `FROM node:22-alpine AS dependencies`

- `FROM` means "start a new stage from this ready-made image".
- `node:22-alpine` is an image with **Node 22** already installed on **Alpine**, a tiny Linux (about 5 MB, compared with about 75 MB for Ubuntu).
- `AS dependencies` names this stage, so later lines can refer to it.

## `WORKDIR /app`

"Make the folder `/app` inside the container, and do everything from here on inside it." It's `mkdir /app && cd /app` in one line.

## `RUN npm ci`

**`RUN` runs a command now, during the build**, inside this stage, and saves the result. Here, `npm ci` installs packages from `package-lock.json`, so `/app/node_modules` now exists in this stage.

So yes, close to your guess: `RUN` does the work **at build time**, and the result is saved as a **layer** (a snapshot of the files after that step). It doesn't run when the container starts. That's `CMD`'s job, below.

## `COPY --from=dependencies /app/node_modules ./node_modules`

- `COPY` normally copies **from your computer** into the image.
- `--from=dependencies` changes that to **copy from another stage** instead.

```
dependencies stage: /app/node_modules
          │  COPY --from=dependencies
          ▼
builder stage:      /app/node_modules  (we're in WORKDIR /app, so ./node_modules = /app/node_modules)
```

## `ARG NEXT_PUBLIC_USE_MOCK` and `ENV NEXT_PUBLIC_USE_MOCK=$NEXT_PUBLIC_USE_MOCK`

```
root .env:  NEXT_PUBLIC_USE_MOCK=true
-> compose: args: NEXT_PUBLIC_USE_MOCK: ${NEXT_PUBLIC_USE_MOCK}    -> "true"
-> ARG:     receives "true"         (only exists while building)
-> ENV:     turns it into an env variable that `npm run build` can read
-> build:   bakes "true" into the browser JavaScript
```

- `ARG` is a **build-time input**, like a function parameter for the Dockerfile.
- `ENV` is an **environment variable**, the same as the ones in `.env.local`.
- `$NEXT_PUBLIC_USE_MOCK` reads the `ARG`'s value.

**Why both?** `npm run build` reads **env variables**, not `ARG`s. `ENV` hands the value over.

## `ENV NODE_ENV=production`

It tells Node and Next.js "this is the real thing, not development": no dev warnings, no Strict Mode double effects, and the smaller, faster code paths.

## `ENV HOSTNAME=0.0.0.0`

The address the server listens on:
- `localhost` means "only answer calls from **inside** this container", so your browser outside can't reach it ❌.
- `0.0.0.0` means "answer calls arriving from **any** network door", including Docker's port mapping ✅.

**Analogy:** A shop 🏪. `localhost` serves only staff already inside. `0.0.0.0` opens the front door to customers.

## `--chown=node:node`

`chown` means "change owner". Copied files are owned by `root` by default. `--chown=node:node` makes the user `node` (and group `node`) the owner, so the app can read its own files after the next line switches to that user.

## `USER node`, `EXPOSE 3000`, `CMD ["node", "server.js"]`

- **`USER node`**: from here on, run as the ordinary user `node` (it already exists in Node images), not `root`. If someone hacks the app, they get a normal user with limited power, not full control of the container.
- **`EXPOSE 3000`**: a **label** saying "this app uses port 3000". It doesn't open anything by itself. The real opening is compose's `ports: "3000:3000"`.
- **`CMD ["node", "server.js"]`**: the command that runs **when the container starts**, not during the build. `server.js` is the small server that `output: "standalone"` created.

## Why build in a separate stage?

**1. A small, safe final image.** The `builder` stage needs 690 MB of `node_modules`, TypeScript, ESLint and Vitest to build. The app only needs about 68 MB to *run*. `runner` copies only that 68 MB, so the build tools never reach the final image.

**2. Faster rebuilds (layer caching).** Docker remembers each step's result. If a step's inputs didn't change, it reuses the old result.

```
Stage dependencies:  COPY package.json package-lock.json  -> RUN npm ci
Stage builder:       COPY . .  (your code)                 -> RUN npm run build
```

**The story:** you edit `OrderItem.tsx` and rebuild:
- `package.json` didn't change, so `npm ci` is **reused from cache** ⚡ (that saves about a minute).
- Your code changed, so only `npm run build` runs again.

If `npm ci` came **after** `COPY . .`, then every single code change would reinstall all the packages. Copying only the 2 package files first is what makes the cache work.

| Line | When it happens | What it does |
|---|---|---|
| `FROM ... AS name` | build | starts a new stage from a base image |
| `WORKDIR /app` | build | make and enter `/app` |
| `COPY` | build | your computer → image |
| `COPY --from=stage` | build | another stage → this stage |
| `RUN` | build | runs a command, saves the result as a layer |
| `ARG` | build | input passed in by compose |
| `ENV` | build **and** run | environment variable |
| `USER` | run | which user runs the app |
| `EXPOSE` | (label only) | documents the port |
| `CMD` | **run** (container start) | starts the app |

```user

can I not use production? or should I separate another docker file called Dockerfile.dev and Dockerfile.prod?

still don't really understand "
--chown=node:node /app/.next/standalone ./"
What does it mean by: change owner? what is owner?
 Explain it's networking concept to me.

what is root? what us user node and group node​? what is owner? What are the differences between : user node and root? 

What does it mean by: If someone hacks the app, they get a normal user with limited power, not full control of the container.

does {ports: "3000:3000"} means my local 3000 connect to container's NAT 3000?  

what is CMD?

```

Do you mean: "Explain the concept behind it"? Owners are a **Linux file-permission** idea, not networking. Networking comes up in the `ports` question below.

## 1. Can I skip `production`? Do I need `Dockerfile.dev` and `Dockerfile.prod`?

**`NODE_ENV=production`:** you can delete that line and it will still run, because the `server.js` from `standalone` switches itself to production anyway. I'd keep it, because other libraries also read it and it makes the intent clear.

**Separate dev Dockerfile:** you can, and teams do. There are two common ways:
- Two files: `Dockerfile.dev` runs `npm run dev`, with your code **mounted** into the container so saving a file updates the page.
- One Dockerfile with an extra `dev` stage, plus a small `docker-compose.dev.yml` that picks it.

**My honest suggestion for this project: don't, yet.**
```
Coding every day   -> npm run dev on your Mac     (fast, hot reload, nothing new to learn)
"Does it ship?"    -> docker compose up --build   (the real production image)
```

A dev container earns its place once you add the backend server and Postgres, and want everything up with one command. That's a good next project.

## 2. What is an owner? What are root, user `node` and group `node`?

On Linux (the inside of every container), **every file has an owner**, and permissions say who may **read**, **write** or **run** it.

**Analogy:** A shared house 🏠.
- **root** is the **landlord**, with keys to every room. They can read, change or delete anything and install anything.
- **`node`** is a **tenant**, with a key to their own room only.
- A **group** is a set of tenants who share a key, like "everyone in the band can use the music room". The group `node` contains just the user `node`.

```
ls -l inside the container:
-rw-r--r--  root  root  server.js     <- owned by root: node can read, NOT change it
-rw-r--r--  node  node  server.js     <- owned by node: node can read AND change it
```

**`root` vs `node`:**
- `root` (user id 0) can do **everything**: edit system files, install programs, read every file, kill any process.
- `node` (user id 1000) is an ordinary user created by the Node image. It can only touch its own files and whatever others allow.

## 3. `COPY --from=builder --chown=node:node /app/.next/standalone ./`

Word by word:
```
COPY                       copy files
--from=builder             ...from the builder stage
--chown=node:node          ...and make user node / group node their owner
/app/.next/standalone      what to copy (inside builder)
./                         where to put it (= /app in the runner stage)
```

Without `--chown`, the copied files would be owned by **root**, the landlord. `--chown=node:node` hands the keys to the tenant who'll run the app.

**Why does `node` need to own them?** Next.js **writes** cache files into `.next/` while running. If root owned that folder, `node` couldn't write there, and you'd get "permission denied".

## 4. "If someone hacks the app, they get a normal user"

Imagine a bug in your app that lets an attacker **run commands** on the Next.js frontend server (this happens with buggy packages). Their commands run **as whatever user the app runs as**:

```
App runs as root (no USER line):
attacker -> install tools (apk add ...), edit any file, read everything
         -> plant code that steals every visitor's data
         -> a much better position to attack the computer running Docker

App runs as node (USER node):
attacker -> can't install programs, can't edit system files
         -> stuck inside one tenant's room
```

**Analogy:** A burglar 🦹 who gets into a tenant's room can mess up that room. A burglar holding the landlord's keys owns the whole house.

It doesn't make hacking impossible. It **limits the damage**, which is a key DevSecOps idea called *least privilege*: give each program only the access it needs.

## 5. Does `ports: "3000:3000"` connect my local 3000 to the container's 3000 through NAT?

**Yes**, that's the right idea. The container lives on its own **private network** inside Docker, with its own IP (something like `172.18.0.2`). Your Mac can't reach that directly, so Docker sets up **port forwarding** (a form of NAT) from your computer to the container:

```
"HOST_PORT : CONTAINER_PORT"
     │              │
  your Mac      inside the container

Browser -> localhost:3000 (your Mac)
        -> Docker forwards (NAT / port forwarding)
        -> 172.18.0.2:3000 (container) -> node server.js
```

On a Mac, Docker Desktop runs containers inside a small Linux virtual machine, so there's one extra hop, but the idea is the same.

**Try it 🔮:** set `FRONTEND_PORT=8080` in the root `.env` and run `docker compose up`. **Predict** which URL works. It should be `localhost:8080`, while the container still listens on 3000. This is also why `HOSTNAME=0.0.0.0` matters: forwarded traffic arrives through the container's network door, not as `localhost`.

## 6. What is `CMD`?

**The command that runs when the container starts.**

```
RUN npm run build          -> during docker build   (once, result saved in the image)
CMD ["node", "server.js"]  -> during docker run     (every time the container starts)
```

**Analogy:** `RUN` is cooking the meal at the factory 🏭. `CMD` is the instruction on the lunchbox: "heat and eat" 🍱. It happens later, every time someone opens it.

The container **lives as long as that command runs**. If `server.js` crashes, the container stops, and `restart: unless-stopped` in compose starts it again.

| | root | user `node` |
|---|---|---|
| User id | 0 | 1000 |
| Analogy | landlord 🔑 (all keys) | tenant (own room) |
| Edit system files / install programs | ✅ | ❌ |
| Read and write `/app` files | ✅ | ✅ (because of `--chown`) |
| If the app is hacked | attacker has full control of the container | attacker is boxed in |
| Default in Docker | yes, unless you write `USER` | only after `USER node` |

```user

why docker never copy src/ file?

```

It **does** copy `src/`, in the **builder** stage, with this line:

```dockerfile
COPY . .        # copies everything not in .dockerignore, including src/
```

It just doesn't copy `src/` into the **runner** stage, because the running app doesn't need it. `npm run build` **turns** `src/` into finished JavaScript inside `.next/`:

```
builder stage:
src/app/orders/page.tsx          ─┐
src/components/orders/*.tsx       │  npm run build
src/hooks/useOrders.ts            │  (TypeScript -> JavaScript, bundled, minified)
src/app/globals.css              ─┘
        │
        ▼
.next/standalone/  -> server.js + compiled server code (Server Components, pages)
.next/static/      -> compiled browser JS + CSS (Client Components, globals.css)

runner stage: copies ONLY .next/standalone + .next/static + public
```

**Analogy:** Baking a cake 🎂. `src/` is the recipe and the raw ingredients. The builder stage bakes it, and the runner stage only gets the **cake**. Customers eat the cake; they don't need the recipe.

The browser **can't even run** `.tsx` files. It only understands JavaScript and CSS, which is what the build produces.

Leaving `src/` out is also good for security: anyone who gets hold of the image only finds compiled code, not your readable source with its comments.

```user

Help me change it to One Dockerfile with an extra `dev` stage, plus a small `docker-compose.dev.yml` that picks it.

So I can develop when using docker container to run this app

```

Here are the changes: one new stage in the Dockerfile, and one new compose file. The production setup keeps working exactly as before.

**Honest note on testing:** `docker compose config` accepts the new file here, but this sandbox can't download the Node image, so I couldn't run the dev container itself.

## How the two modes differ

```
PROD  docker compose up --build
      Dockerfile: dependencies -> builder -> runner (last stage = default)
      code is COPIED and BUILT into the image   -> change code = rebuild

DEV   docker compose -f docker-compose.dev.yml up --build
      Dockerfile: dependencies -> dev   (target: dev stops here)
      your Mac's frontend/ folder is MOUNTED    -> save a file = page updates
```

**Analogy:** Prod is a **printed book** 📕: to fix a typo you reprint it. Dev is a **shared Google Doc** 📝: the container reads your Mac's files live, so edits show up straight away.

## Step 1: Add the `dev` stage to `frontend/Dockerfile`

Put it **right after** stage 1, so `runner` stays the **last** stage. Docker builds the last stage when no `target` is given, which keeps `docker compose up --build` meaning production.

**Old:**
```dockerfile
RUN npm ci

# ---------- Stage 2: build the app ----------
```
**New:**
```dockerfile
RUN npm ci

# ---------- Dev stage: next dev with hot reload (used by docker-compose.dev.yml) ----------
FROM dependencies AS dev
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev"]

# ---------- Stage 2: build the app ----------
```

- `FROM dependencies AS dev` starts from the `dependencies` stage instead of a fresh image. It already has `/app` and `node_modules`, so there's no second `npm ci`.
- `CMD ["npm", "run", "dev"]` runs `next dev`, which already listens on `0.0.0.0` by default (I checked the Next.js docs in your project), so no `HOSTNAME` is needed.
- It runs as root, with no `USER node`. That's acceptable **for dev only**: it avoids file-permission fights with the mounted folder, and this image never goes to a real server.

## Step 2: Create `docker-compose.dev.yml`

From the repo root:
```bash
touch docker-compose.dev.yml
```

`docker-compose.dev.yml`:
```yaml
# docker-compose.dev.yml  (repo root)
# Development: next dev with hot reload. Run with:
#   docker compose -f docker-compose.dev.yml up --build
services:
  frontend:
    build:
      context: ./frontend
      target: dev                 # stop at the "dev" stage of the Dockerfile
    environment:                  # read by next dev when it starts (no rebuild needed)
      NEXT_PUBLIC_USE_MOCK: ${NEXT_PUBLIC_USE_MOCK}
      NEXT_PUBLIC_API_URL: ${NEXT_PUBLIC_API_URL}
      NEXT_PUBLIC_EVENTS_URL: ${NEXT_PUBLIC_EVENTS_URL}
    ports:
      - "${FRONTEND_PORT}:3000"
    volumes:
      - ./frontend:/app           # your Mac's code, live inside the container
      - /app/node_modules         # ...but keep the container's own Linux node_modules
      - /app/.next                # ...and its own build cache
```

It uses the same root `.env` as production, so there's nothing new to set up.

**What's different from the prod file:**
- `target: dev` tells Docker to build only up to the `dev` stage.
- `environment:` instead of `args:`. `next dev` reads env variables **when it starts**, not at build time, so changing `.env` only needs a restart (no `--build`).
- **`volumes:`** are the hot-reload part ⚠️ (not from your prompt material):

```
./frontend:/app      -> "bind mount": the container's /app IS your Mac's frontend/ folder
/app/node_modules    -> "anonymous volume": a hole in that mount, so the container
/app/.next              keeps its OWN copy of these two folders
```

**Why the two holes?** Your Mac's `node_modules` contains **macOS** versions of some tools (Next.js's compiler includes native programs). The container is **Linux**, so it needs Linux versions. Without the hole, the Mac's copy would cover the Linux one, and `next dev` would crash.

## Step 3: Run dev mode

Stop anything already on port 3000 (`npm run dev`, or the prod container), then from the repo root:
```bash
docker compose -f docker-compose.dev.yml up --build
```

**Look for:** `▲ Next.js 16.4.3` and `✓ Ready`, then open `http://localhost:3000`.

**Test hot reload 🔮:** change the home page `<h1>` text in `frontend/src/app/page.tsx` and save. **Predict:** does the browser update without a rebuild? It should, within a moment.

Stop it:
```bash
docker compose -f docker-compose.dev.yml down
```

## Things to know

1. **It may feel slower than `npm run dev` on your Mac.** The Next.js docs in your project warn that on Mac, Docker Desktop's file sharing between your Mac and its Linux VM can delay file-change events, so updates might take seconds instead of instantly. If that bugs you, Docker Desktop's "synchronized file shares" setting is what the docs suggest.
2. **After adding a package** (`npm install something`), the container keeps its old `node_modules` in the anonymous volume. Rebuild **and** throw that volume away:
   ```bash
   docker compose -f docker-compose.dev.yml up --build -V
   ```
   `-V` means "make fresh anonymous volumes".
3. **Run one mode at a time.** Both use port 3000.
4. Your `frontend/.env.local` is visible inside the dev container (through the mount), but compose's `environment:` values **win** over it, so the root `.env` decides.

## Commit

```bash
git add .
git commit -m "Add dev stage and docker-compose.dev.yml for hot reload in Docker"
git push
```

| | Prod (`docker compose up --build`) | Dev (`docker compose -f docker-compose.dev.yml up --build`) |
|---|---|---|
| Dockerfile stages | `dependencies` → `builder` → `runner` | `dependencies` → `dev` |
| Runs | `node server.js` | `npm run dev` |
| Code in container | copied + compiled | mounted live from your Mac |
| Change code | rebuild | save the file |
| Change `NEXT_PUBLIC_` | rebuild (baked in) | restart |
| User | `node` | root (dev only) |
| Image size | small (~68 MB app) | big (all `node_modules`) |

```user
Explain code in docker-compose.yml and docker-compose.dev.yml

```

Both files describe **the same thing**, "how to run the `frontend` container". They differ in **how the code gets in** and **when the env values are used**. Here's every line, starting with the ones they share.

**Analogy:** compose files are an **order form** 📋 for Docker. "Build this, set these settings, open this door." The `Dockerfile` is the recipe; the compose file says which recipe to use and how to serve it.

## Lines in both files

### `services:`
The list of containers to run. Right now there's 1; later you'd add `backend:` and `db:` underneath, at the same level as `frontend:`.

### `frontend:`
**Your name** for this container. Docker uses it:
- in names, like the image `mini-orders-frontend`, and
- as its **address** on the private Docker network. Later, a `backend` container could reach this one at `http://frontend:3000`.

### `build:` and `context: ./frontend`
"Build the image yourself, using the `Dockerfile` in `./frontend`." The **context** is the folder Docker is allowed to read during the build. `COPY . .` copies from here, minus whatever `.dockerignore` excludes.

### `${NEXT_PUBLIC_USE_MOCK}` and the other `${...}` values
Compose fills these in **from the root `.env` file** before doing anything:
```
root .env:      NEXT_PUBLIC_USE_MOCK=true    FRONTEND_PORT=3000
compose sees:   ${NEXT_PUBLIC_USE_MOCK} -> "true"     ${FRONTEND_PORT} -> "3000"
```

Check the filled-in result any time with `docker compose config` (prod) or `docker compose -f docker-compose.dev.yml config` (dev).

### `ports: - "${FRONTEND_PORT}:3000"`
After filling in, this becomes `"3000:3000"`: your Mac's port 3000 is forwarded to the container's port 3000. The `-` means "a list item", because you could open several ports.

## Prod only: `docker-compose.yml`

### `args:`
Values handed to the Dockerfile's `ARG` lines **during the build**:
```
args: NEXT_PUBLIC_USE_MOCK: "true"
-> Dockerfile: ARG NEXT_PUBLIC_USE_MOCK -> ENV ... -> npm run build bakes "true" into the JS
```

They're used **once, at build time**. That's why changing `.env` needs `--build`.

### `restart: unless-stopped`
If `server.js` crashes, or your Mac restarts Docker, the container starts again by itself. It only stays stopped if **you** stopped it (`docker compose down` or `stop`). That's what you want for a "real" server. Dev doesn't have it, because if dev crashes you want to **see** it, not have it quietly restart.

### No `target:`
With no target, Docker builds the **last** stage (`runner`), which is the production image.

## Dev only: `docker-compose.dev.yml`

### `target: dev`
"Build the Dockerfile only **up to** the `dev` stage and use that." Docker builds `dependencies` → `dev` and skips `builder` and `runner`.

### `environment:`
Env variables set **inside the running container**, given to `npm run dev` **when it starts**:
```
environment: NEXT_PUBLIC_USE_MOCK: "true"
-> container starts -> next dev reads process.env.NEXT_PUBLIC_USE_MOCK = "true"
```

**`args` vs `environment`:** `args` is like a printed price tag (fixed when the image is made). `environment` is like a whiteboard price (rewritten every time you open the shop). In dev, change `.env` and just restart, with no rebuild.

### `volumes:` (the hot-reload magic)

```yaml
- ./frontend:/app        # HOST_PATH:CONTAINER_PATH  -> a "bind mount"
- /app/node_modules      # only a container path     -> an "anonymous volume"
- /app/.next
```

**Line 1, `./frontend:/app`:** the container's `/app` folder **is** your Mac's `frontend/` folder. It's not a copy; it's a window 🪟 onto the same files:
```
You save src/app/page.tsx on your Mac
-> the container sees the change in /app/src/app/page.tsx
-> next dev recompiles -> browser updates
```

**Lines 2 and 3, `/app/node_modules` and `/app/.next`:** these punch **holes** in that window. For those two folders, the container uses its **own** storage instead of your Mac's:
```
/app/src           -> your Mac's files (live)
/app/package.json  -> your Mac's file
/app/node_modules  -> the container's own Linux copy (from npm ci in the image)
/app/.next         -> the container's own build cache
```

**Why:** your Mac's `node_modules` has **macOS** builds of native tools, and the container needs **Linux** ones. And `.next` is cache that two operating systems shouldn't fight over.

## The two commands

```bash
docker compose up --build                          # reads docker-compose.yml (default name)
docker compose -f docker-compose.dev.yml up --build   # -f = "use THIS file instead"
```

| Line | `docker-compose.yml` (prod) | `docker-compose.dev.yml` (dev) |
|---|---|---|
| `build.context` | `./frontend` | `./frontend` |
| `build.target` | none → last stage `runner` | `dev` |
| Env values | `args:` → baked at **build** | `environment:` → read at **start** |
| Change `.env` | rebuild (`--build`) | restart |
| `ports` | `${FRONTEND_PORT}:3000` | `${FRONTEND_PORT}:3000` |
| `volumes` | none: code is inside the image | mount `./frontend`, with holes for `node_modules` and `.next` |
| `restart` | `unless-stopped` | none (you want to see crashes) |
| Command | `docker compose up --build` | `docker compose -f docker-compose.dev.yml up --build` |

```user

why dev mode skip builder and runner stage?

```

Two reasons: **Docker only builds what the target needs**, and **dev mode doesn't need a production build**.

## 1. `target: dev` means "I only want this stage"

Docker looks at which stages the `dev` stage **depends on**, and builds only those:

```
dev        <- FROM dependencies     -> needs: dependencies
builder    <- COPY --from=dependencies   (nobody asked for builder)
runner     <- COPY --from=builder        (nobody asked for runner)

target: dev -> builds: dependencies -> dev   ✅
               skips:  builder, runner        (not needed for dev)
```

**Analogy:** A train line 🚆 with stops `dependencies → dev`, and a separate branch line `dependencies → builder → runner`. Your ticket says "dev", so the train goes to `dev` and never travels the other branch.

For production (no `target`), Docker wants the **last** stage, `runner`. That needs `builder`, which needs `dependencies`, so it builds that whole branch and never touches `dev`.

## 2. Dev mode doesn't need what `builder` and `runner` make

```
builder: npm run build   -> compiles ALL pages once, optimised, minified (~a minute)
runner:  node server.js  -> serves that finished build, can't change

dev:     npm run dev     -> compiles each page ON DEMAND, in memory,
                            and recompiles when you save a file
```

`next dev` **is** the builder and the server in one, in a "live" version:
- **builder's job:** dev compiles your code itself, as you open each page.
- **runner's job:** dev serves pages itself.

Building `builder` too would mean waiting a minute for a production build that dev mode throws away.

**Analogy:** A cooking show 🧑‍🍳 (dev) vs a frozen-meal factory 🏭 (prod). The show cooks live in front of you, and you can change the recipe mid-show. The factory cooks everything ahead of time, freezes it and ships it. A cooking show doesn't need the factory.

| | Dev (`target: dev`) | Prod (no target) |
|---|---|---|
| Stages built | `dependencies` → `dev` | `dependencies` → `builder` → `runner` |
| Compiling | live, page by page, on save | once, everything, at build time |
| Server | `next dev` | `node server.js` |
| Skipped | `builder`, `runner` | `dev` |


```user


```

```user


```

```user


```

```user


```

```user


```

```user


```

```user


```

```user


```

```user


```

```user


```

```user


```

```user


```

```user


```

```user


```

```user


```

```user


```

```user


```

```user


```

```user


```

```user


```

```user


```

```user


```

```user


```

```user


```

```user


```

