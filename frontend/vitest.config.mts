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