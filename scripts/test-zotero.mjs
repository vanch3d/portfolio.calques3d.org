/**
 * Tests the Zotero API fetch and transformation.
 * Prints a sample of normalised Publication records.
 *
 * Usage: node scripts/test-zotero.mjs
 * Requires: .env.local with ZOTERO_USER_ID, ZOTERO_API_KEY, ZOTERO_COLLECTION_ID
 */

import { readFileSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";

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

process.env.ZOTERO_USER_ID = env.ZOTERO_USER_ID;
process.env.ZOTERO_API_KEY = env.ZOTERO_API_KEY;
process.env.ZOTERO_COLLECTION_ID = env.ZOTERO_COLLECTION_ID;

// Import after env is set
const { getAllPublications, getPublicationsByProject } = await import(
  "../src/lib/api/zotero.ts"
).catch(async () =>
  // Fallback: run via tsx if available, otherwise report
  { console.error("Cannot import TS directly. Run: npx tsx scripts/test-zotero.mjs"); process.exit(1); }
);

console.log("=== All publications (first 3) ===\n");
const all = await getAllPublications();
console.log(`Total fetched: ${all.length}`);
all.slice(0, 3).forEach((p) => console.log(JSON.stringify(p, null, 2)));

console.log("\n=== Publications for project: safesea ===\n");
const safesea = await getPublicationsByProject("safesea");
console.log(`Total: ${safesea.length}`);
safesea.forEach((p) => console.log(JSON.stringify(p, null, 2)));
