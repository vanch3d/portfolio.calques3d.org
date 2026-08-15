"use client";

import { useSyncExternalStore } from "react";

// ── Store factory ──────────────────────────────────────────────────────────
// One store instance per sentinel ID, created at module level so it survives
// re-renders. IntersectionObserver fires when the sentinel leaves the viewport;
// scrolled flips to true and all subscribers re-render.

type UnsubscribeFn = () => void;

interface ScrolledStore {
  subscribe: (callback: () => void) => UnsubscribeFn;
  getSnapshot: () => boolean;
  getServerSnapshot: () => false;
}

function createScrolledStore(sentinelId: string): ScrolledStore {
  let scrolled = false;
  const listeners = new Set<() => void>();

  if (typeof window !== "undefined") {
    const sentinel = document.getElementById(sentinelId);
    if (sentinel) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          scrolled = !entry.isIntersecting;
          listeners.forEach((l) => l());
        },
        { threshold: 0 }
      );
      observer.observe(sentinel);
    }
  }

  return {
    subscribe: (callback) => {
      listeners.add(callback);
      return () => listeners.delete(callback);
    },
    getSnapshot: () => scrolled,
    getServerSnapshot: () => false,
  };
}

const NAV_SENTINEL_ID = "nav-sentinel";
const scrolledStore = createScrolledStore(NAV_SENTINEL_ID);

export function useScrolledNav(): boolean {
  return useSyncExternalStore(
    scrolledStore.subscribe,
    scrolledStore.getSnapshot,
    scrolledStore.getServerSnapshot
  );
}
