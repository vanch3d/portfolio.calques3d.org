/**
 * PR snapshot spec — manual only, never runs in CI.
 *
 * Invoked by the /pr-snapshots skill via:
 *   node .claude/skills/pr-snapshots/scripts/take-snapshots.mjs --routes <routes>
 *
 * Routes are passed via CYPRESS_ROUTES env var (→ Cypress.env("ROUTES")).
 * Using env vars avoids Cypress --env comma-separator conflicts with route paths.
 *
 * Cypress.env("ROUTES") — comma-separated list of app routes to visit
 * Cypress.env("LABEL")  — optional suffix added to filenames (e.g. "before", "after")
 *
 * When ROUTES is empty (e.g. accidental CI inclusion), all tests skip gracefully.
 */

const rawRoutes = Cypress.env("ROUTES") ?? "";
const label = Cypress.env("LABEL") ?? "";

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
      cy.screenshot(name, { overwrite: true });
    });
  });
});
