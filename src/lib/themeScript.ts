"use client";

// Reads the stored theme preference and applies .dark to <html> before React
// hydrates. Exported as a named function so it can be unit-tested; the IIFE
// string below is derived from it to keep tests and the inline script in sync.
export function applyTheme(): void {
  try {
    const stored = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (stored === "dark" || (stored === null && prefersDark)) {
      document.documentElement.classList.add("dark");
    }
  } catch {
    // Ignore errors (private browsing, storage quota exceeded)
  }
}

// Injected into <head> via dangerouslySetInnerHTML so it runs synchronously
// before the first paint, preventing a flash of the wrong colour mode.
export const themeScript = `(${applyTheme.toString()})();`;
