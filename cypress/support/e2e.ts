// Cypress E2E support file.
// Runs before each E2E spec.

import "./commands";

/**
 * React #418 — hydration mismatch on <html> caused by next-themes.
 *
 * next-themes injects an inline script that reads localStorage and adds a theme
 * class ('dark' / 'light') to <html> before React hydrates.  In CI (and on
 * machines whose system colour-scheme is 'dark') this causes a class mismatch
 * between the SSR output and the client DOM, triggering React error #418:
 * "…the entire root will switch to client rendering."
 *
 * The application recovers correctly via client-side rendering — the page
 * renders with the correct theme, passes all accessibility checks, and behaves
 * identically to a successful hydration from the user's perspective.
 *
 * Resolution: suppress this specific error in E2E so that functional tests can
 * run against the correctly-rendered client output.
 *
 * The root-cause design decision (static site + client theme detection) is
 * documented in ADR 009/010.  A cookie-based SSR approach would eliminate #418
 * at the cost of making every route dynamic — accepted trade-off.
 */
Cypress.on("uncaught:exception", (err) => {
  if (err.message.includes("Minified React error #418")) return false;
});

