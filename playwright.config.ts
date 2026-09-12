import { defineConfig, devices } from '@playwright/test'

/**
 * Playwright — full E2E against a real deployed environment.
 *
 * Primary target: Vercel preview deployments (live APIs, real ISR, real routing).
 * Set PLAYWRIGHT_BASE_URL in CI to the Vercel preview URL.
 * Local: run `npm run build && npm run start` first, then `npm run test:playwright`.
 *
 * See: ADR 002 — Testing Strategy
 */
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : [['html', { open: 'never' }]],

  use: {
    // Vercel preview URL in CI; local build otherwise
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3000',
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  // No webServer: Playwright runs against an already-deployed URL.
  // In CI: the deploy job runs first, then passes the preview URL via PLAYWRIGHT_BASE_URL.
  // Locally: npm run build && npm run start
})
