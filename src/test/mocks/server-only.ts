// No-op mock for the `server-only` package.
// In production Next.js, server-only throws if imported from a Client Component.
// In Vitest (plain Node), there is no Next.js runtime — the guard is irrelevant.
// This alias prevents the throw so server-side utility tests can run normally.
export {};
