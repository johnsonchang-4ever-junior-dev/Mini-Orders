// src/components/ThemeToggle.tsx
"use client"; // this file calls a hook itself, so it marks itself

import { useTheme } from "@/context/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggle } = useTheme(); // tune in to the radio station

  return (
    <button type="button" className="tab" data-action="toggle-theme" onClick={toggle}>
      Theme: {theme ?? "Default"}
    </button>
  );
}