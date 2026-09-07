import { test } from "@playwright/test";

/**
 * Content pipeline tests — SUSPENDED
 *
 * These tests previously targeted /test/cv, /test/research, /test/publications —
 * dev-only debug routes that exposed raw content loader output. Those routes no
 * longer exist in the app (no /test/ directory, no route handlers registered).
 *
 * Restore when:
 *   - The /test/* routes are re-added (e.g. behind a feature flag or env guard), OR
 *   - The content loaders gain dedicated Vitest unit tests covering the same scenarios.
 *
 * Until then, all tests are skipped to prevent spurious 404 failures in CI.
 */

test.skip("test/cv: no accessibility violations — route does not exist", async () => {});
test.skip("test/cv: renders at least one position row — route does not exist", async () => {});
test.skip("test/research: no accessibility violations — route does not exist", async () => {});
test.skip("test/research: renders at least one project row — route does not exist", async () => {});
test.skip("test/publications: no accessibility violations — route does not exist", async () => {});
test.skip("test/publications: renders heading and no error block — route does not exist", async () => {});
