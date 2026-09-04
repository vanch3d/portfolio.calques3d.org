/**
 * PR screenshot spec — manual only, never runs in CI.
 *
 * Run via the /pr skill, or directly:
 *   pnpm cypress run --e2e --spec 'cypress/snapshots/pr-screenshots.cy.ts' \
 *     --env routes=/lab/design-system,/lab/design-system/colors
 *
 * Cypress.env("routes")  — comma-separated list of app routes to visit
 * Cypress.env("label")   — optional viewport label suffix (e.g. "before", "after")
 *
 * Screenshots are saved to cypress/screenshots/ and then moved to
 * .docs/screenshots/{branch}/ by the scripts/pr-screenshots.mjs script.
 */

// Routes passed via CYPRESS_ROUTES env var (→ Cypress.env("ROUTES")).
// Using env vars avoids Cypress --env comma-separator conflicts with route paths.
const rawRoutes = Cypress.env("ROUTES") ?? "";
const label = Cypress.env("LABEL") ?? "";

const routes: string[] = rawRoutes
  .split(",")
  .map((r: string) => r.trim())
  .filter(Boolean);

// When routes is empty (e.g. in CI where this spec runs incidentally),
// skip all tests gracefully rather than failing the suite.
function routeToName(route: string): string {
  const slug = route.replace(/^\//, "").replace(/\//g, "-") || "root";
  return label ? `${slug}--${label}` : slug;
}

describe("PR screenshots", () => {
  if (routes.length === 0) {
    it("skipped — no routes provided (pass --env routes=/path1,/path2 to the Cypress run)", () => {
      cy.log("No routes configured. This spec only runs when invoked manually via the /pr skill.");
    });
    return;
  }

  routes.forEach((route) => {
    const name = routeToName(route);

    it(`screenshot: ${route}`, () => {
      cy.visit(route);
      // Wait for fonts and layout to settle before shooting
      cy.get("body").should("be.visible");
      cy.wait(400);
      cy.screenshot(name, { overwrite: true });
    });
  });
});
