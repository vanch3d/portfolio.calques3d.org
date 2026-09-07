/**
 * /test/cv — SUSPENDED
 *
 * Previously targeted /test/cv, a dev-only debug route that exposed raw
 * positions content loader output. That route no longer exists in the app
 * (no /test/ directory, no route handlers registered).
 *
 * Restore when:
 *   - The /test/* routes are re-added, OR
 *   - The content loaders gain dedicated Vitest unit tests covering the same scenarios.
 */

it.skip("test/cv: renders at least one position row — route does not exist", () => {});
it.skip("test/cv: has no axe accessibility violations — route does not exist", () => {});
it.skip("test/cv: renders a back link — route does not exist", () => {});
