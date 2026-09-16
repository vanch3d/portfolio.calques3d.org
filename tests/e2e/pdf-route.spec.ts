import { test, expect } from '@playwright/test'

/**
 * /publications/[key]/pdf — route contract tests
 *
 * Exercises the route handler's status-code contract against a real running
 * server (per playwright.config.ts — a Vercel preview or a local build/start).
 * No MSW here: Playwright always talks to a real deployment, so these tests
 * only assert on behaviour that doesn't depend on the live Zotero data set —
 * key-format validation (400) and a well-formed key that can't plausibly
 * match a real Zotero item (404, same "no such record" approach used by the
 * resolvePdfSource unit tests in src/lib/api/pdf.test.ts).
 */

test('pdf route: 400 for a malformed key', async ({ request }) => {
  const response = await request.get('/publications/bad-key!/pdf')
  expect(response.status()).toBe(400)
})

test('pdf route: 400 for a key that is too short', async ({ request }) => {
  const response = await request.get('/publications/ABCD123/pdf')
  expect(response.status()).toBe(400)
})

test('pdf route: 404 for a valid key format with no matching publication', async ({ request }) => {
  const response = await request.get('/publications/ZZZZZZZZ/pdf')
  expect(response.status()).toBe(404)
})
