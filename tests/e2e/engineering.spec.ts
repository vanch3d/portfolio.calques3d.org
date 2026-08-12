import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

/**
 * Engineering section — full E2E against live deployment.
 *
 * Covers the listing page and the HiveMQ Edge detail page.
 * The intrica project is redacted and has no detail route.
 *
 * Accessibility: axe-core WCAG 2.1 AA checks on all pages.
 */

test("engineering listing: no accessibility violations", async ({ page }) => {
  await page.goto("/engineering");
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(results.violations).toEqual([]);
});

test("engineering listing: renders heading and at least one project card", async ({
  page,
}) => {
  await page.goto("/engineering");
  await expect(page.locator("h1")).toContainText("Engineering");
  await expect(page.locator("article").first()).toBeVisible();
});

test("engineering listing: public and proprietary cards link to detail pages", async ({
  page,
}) => {
  await page.goto("/engineering");
  const links = page.locator('article a[href^="/engineering/"]');
  const count = await links.count();
  expect(count).toBeGreaterThan(0);
});

test("hivemq-edge detail: no accessibility violations", async ({ page }) => {
  await page.goto("/engineering/hivemq-edge");
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(results.violations).toEqual([]);
});

test("hivemq-edge detail: heading and back link visible", async ({ page }) => {
  await page.goto("/engineering/hivemq-edge");
  await expect(page.locator("h1")).toContainText("HiveMQ Edge");
  await expect(
    page.locator('nav[aria-label="Breadcrumb"] a[href="/engineering"]')
  ).toBeVisible();
});
