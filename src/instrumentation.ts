/**
 * Next.js instrumentation hook — `register()` runs once when a new server
 * instance starts, before it accepts requests. See:
 * node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/instrumentation.md
 *
 * Sole purpose here: start the MSW node server (src/mocks/server.ts) inside
 * the actual Next.js server process so that Cypress E2E ("smoke") specs get
 * deterministic mocked API responses, per ADR 002's Cypress E2E (smoke)
 * layer — "fast, deterministic smoke tests against local dev server with
 * MSW intercepting API calls". Reuses the same `server` export already used
 * by Vitest (src/test/setup.ts) — no duplicated handlers.
 *
 * Only effective against `next dev`, by design. `register()` is a base-server
 * hook — it never runs inside the short-lived static-generation worker
 * processes `next build` spawns, so a page that renders via SSG (like
 * `/publications`) would already have its Zotero data baked into the HTML
 * before this ever fires if served via `next start`. `next dev` generates
 * that same route lazily, on first request, against the already-running
 * (and by-then MSW-registered) server — which is what actually lets MSW
 * intercept the call. This is also the literal ADR 002 wording ("local dev
 * server"), so `test:e2e*` in package.json all start the server with
 * `next dev`, not `next start`.
 *
 * Safety:
 * - Opt-in only. Nothing here runs unless MSW_ENABLED=true is explicitly set
 *   by the process that starts the server (see the `test:e2e*` scripts in
 *   package.json). Real deployments (Vercel, `pnpm build && pnpm start` for
 *   production) never set this var, so this is inert by default.
 * - `process.env.VERCEL` is checked as a defence-in-depth belt-and-braces
 *   guard — even a misconfigured MSW_ENABLED var in a real Vercel project
 *   would not activate the mock server.
 * - Scoped to the Node.js runtime only via `NEXT_RUNTIME` — `msw/node` uses
 *   Node-only APIs and does not work (and must never load) in the Edge
 *   runtime.
 * - The `server` module is dynamically imported so it is never pulled into
 *   an Edge runtime bundle in the first place.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs') return
  if (process.env.MSW_ENABLED !== 'true') return
  if (process.env.VERCEL) return

  const { server } = await import('@/mocks/server')

  server.listen({ onUnhandledRequest: 'bypass' })
}
