/**
 * PR snapshot spec — manual only, never runs in CI.
 *
 * Invoked by the /pr-snapshots skill via:
 *   node .claude/skills/pr-snapshots/scripts/take-snapshots.mjs --routes <routes>
 *
 * Routes are passed via CYPRESS_ROUTES env var (→ Cypress.env("ROUTES")).
 * Using env vars avoids Cypress --env comma-separator conflicts with route paths.
 *
 * Cypress.env("ROUTES")  — comma-separated list of app routes to visit
 * Cypress.env("LABEL")   — optional suffix added to filenames (e.g. "before", "after")
 * Cypress.env("CAPTURE") — "viewport" (default) | "fullPage"
 *
 * When ROUTES is empty (e.g. accidental CI inclusion), all tests skip gracefully.
 *
 * axe / cy.checkA11y() is intentionally absent: this spec is a screenshot-capture
 * tool, not an accessibility test. Every route exercised here has its own dedicated
 * E2E spec (cypress/e2e/) that calls cy.injectAxe() + cy.checkA11y(). Running axe
 * here would be redundant and would slow down snapshot capture for no coverage gain.
 */

const rawRoutes = Cypress.env("ROUTES") ?? "";
const label = Cypress.env("LABEL") ?? "";
const capture: "viewport" | "fullPage" = Cypress.env("CAPTURE") === "fullPage" ? "fullPage" : "viewport";

const routes: string[] = rawRoutes
  .split(",")
  .map((r: string) => r.trim())
  .filter(Boolean);

function routeToName(route: string): string {
  const slug = route.replace(/^\//, "").replace(/\//g, "-") || "root";
  return label ? `${slug}--${label}` : slug;
}

describe("PR snapshots", () => {
  if (routes.length === 0) {
    it("skipped — no routes provided", () => {
      cy.log("No routes configured. This spec only runs via the /pr-snapshots skill.");
    });
    return;
  }

  routes.forEach((route) => {
    const name = routeToName(route);

    it(`snapshot: ${route}`, () => {
      cy.visit(route);
      cy.get("body").should("be.visible");
      // Wait for fonts and layout to settle
      cy.wait(400);
      cy.screenshot(name, { overwrite: true, capture });
    });
  });
});
