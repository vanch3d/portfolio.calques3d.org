"use client";

/**
 * ThemeProvider
 *
 * Composes two concerns:
 *   1. Dark/light/system mode — delegated to next-themes (NextThemesProvider).
 *      next-themes injects its own inline script and handles suppressHydrationWarning
 *      correctly for React 19 + Next.js App Router.
 *   2. Accent colour variant (teal | amber) — managed by AccentProvider via
 *      localStorage and the `data-accent` attribute on <html>.
 *
 * useTheme() returns a unified interface that covers both concerns, so callers
 * (SiteHeader, future settings panel) import from this file only.
 *
 * CSS contract (tokens.css):
 *   .dark                → dark mode
 *   .light               → light mode (next-themes adds this class when forced)
 *   [data-accent="teal"] → teal accent (default)
 *   [data-accent="amber"]→ amber accent
 */

import { ThemeProvider as NextThemesProvider, useTheme as useNextTheme } from "next-themes";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type ColorMode = "system" | "light" | "dark";
export type AccentVariant = "teal" | "amber";

export interface ThemeContextValue {
  colorMode: ColorMode;
  accent: AccentVariant;
  setColorMode: (mode: ColorMode) => void;
  setAccent: (accent: AccentVariant) => void;
  /** Effective resolved mode (light or dark), accounting for system preference */
  resolvedMode: "light" | "dark";
}

export const ThemeContext = createContext<ThemeContextValue | null>(null);

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return ctx;
}

const STORAGE_KEY_ACCENT = "nvl-accent";

/**
 * AccentProvider — internal. Must be rendered inside NextThemesProvider so it
 * can call useNextTheme() to read the resolved dark/light state.
 */
function AccentProvider({ children }: { children: ReactNode }) {
  const { theme, resolvedTheme, setTheme } = useNextTheme();

  // Read localStorage in the initializer — runs once on first render (client only).
  // Avoids calling setState inside an effect, which triggers cascading renders in React 19.
  const [accent, setAccentState] = useState<AccentVariant>(
    () => (localStorage.getItem(STORAGE_KEY_ACCENT) ?? "teal") as AccentVariant
  );

  // Sync the data-accent attribute to <html> whenever accent changes.
  // DOM write only — no setState, so no cascade.
  useEffect(() => {
    document.documentElement.setAttribute("data-accent", accent);
  }, [accent]);

  function setColorMode(mode: ColorMode) {
    setTheme(mode);
  }

  function setAccent(next: AccentVariant) {
    setAccentState(next);
    localStorage.setItem(STORAGE_KEY_ACCENT, next);
    document.documentElement.setAttribute("data-accent", next);
  }

  return (
    <ThemeContext.Provider
      value={{
        colorMode: (theme ?? "system") as ColorMode,
        resolvedMode: (resolvedTheme ?? "light") as "light" | "dark",
        setColorMode,
        accent,
        setAccent,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      storageKey="nvl-color-mode"
      nonce=""
    >
      <AccentProvider>{children}</AccentProvider>
    </NextThemesProvider>
  );
}
