import { test, expect, type Page } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

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

/**
 * Run axe WCAG 2.1 AA on the given page.
 *
 * color-contrast was previously excluded project-wide because `--color-ink-ghost`
 * (`#c8c4bc`, ~1.58:1 against `--color-ground`) was misused as a text and
 * interactive-border colour on the cream ground across ~20 files. That misuse
 * has been reassigned to `--color-ink-secondary` / `--color-ink` (see DESIGN.md's
 * Ghost Line entry and the 2026-09-14 critique doc, Finding 1) and verified
 * clean across every route this suite covers, so the exclusion is removed.
 */
async function checkA11y(page: Page) {
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .analyze()
  expect(results.violations).toEqual([])
}

// ── Route availability ────────────────────────────────────────────────────────

test.describe('route availability', () => {
  const routes = [
    '/',
    '/research',
    '/engineering',
    '/publications',
    '/lab',
    '/lab/design-system',
    '/lab/design-system/colors',
    '/lab/design-system/typography',
    '/lab/design-system/atoms',
    '/lab/design-system/molecules',
    '/lab/adr',
  ]

  for (const route of routes) {
    test(`${route} responds with HTTP 200`, async ({ page }) => {
      const response = await page.goto(route)
      expect(response?.status()).toBe(200)
    })
  }
})

// ── Homepage (/) ──────────────────────────────────────────────────────────────

test.describe('homepage (/)', () => {
  test('renders a visible h1', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('h1')).toBeVisible()
  })

  test('has no axe accessibility violations', async ({ page }) => {
    await page.goto('/')
    await checkA11y(page)
  })
})

// ── Research (/research) ─────────────────────────────────────────────────────

test.describe('research (/research)', () => {
  test('renders a visible h1', async ({ page }) => {
    await page.goto('/research')
    await expect(page.locator('h1')).toContainText('Research')
  })

  test('has no axe accessibility violations', async ({ page }) => {
    await page.goto('/research')
    await checkA11y(page)
  })
})

// ── Engineering (/engineering) ────────────────────────────────────────────────

test.describe('engineering (/engineering)', () => {
  test('renders a visible h1', async ({ page }) => {
    await page.goto('/engineering')
    await expect(page.locator('h1')).toContainText('Engineering')
  })

  test('has no axe accessibility violations', async ({ page }) => {
    await page.goto('/engineering')
    await checkA11y(page)
  })
})

// ── Publications (/publications) ─────────────────────────────────────────────

test.describe('publications (/publications)', () => {
  test('renders a visible h1', async ({ page }) => {
    await page.goto('/publications')
    await expect(page.locator('h1')).toContainText('Publications')
  })

  test('has no axe accessibility violations', async ({ page }) => {
    await page.goto('/publications')
    await checkA11y(page)
  })
})

// ── Lab index (/lab) ──────────────────────────────────────────────────────────

test.describe('lab index (/lab)', () => {
  test('shows a link to /lab/design-system', async ({ page }) => {
    await page.goto('/lab')
    await expect(page.locator('a[href="/lab/design-system"]')).toBeVisible()
  })

  test('shows a link to /lab/adr', async ({ page }) => {
    await page.goto('/lab')
    await expect(page.locator('a[href="/lab/adr"]')).toBeVisible()
  })
})

// ── Design system showcase ────────────────────────────────────────────────────

test.describe('design system showcase', () => {
  test('/lab/design-system: renders the page heading', async ({ page }) => {
    await page.goto('/lab/design-system')
    await expect(page.locator('h1')).toContainText('The Construction on Tracing Paper')
  })

  test('/lab/design-system: has no axe accessibility violations', async ({ page }) => {
    await page.goto('/lab/design-system')
    await checkA11y(page)
  })

  test('/lab/design-system/colors: renders the page heading', async ({ page }) => {
    await page.goto('/lab/design-system/colors')
    await expect(page.locator('h1')).toContainText('Colours')
  })

  test('/lab/design-system/colors: has no axe accessibility violations', async ({ page }) => {
    await page.goto('/lab/design-system/colors')
    await checkA11y(page)
  })

  test('/lab/design-system/typography: renders the page heading', async ({ page }) => {
    await page.goto('/lab/design-system/typography')
    await expect(page.locator('h1')).toContainText('Typography')
  })

  test('/lab/design-system/typography: has no axe accessibility violations', async ({ page }) => {
    await page.goto('/lab/design-system/typography')
    await checkA11y(page)
  })

  test('/lab/design-system/atoms: renders the page heading', async ({ page }) => {
    await page.goto('/lab/design-system/atoms')
    await expect(page.locator('h1')).toContainText('Atoms')
  })

  test('/lab/design-system/atoms: has no axe accessibility violations', async ({ page }) => {
    await page.goto('/lab/design-system/atoms')
    await checkA11y(page)
  })

  test('/lab/design-system/molecules: renders the page heading', async ({ page }) => {
    await page.goto('/lab/design-system/molecules')
    await expect(page.locator('h1')).toContainText('Molecules')
  })

  test('/lab/design-system/molecules: has no axe accessibility violations', async ({ page }) => {
    await page.goto('/lab/design-system/molecules')
    await checkA11y(page)
  })
})

// ── ADR register ─────────────────────────────────────────────────────────────

test.describe('ADR register (/lab/adr)', () => {
  test('renders the register heading', async ({ page }) => {
    await page.goto('/lab/adr')
    await expect(page.locator('h1')).toBeVisible()
  })

  test('has no axe accessibility violations', async ({ page }) => {
    await page.goto('/lab/adr')
    await checkA11y(page)
  })

  test('renders the register table with at least one row', async ({ page }) => {
    await page.goto('/lab/adr')
    await expect(page.locator('tbody tr').first()).toBeVisible()
  })
})

// ── Navigation flows ──────────────────────────────────────────────────────────

test.describe('navigation flows', () => {
  test('lab → design-system via nav link', async ({ page }) => {
    await page.goto('/lab')
    await page.locator('a[href="/lab/design-system"]').first().click()
    await expect(page).toHaveURL('/lab/design-system')
  })

  test('design-system → colors via section link', async ({ page }) => {
    await page.goto('/lab/design-system')
    await page.locator('a[href="/lab/design-system/colors"]').first().click()
    await expect(page).toHaveURL('/lab/design-system/colors')
  })

  test('design-system → typography via section link', async ({ page }) => {
    await page.goto('/lab/design-system')
    await page.locator('a[href="/lab/design-system/typography"]').first().click()
    await expect(page).toHaveURL('/lab/design-system/typography')
  })

  test('sub-page → lab via breadcrumb link', async ({ page }) => {
    await page.goto('/lab/design-system/colors')
    // Design-system layout uses nav[aria-label="Breadcrumb and section navigation"]
    await page.locator('nav[aria-label="Breadcrumb and section navigation"] a[href="/lab"]').click()
    await expect(page).toHaveURL('/lab')
  })
})
