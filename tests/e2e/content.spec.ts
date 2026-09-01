import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

/**
 * Content pipeline tests — verify data loaders work end-to-end
 * against a real deployed environment.
 *
 * Targets: /test/cv, /test/research, /test/publications
 * These routes expose raw content for development verification only.
 */

test("test/cv: no accessibility violations", async ({ page }) => {
  await page.goto("/test/cv");
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(results.violations).toEqual([]);
});

test("test/cv: renders at least one position row", async ({ page }) => {
  await page.goto("/test/cv");
  await expect(page.locator("h1")).toContainText("Positions");
  await expect(page.locator("table tbody tr").first()).toBeVisible();
});

test("test/research: no accessibility violations", async ({ page }) => {
  await page.goto("/test/research");
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(results.violations).toEqual([]);
});

test("test/research: renders at least one project row", async ({ page }) => {
  await page.goto("/test/research");
  await expect(page.locator("h1")).toContainText("Research projects");
  await expect(page.locator("table tbody tr").first()).toBeVisible();
});

test("test/publications: no accessibility violations", async ({ page }) => {
  await page.goto("/test/publications");
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(results.violations).toEqual([]);
});

test("test/publications: renders heading and no error block", async ({ page }) => {
  await page.goto("/test/publications");
  await expect(page.locator("h1")).toContainText("Publications");
  await expect(page.locator("pre")).not.toBeVisible();
  await expect(page.locator("table tbody tr").first()).toBeVisible();
});
