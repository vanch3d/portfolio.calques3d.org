import { test, expect } from "@playwright/test";

/**
 * /publications/[key]/pdf — route contract tests
 *
 * Tests the HTTP contract (status codes) without requiring real ownCloud
 * credentials. Valid-key-with-pdf responses need live ownCloud — covered
 * by the smoke-owncloud-proxy.mjs script instead.
 *
 * Run against Vercel preview (PLAYWRIGHT_BASE_URL) or local build.
 */

test("pdf route: 400 for malformed key", async ({ request }) => {
  const res = await request.get("/publications/bad-key!/pdf");
  expect(res.status()).toBe(400);
});

test("pdf route: 400 for key that is too short", async ({ request }) => {
  const res = await request.get("/publications/SHORT/pdf");
  expect(res.status()).toBe(400);
});

test("pdf route: 404 for a valid key format with no matching publication", async ({ request }) => {
  // ZZZZZZZZ is a valid format but will not exist in the Zotero collection
  const res = await request.get("/publications/ZZZZZZZZ/pdf");
  expect(res.status()).toBe(404);
});
