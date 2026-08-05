"use client";

/**
 * ThemeProvider
 *
 * Manages dark/light mode and accent color variant by writing data attributes
 * and classes to <html>. State is persisted in localStorage.
 *
 * Usage:
 *   - Wrap children in layout.tsx
 *   - Use useTheme() in any Client Component to read/toggle the theme
 *
 * CSS contract (tokens.css):
 *   .dark                → dark mode (user-forced)
 *   .light               → light mode (user-forced, overrides media query)
 *   [data-accent="teal"] → teal accent (default, no attribute needed)
 *   [data-accent="amber"]→ amber accent
 */

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type ColorMode = "system" | "light" | "dark";
export type AccentVariant = "teal" | "amber";

interface ThemeContextValue {
  colorMode: ColorMode;
  accent: AccentVariant;
  setColorMode: (mode: ColorMode) => void;
  setAccent: (accent: AccentVariant) => void;
  /** Effective resolved mode (light or dark), accounting for system preference */
  resolvedMode: "light" | "dark";
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return ctx;
}

const STORAGE_KEY_MODE = "nvl-color-mode";
const STORAGE_KEY_ACCENT = "nvl-accent";

function applyTheme(mode: ColorMode, accent: AccentVariant): void {
  const root = document.documentElement;
  root.classList.remove("dark", "light");
  if (mode === "dark") root.classList.add("dark");
  if (mode === "light") root.classList.add("light");
  root.setAttribute("data-accent", accent);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [colorMode, setColorModeState] = useState<ColorMode>("system");
  const [accent, setAccentState] = useState<AccentVariant>("teal");
  const [resolvedMode, setResolvedMode] = useState<"light" | "dark">("light");

  // Initialise from localStorage on mount (SSR-safe)
  useEffect(() => {
    const storedMode = (localStorage.getItem(STORAGE_KEY_MODE) ?? "system") as ColorMode;
    const storedAccent = (localStorage.getItem(STORAGE_KEY_ACCENT) ?? "teal") as AccentVariant;
    setColorModeState(storedMode);
    setAccentState(storedAccent);
    applyTheme(storedMode, storedAccent);
  }, []);

  // Track system preference for resolvedMode
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const update = () => {
      if (colorMode === "system") {
        setResolvedMode(mq.matches ? "dark" : "light");
      } else {
        setResolvedMode(colorMode);
      }
    };
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [colorMode]);

  function setColorMode(mode: ColorMode) {
    setColorModeState(mode);
    localStorage.setItem(STORAGE_KEY_MODE, mode);
    applyTheme(mode, accent);
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    setResolvedMode(mode === "system" ? (mq.matches ? "dark" : "light") : mode);
  }

  function setAccent(next: AccentVariant) {
    setAccentState(next);
    localStorage.setItem(STORAGE_KEY_ACCENT, next);
    applyTheme(colorMode, next);
  }

  return (
    <ThemeContext.Provider value={{ colorMode, accent, setColorMode, setAccent, resolvedMode }}>
      {children}
    </ThemeContext.Provider>
  );
}
