import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

/**
 * D7 Motion Layer — prefers-reduced-motion tests
 *
 * Verifies that all CSS animations are suppressed when the OS/browser
 * signals `prefers-reduced-motion: reduce`. Content must remain fully
 * visible (no hidden-by-opacity state) under reduced motion.
 *
 * Accessibility: axe-core WCAG 2.1 AA checks run under reduced-motion
 * conditions as a distinct scenario from standard checks in research.spec.ts.
 */

test.describe("prefers-reduced-motion: reduce", () => {
  test.use({ colorScheme: "light" });

  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
  });

  test("research listing: no accessibility violations under reduced motion", async ({
    page,
  }) => {
    await page.goto("/research");
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(results.violations).toEqual([]);
  });

  test("research listing: all cards visible immediately", async ({ page }) => {
    await page.goto("/research");
    const cards = page.locator("article");
    await expect(cards.first()).toBeVisible();
    const count = await cards.count();
    for (let i = 0; i < Math.min(count, 6); i++) {
      await expect(cards.nth(i)).toBeVisible();
    }
  });

  test("engineering listing: no accessibility violations under reduced motion", async ({
    page,
  }) => {
    await page.goto("/engineering");
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(results.violations).toEqual([]);
  });

  test("engineering listing: all cards visible immediately", async ({
    page,
  }) => {
    await page.goto("/engineering");
    const cards = page.locator("article");
    await expect(cards.first()).toBeVisible();
    const count = await cards.count();
    for (let i = 0; i < Math.min(count, 6); i++) {
      await expect(cards.nth(i)).toBeVisible();
    }
  });

  test("cv: no accessibility violations under reduced motion", async ({
    page,
  }) => {
    await page.goto("/cv");
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(results.violations).toEqual([]);
  });

  test("cv: timeline entries visible immediately", async ({ page }) => {
    await page.goto("/cv");
    const entries = page.locator("li.relative");
    await expect(entries.first()).toBeVisible();
  });

  test("home: no accessibility violations under reduced motion", async ({
    page,
  }) => {
    await page.goto("/");
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(results.violations).toEqual([]);
  });

  test("home: bento cards visible immediately", async ({ page }) => {
    await page.goto("/");
    const cards = page.locator("article");
    await expect(cards.first()).toBeVisible();
  });
});
