/**
 * ThemeScript — inline script injected into <head> before hydration.
 *
 * Reads localStorage and applies the correct classes and data-attributes to
 * <html> synchronously, before the first paint. This eliminates flash of
 * wrong theme (FOWT) on initial load.
 *
 * This is a Server Component — it renders a <script> tag with no client JS.
 */

const script = `
(function() {
  try {
    var mode = localStorage.getItem('nvl-color-mode') || 'system';
    var accent = localStorage.getItem('nvl-accent') || 'teal';
    var root = document.documentElement;
    if (mode === 'dark') root.classList.add('dark');
    else if (mode === 'light') root.classList.add('light');
    root.setAttribute('data-accent', accent);
  } catch (e) {}
})();
`.trim();

export function ThemeScript() {
  return (
    <script
      dangerouslySetInnerHTML={{ __html: script }}
      suppressHydrationWarning
    />
  );
}
