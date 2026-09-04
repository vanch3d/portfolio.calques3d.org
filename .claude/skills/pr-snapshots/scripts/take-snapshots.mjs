#!/usr/bin/env node
/**
 * take-snapshots.mjs
 *
 * Runs the PR snapshot spec via Cypress, uploads each snapshot to GitHub
 * CDN, deletes the local PNGs, and prints a JSON array of { route, url }.
 *
 * Usage:
 *   node .claude/skills/pr-snapshots/scripts/take-snapshots.mjs \
 *     --routes /lab/design-system,/lab/design-system/colors [--label after] [--port 3000]
 *
 * Options:
 *   --routes  Required. Comma-separated list of app routes.
 *   --label   Optional. Suffix added to filenames: "before" | "after".
 *   --port    Optional. Dev server port (default: 3000).
 *
 * Output:
 *   JSON array of { route, url } to stdout.
 *   url is a github.com/user-attachments CDN URL — works for private repos.
 */

import { execSync, spawnSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync, statSync, unlinkSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

// Project root: 4 levels up from this file
// .claude/skills/pr-snapshots/scripts/take-snapshots.mjs
const ROOT = new URL("../../../..", import.meta.url);
const rootDir = fileURLToPath(ROOT);

// ── Parse args ────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);

function getArg(name) {
  const idx = args.indexOf(`--${name}`);
  return idx !== -1 ? args[idx + 1] : null;
}

const rawRoutes = getArg("routes") ?? "";
const label = getArg("label") ?? "";
const port = getArg("port") ?? "3000";

if (!rawRoutes) {
  console.error("Error: --routes is required (e.g. --routes /lab/design-system,/lab/colors)");
  process.exit(1);
}

// Normalize routes: Git Bash on Windows expands /foo → C:/Program Files/Git/foo.
const MSYS_PREFIX = /^[A-Za-z]:(?:\/Program Files\/Git|\/Git|\/mingw64|\/usr)\//i;

function normalizeRoute(r) {
  const trimmed = r.trim();
  if (MSYS_PREFIX.test(trimmed)) {
    return "/" + trimmed.replace(MSYS_PREFIX, "");
  }
  return trimmed.startsWith("/") ? trimmed : "/" + trimmed;
}

const routes = rawRoutes.split(",").map(normalizeRoute).filter(Boolean);

// ── Route → snapshot filename ─────────────────────────────────────────────────

function routeToSlug(route) {
  const slug = route.replace(/^\//, "").replace(/\//g, "-") || "root";
  return label ? `${slug}--${label}` : slug;
}

// ── Run Cypress ───────────────────────────────────────────────────────────────

console.error(`Taking snapshots for: ${routes.join(", ")}`);

const result = spawnSync(
  "pnpm",
  [
    "cypress", "run",
    "--e2e",
    "--spec", "cypress/pr-snapshots/pr-snapshots.cy.ts",
    "--config", `allowCypressEnv=true,baseUrl=http://localhost:${port}`,
  ],
  {
    cwd: rootDir,
    stdio: "inherit",
    shell: true,
    env: {
      ...process.env,
      CYPRESS_ROUTES: routes.join(","),
      CYPRESS_LABEL: label,
      MSYS_NO_PATHCONV: "1",
      MSYS2_ARG_CONV_EXCL: "*",
    },
  }
);

if (result.status !== 0) {
  console.error("Cypress run failed.");
  process.exit(result.status ?? 1);
}

// ── Find snapshots ────────────────────────────────────────────────────────────
// Cypress saves to {screenshotsFolder}/{relative-spec-path}/{name}.png.
// Walk cypress/screenshots/ and match by filename to handle path variations.

function walkPngs(dir, acc = []) {
  if (!existsSync(dir)) return acc;
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      walkPngs(full, acc);
    } else if (entry.endsWith(".png")) {
      acc.push(full);
    }
  }
  return acc;
}

const screenshotsRoot = join(rootDir, "cypress", "screenshots");
const allPngs = walkPngs(screenshotsRoot);

// ── Get GitHub repo ID + auth token ──────────────────────────────────────────

const repoId = execSync("gh api repos/{owner}/{repo} --jq .id", {
  cwd: rootDir,
  encoding: "utf8",
}).trim();

const token = execSync("gh auth token", {
  cwd: rootDir,
  encoding: "utf8",
}).trim();

// ── Upload each snapshot ──────────────────────────────────────────────────────

const output = [];

for (const route of routes) {
  const slug = routeToSlug(route);
  const filename = `${slug}.png`;

  const snapshotPath = allPngs.find((p) => p.endsWith(filename));

  if (!snapshotPath) {
    console.error(`Warning: snapshot not found for ${route} (expected filename: ${filename})`);
    continue;
  }

  const fileBuffer = readFileSync(snapshotPath);
  const uploadUrl =
    `https://uploads.github.com/user-attachments/assets` +
    `?name=${encodeURIComponent(filename)}&content_type=image%2Fpng&repository_id=${repoId}`;

  const response = await fetch(uploadUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "image/png",
    },
    body: fileBuffer,
  });

  if (!response.ok) {
    const body = await response.text();
    console.error(`Upload failed for ${route}: ${response.status} ${body}`);
    continue;
  }

  const { url } = await response.json();
  output.push({ route, url });

  // Delete local PNG — it now lives on GitHub CDN
  unlinkSync(snapshotPath);
}

// ── Output ────────────────────────────────────────────────────────────────────

console.log(JSON.stringify(output, null, 2));
