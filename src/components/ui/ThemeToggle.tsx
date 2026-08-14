"use client";

import * as React from "react";
import { useSyncExternalStore } from "react";
import { IconButton } from "./IconButton";
import { cn } from "@/lib/utils";

// ── Theme store ────────────────────────────────────────────────────────────
// Reads/writes the .dark class on <html> and persists to localStorage.

function getSnapshot(): "dark" | "light" {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

function getServerSnapshot(): "light" {
  // Server always returns light — the no-flash script handles actual preference.
  return "light";
}

function subscribe(callback: () => void): () => void {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  return () => observer.disconnect();
}

function setTheme(next: "dark" | "light"): void {
  const root = document.documentElement;
  if (next === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
  try {
    localStorage.setItem("theme", next);
  } catch {
    // ignore storage errors (private browsing, quota)
  }
  // Enable smooth transitions after first manual toggle
  root.classList.add("theme-ready");
}

// ── Icons ──────────────────────────────────────────────────────────────────

function SunIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={cn("size-[1.125em]", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3v1.5m0 15V21m8.485-8.485h-1.5M4.515 12H3m15.364-6.364-1.06 1.06M6.696 17.304l-1.06 1.06M18.364 18.364l-1.06-1.06M6.696 6.696l-1.06-1.06M12 7.5a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9Z"
      />
    </svg>
  );
}

function MoonIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={cn("size-[1.125em]", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75 9.75 9.75 0 0 1 8.25 6c0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 12c0 5.385 4.365 9.75 9.75 9.75 4.494 0 8.306-3.02 9.502-7.155-.083.007-.166.007-.25.007l.25-.85Z"
      />
    </svg>
  );
}

// ── Component ──────────────────────────────────────────────────────────────

export interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const mode = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // On server / first paint, mode is "light" — placeholder keeps same dimensions.
  const isMounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  return (
    <IconButton
      aria-label={mode === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      variant="ghost"
      size="md"
      className={className}
      onClick={() => setTheme(mode === "dark" ? "light" : "dark")}
    >
      {isMounted ? (
        mode === "dark" ? <SunIcon /> : <MoonIcon />
      ) : (
        // Server placeholder — same bounding box, no layout shift on hydration.
        <span aria-hidden="true" className="size-[1.125em] block" />
      )}
    </IconButton>
  );
}
