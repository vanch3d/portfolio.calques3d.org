// Reads the stored theme preference and applies .dark to <html> before React
// hydrates. Exported as a named function so it can be unit-tested independently.
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

// Static minified string — NOT derived from applyTheme.toString() to avoid
// non-determinism across Turbopack server/client bundles (hydration mismatch).
// Keep this in sync with applyTheme() above by hand when the logic changes.
export const themeScript =
  `(function(){try{` +
  `var s=localStorage.getItem("theme");` +
  `var d=window.matchMedia("(prefers-color-scheme: dark)").matches;` +
  `if(s==="dark"||(s===null&&d)){document.documentElement.classList.add("dark")}` +
  `}catch(e){}})();`;
