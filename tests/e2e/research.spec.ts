import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

/**
 * Research section — full E2E against live deployment.
 *
 * These tests hit real ISR/SSG routes with live Zotero data.
 * Run against Vercel preview via PLAYWRIGHT_BASE_URL in CI.
 *
 * Accessibility: axe-core WCAG 2.1 AA checks on all pages.
 * Server Components render to static HTML — axe sees the full DOM.
 */

test("research listing: no accessibility violations", async ({ page }) => {
  await page.goto("/research");
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(results.violations).toEqual([]);
});

test("research listing: renders heading and at least one project", async ({
  page,
}) => {
  await page.goto("/research");
  await expect(page.locator("h1")).toContainText("Research");
  await expect(page.locator("article").first()).toBeVisible();
});

test("research listing: each card links to /research/<slug>", async ({
  page,
}) => {
  await page.goto("/research");
  const links = page.locator("article a");
  const count = await links.count();
  expect(count).toBeGreaterThan(0);
  for (let i = 0; i < count; i++) {
    const href = await links.nth(i).getAttribute("href");
    expect(href).toMatch(/^\/research\/.+/);
  }
});

test("safesea detail: no accessibility violations", async ({ page }) => {
  await page.goto("/research/safesea");
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(results.violations).toEqual([]);
});

test("safesea detail: heading, back link, and publications visible", async ({
  page,
}) => {
  await page.goto("/research/safesea");
  await expect(page.locator("h1")).toBeVisible();
  await expect(page.locator('nav[aria-label="Page navigation"] a[href="/research"]')).toBeVisible();
  await expect(
    page.locator('[aria-labelledby="publications-heading"]')
  ).toBeVisible();
});

test("cv: no accessibility violations", async ({ page }) => {
  await page.goto("/cv");
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(results.violations).toEqual([]);
});

test("cv: career timeline renders positions", async ({ page }) => {
  await page.goto("/cv");
  await expect(page.locator("h1")).toContainText("Career Timeline");
  await expect(page.locator("ol li").first()).toBeVisible();
});
