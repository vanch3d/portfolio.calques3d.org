/**
 * PDF availability validator.
 *
 * Cross-references Zotero publication records against the GitHub Releases
 * asset list, reporting which PDFs are present, missing, or have no
 * archiveLocation set in Zotero.
 *
 * Usage: pnpm run validate:pdfs
 * Requires: .env.local with ZOTERO_USER_ID, ZOTERO_API_KEY, ZOTERO_COLLECTION_ID
 *
 * Exit codes:
 *   0 — all archiveLocations have a matching PDF asset
 *   1 — one or more are missing
 */

import { readFileSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const root = join(fileURLToPath(import.meta.url), "../..");

// Load .env.local
const env = Object.fromEntries(
  readFileSync(join(root, ".env.local"), "utf-8")
    .split("\n")
    .filter((l) => l.includes("=") && !l.startsWith("#"))
    .map((l) => {
      const idx = l.indexOf("=");
      return [l.slice(0, idx).trim(), l.slice(idx + 1).trim()];
    })
);

process.env.ZOTERO_USER_ID       = env.ZOTERO_USER_ID;
process.env.ZOTERO_API_KEY       = env.ZOTERO_API_KEY;
process.env.ZOTERO_COLLECTION_ID = env.ZOTERO_COLLECTION_ID;

const REPO           = "vanch3d/portfolio.calques3d.org";
const RELEASE_TAG    = "publications-pdfs";
const PDF_BASE_URL   = `https://github.com/${REPO}/releases/download/${RELEASE_TAG}`;

// Repo is private — pick up the token from the gh CLI (already authenticated).
let ghToken;
try {
  ghToken = execSync("gh auth token", { stdio: ["ignore", "pipe", "ignore"] })
    .toString()
    .trim();
} catch {
  console.warn("Warning: gh CLI not found or not authenticated. API calls may fail for private repos.");
}
const ghHeaders = {
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": "2022-11-28",
  ...(ghToken && { Authorization: `Bearer ${ghToken}` }),
};

// -----------------------------------------------------------------------
// 1. Fetch GitHub release asset list (single API call, public repo)
// -----------------------------------------------------------------------
console.log(`\nFetching GitHub release assets (${RELEASE_TAG})...`);

const ghRes = await fetch(
  `https://api.github.com/repos/${REPO}/releases/tags/${RELEASE_TAG}`,
  { headers: ghHeaders }
);

if (!ghRes.ok) {
  console.error(`GitHub API error: ${ghRes.status} ${ghRes.statusText}`);
  process.exit(1);
}

const release = await ghRes.json();
const assetNames = new Set(release.assets.map((a) => a.name));
console.log(`  ${assetNames.size} assets found in release.\n`);

// -----------------------------------------------------------------------
// 2. Fetch Zotero publications (raw items to access archiveLocation)
// -----------------------------------------------------------------------
console.log("Fetching Zotero publications...");

const { userId, apiKey, collectionId } = {
  userId:       process.env.ZOTERO_USER_ID,
  apiKey:       process.env.ZOTERO_API_KEY,
  collectionId: process.env.ZOTERO_COLLECTION_ID,
};

const pageSize = 100;
let start = 0;
let total = Infinity;
const rawItems = [];

while (rawItems.length < total) {
  const url =
    `https://api.zotero.org/users/${userId}/collections/${collectionId}/items/top` +
    `?format=json&limit=${pageSize}&start=${start}&v=3`;

  const res = await fetch(url, { headers: { "Zotero-API-Key": apiKey } });
  if (!res.ok) {
    console.error(`Zotero API error: ${res.status} ${res.statusText}`);
    process.exit(1);
  }

  total = parseInt(res.headers.get("Total-Results") ?? "0", 10);
  const page = await res.json();
  rawItems.push(...page);
  start += pageSize;
  if (page.length < pageSize) break;
}

console.log(`  ${rawItems.length} publications fetched.\n`);

// -----------------------------------------------------------------------
// 3. Cross-reference
// -----------------------------------------------------------------------
const confirmed = [];
const missing   = [];
const noId      = [];

for (const item of rawItems) {
  const { data } = item;
  const archiveLocation = data.archiveLocation?.trim();
  const title = data.title ?? "(no title)";
  const key   = data.key;

  if (!archiveLocation) {
    noId.push({ key, title });
    continue;
  }

  const filename = `${archiveLocation}.pdf`;
  if (assetNames.has(filename)) {
    confirmed.push({ key, title, archiveLocation, url: `${PDF_BASE_URL}/${filename}` });
  } else {
    missing.push({ key, title, archiveLocation, expected: `${PDF_BASE_URL}/${filename}` });
  }
}

// -----------------------------------------------------------------------
// 4. Report
// -----------------------------------------------------------------------
const pad = (n, w = 3) => String(n).padStart(w);

console.log("=".repeat(72));
console.log(`PDF VALIDATION REPORT — ${new Date().toISOString().slice(0, 10)}`);
console.log("=".repeat(72));

console.log(`\n✔  CONFIRMED (${confirmed.length})`);
for (const { archiveLocation, title } of confirmed) {
  console.log(`   ${archiveLocation.padEnd(30)}  ${title.slice(0, 50)}`);
}

if (missing.length > 0) {
  console.log(`\n✘  MISSING FROM RELEASE (${missing.length})`);
  for (const { key, archiveLocation, title, expected } of missing) {
    console.log(`   [${key}] ${archiveLocation}`);
    console.log(`         Title:    ${title}`);
    console.log(`         Expected: ${expected}`);
  }
}

if (noId.length > 0) {
  console.log(`\n—  NO archiveLocation SET (${noId.length}) — no PDF expected`);
  for (const { key, title } of noId) {
    console.log(`   [${key}] ${title.slice(0, 60)}`);
  }
}

console.log("\n" + "=".repeat(72));
console.log(
  `Summary: ${pad(confirmed.length)} confirmed  |` +
  `  ${pad(missing.length)} missing  |` +
  `  ${pad(noId.length)} no ID set`
);
console.log("=".repeat(72) + "\n");

process.exit(missing.length > 0 ? 1 : 0);
