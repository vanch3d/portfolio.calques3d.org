import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

/**
 * Smoke tests — run against live Vercel preview on every PR.
 *
 * Covers: home page renders, deployment meta tags are present,
 * and basic accessibility on the home page.
 */

test("home: no accessibility violations", async ({ page }) => {
  await page.goto("/");
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(results.violations).toEqual([]);
});

test("home: heading and test-route links render", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("h1")).toBeVisible();
  await expect(page.locator('a[href="/test/cv"]')).toBeVisible();
  await expect(page.locator('a[href="/test/research"]')).toBeVisible();
  await expect(page.locator('a[href="/test/publications"]')).toBeVisible();
});

test("deployment: x-commit meta tag is present and non-empty", async ({ page }) => {
  await page.goto("/");
  const commit = await page.locator('meta[name="x-commit"]').getAttribute("content");
  expect(commit).toBeTruthy();
  expect(commit).not.toBe("");
});

test("deployment: x-env meta tag is present", async ({ page }) => {
  await page.goto("/");
  const env = await page.locator('meta[name="x-env"]').getAttribute("content");
  expect(env).toBeTruthy();
});
