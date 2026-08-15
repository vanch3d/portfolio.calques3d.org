"use client";

import { useSyncExternalStore } from "react";

// ── Store ──────────────────────────────────────────────────────────────────

function getSnapshot(): "dark" | "light" {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

function getServerSnapshot(): "light" {
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

// ── Public API ─────────────────────────────────────────────────────────────

export type Theme = "dark" | "light";

export function setTheme(next: Theme): void {
  const root = document.documentElement;
  if (next === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
  try {
    localStorage.setItem("theme", next);
  } catch {
    // ignore storage errors (private browsing, quota exceeded)
  }
  root.classList.add("theme-ready");
}

export function useTheme(): Theme {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function useIsMounted(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}
