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