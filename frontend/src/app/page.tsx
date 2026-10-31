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