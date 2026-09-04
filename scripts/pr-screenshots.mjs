#!/usr/bin/env node
/**
 * pr-screenshots.mjs
 *
 * Runs the PR screenshot spec against the running dev server,
 * then moves the output to .docs/screenshots/{branch-slug}/.
 *
 * Usage:
 *   node scripts/pr-screenshots.mjs --routes /lab/design-system,/lab/colors [--label after]
 *
 * Options:
 *   --routes   Required. Comma-separated list of app routes.
 *   --label    Optional. Suffix added to each filename: "before" | "after".
 *              Useful when taking before/after pairs on the same branch.
 *   --branch   Optional. Branch slug used for the output directory.
 *              Defaults to the current git branch (with / replaced by -).
 *
 * Output:
 *   Prints a JSON array of { route, file, rawUrl } objects to stdout.
 *   rawUrl assumes the repo is vanch3d/portfolio.calques3d.org on GitHub.
 */

import { execSync, spawnSync } from "node:child_process";
import { existsSync, mkdirSync, renameSync } from "node:fs";
import { join, basename } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = new URL("..", import.meta.url);
const rootDir = fileURLToPath(ROOT);

// ── Parse args ────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);

function getArg(name) {
  const idx = args.indexOf(`--${name}`);
  return idx !== -1 ? args[idx + 1] : null;
}

const rawRoutes = getArg("routes") ?? "";
const label = getArg("label") ?? "";
const branchOverride = getArg("branch");

if (!rawRoutes) {
  console.error("Error: --routes is required (e.g. --routes /lab/design-system,/lab/colors)");
  process.exit(1);
}

// Normalize routes: Git Bash on Windows expands /foo → C:/Program Files/Git/foo.
// Strip the MSYS root and restore the leading slash.
const MSYS_PREFIX = /^[A-Za-z]:(?:\/Program Files\/Git|\/Git|\/mingw64|\/usr)\//i;

function normalizeRoute(r) {
  const trimmed = r.trim();
  if (MSYS_PREFIX.test(trimmed)) {
    return "/" + trimmed.replace(MSYS_PREFIX, "");
  }
  return trimmed.startsWith("/") ? trimmed : "/" + trimmed;
}

const routes = rawRoutes.split(",").map(normalizeRoute).filter(Boolean);

// ── Resolve branch name ───────────────────────────────────────────────────────

function currentBranch() {
  return execSync("git rev-parse --abbrev-ref HEAD", { cwd: rootDir, encoding: "utf8" }).trim();
}

const branch = branchOverride ?? currentBranch();
const branchSlug = branch.replace(/\//g, "-");

// ── Output paths ─────────────────────────────────────────────────────────────

const screenshotSrc = join(rootDir, "cypress", "screenshots", "pr-screenshots.cy.ts");
const screenshotDest = join(rootDir, ".docs", "screenshots", branchSlug);

mkdirSync(screenshotDest, { recursive: true });

// ── Run Cypress ───────────────────────────────────────────────────────────────

console.error(`Running Cypress snapshot spec for: ${routes.join(", ")}`);

// Pass routes via CYPRESS_* env vars to avoid Cypress --env comma-parsing conflicts
// (Cypress parses --env values using commas as separator, which breaks route lists).
// CYPRESS_ROUTES → Cypress.env("ROUTES"), CYPRESS_LABEL → Cypress.env("LABEL")
const result = spawnSync(
  "pnpm",
  [
    "cypress", "run",
    "--e2e",
    "--spec", "cypress/snapshots/pr-screenshots.cy.ts",
    // allowCypressEnv is false globally (security), but the snapshot spec
    // needs Cypress.env() to receive routes. Override for this run only.
    "--config", "allowCypressEnv=true",
  ],
  {
    cwd: rootDir,
    stdio: "inherit",
    shell: true,
    env: {
      ...process.env,
      CYPRESS_ROUTES: routes.join(","),
      CYPRESS_LABEL: label,
      // Prevent Git Bash from expanding POSIX paths in env values on Windows
      MSYS_NO_PATHCONV: "1",
      MSYS2_ARG_CONV_EXCL: "*",
    },
  }
);

if (result.status !== 0) {
  console.error("Cypress run failed.");
  process.exit(result.status ?? 1);
}

// ── Move screenshots ──────────────────────────────────────────────────────────

function routeToSlug(route) {
  const slug = route.replace(/^\//, "").replace(/\//g, "-") || "root";
  return label ? `${slug}--${label}` : slug;
}

const OWNER = "vanch3d";
const REPO = "portfolio.calques3d.org";

const output = [];

for (const route of routes) {
  const name = routeToSlug(route);
  // cy.screenshot(name) saves to "{screenshotsFolder}/{specName}/{name}.png"
  const destFile = `${name}.png`;
  const dest = join(screenshotDest, destFile);
  const actualSrc = join(screenshotSrc, destFile);

  if (!existsSync(actualSrc)) {
    console.error(`Warning: screenshot not found for route ${route} (expected: ${actualSrc})`);
    continue;
  }

  renameSync(actualSrc, dest);

  const rawUrl = `https://raw.githubusercontent.com/${OWNER}/${REPO}/${branch}/.docs/screenshots/${branchSlug}/${destFile}`;
  output.push({ route, file: dest.replace(rootDir, ""), rawUrl });
}

// ── Output result ─────────────────────────────────────────────────────────────

console.log(JSON.stringify(output, null, 2));
