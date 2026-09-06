import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

/**
 * Smoke tests — run against live Vercel preview on every PR.
 *
 * Covers route availability, basic page composition, and accessibility
 * at the page level. Component-level assertions belong in Cypress CT specs.
 * Cross-page navigation flows are covered in Cypress E2E specs.
 *
 * Does NOT test:
 *   - Individual component class names or prop variants (Cypress CT)
 *   - Breadcrumb active state, One Red Rule invariant (Cypress E2E)
 *   - Section nav link text or deep content regions (Cypress E2E)
 */

// ── Route availability ────────────────────────────────────────────────────────

test.describe("route availability", () => {
  const routes = [
    "/",
    "/lab",
    "/lab/design-system",
    "/lab/design-system/colors",
    "/lab/design-system/typography",
    "/lab/design-system/atoms",
    "/lab/adr",
  ];

  for (const route of routes) {
    test(`${route} responds with HTTP 200`, async ({ page }) => {
      const response = await page.goto(route);
      expect(response?.status()).toBe(200);
    });
  }
});

// ── Homepage (/) ──────────────────────────────────────────────────────────────

test.describe("homepage (/)", () => {
  test("renders a visible h1", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toBeVisible();
  });

  test("has no axe accessibility violations", async ({ page }) => {
    await page.goto("/");
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(results.violations).toEqual([]);
  });
});

// ── Lab index (/lab) ──────────────────────────────────────────────────────────

test.describe("lab index (/lab)", () => {
  test("shows a link to /lab/design-system", async ({ page }) => {
    await page.goto("/lab");
    await expect(page.locator('a[href="/lab/design-system"]')).toBeVisible();
  });

  test("shows a link to /lab/adr", async ({ page }) => {
    await page.goto("/lab");
    await expect(page.locator('a[href="/lab/adr"]')).toBeVisible();
  });
});

// ── Design system showcase ────────────────────────────────────────────────────

test.describe("design system showcase", () => {
  test("/lab/design-system: renders the page heading", async ({ page }) => {
    await page.goto("/lab/design-system");
    await expect(page.locator("h1")).toContainText("The Construction on Tracing Paper");
  });

  test("/lab/design-system: has no axe accessibility violations", async ({ page }) => {
    await page.goto("/lab/design-system");
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(results.violations).toEqual([]);
  });

  test("/lab/design-system/colors: renders the page heading", async ({ page }) => {
    await page.goto("/lab/design-system/colors");
    await expect(page.locator("h1")).toContainText("Colours");
  });

  test("/lab/design-system/colors: has no axe accessibility violations", async ({ page }) => {
    await page.goto("/lab/design-system/colors");
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(results.violations).toEqual([]);
  });

  test("/lab/design-system/typography: renders the page heading", async ({ page }) => {
    await page.goto("/lab/design-system/typography");
    await expect(page.locator("h1")).toContainText("Typography");
  });

  test("/lab/design-system/typography: has no axe accessibility violations", async ({ page }) => {
    await page.goto("/lab/design-system/typography");
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(results.violations).toEqual([]);
  });

  test("/lab/design-system/atoms: renders the page heading", async ({ page }) => {
    await page.goto("/lab/design-system/atoms");
    await expect(page.locator("h1")).toContainText("Atoms");
  });

  test("/lab/design-system/atoms: has no axe accessibility violations", async ({ page }) => {
    await page.goto("/lab/design-system/atoms");
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(results.violations).toEqual([]);
  });
});

// ── ADR register ─────────────────────────────────────────────────────────────

test.describe("ADR register (/lab/adr)", () => {
  test("renders the register heading", async ({ page }) => {
    await page.goto("/lab/adr");
    await expect(page.locator("h1")).toBeVisible();
  });

  test("has no axe accessibility violations", async ({ page }) => {
    await page.goto("/lab/adr");
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(results.violations).toEqual([]);
  });

  test("renders the register table with at least one row", async ({ page }) => {
    await page.goto("/lab/adr");
    await expect(page.locator("tbody tr").first()).toBeVisible();
  });
});

// ── Navigation flows ──────────────────────────────────────────────────────────

test.describe("navigation flows", () => {
  test("lab → design-system via nav link", async ({ page }) => {
    await page.goto("/lab");
    await page.locator('a[href="/lab/design-system"]').first().click();
    await expect(page).toHaveURL("/lab/design-system");
  });

  test("design-system → colors via section link", async ({ page }) => {
    await page.goto("/lab/design-system");
    await page.locator('a[href="/lab/design-system/colors"]').first().click();
    await expect(page).toHaveURL("/lab/design-system/colors");
  });

  test("design-system → typography via section link", async ({ page }) => {
    await page.goto("/lab/design-system");
    await page.locator('a[href="/lab/design-system/typography"]').first().click();
    await expect(page).toHaveURL("/lab/design-system/typography");
  });

  test("sub-page → lab via breadcrumb link", async ({ page }) => {
    await page.goto("/lab/design-system/colors");
    await page.locator('a[href="/lab"]').first().click();
    await expect(page).toHaveURL("/lab");
  });
});
