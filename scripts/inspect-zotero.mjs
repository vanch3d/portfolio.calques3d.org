/**
 * Inspects the Zotero API response shape for the configured collection.
 * Fetches 2 items and prints the full JSON of the first one.
 *
 * Usage: node scripts/inspect-zotero.mjs
 * Requires: .env.local with ZOTERO_USER_ID, ZOTERO_API_KEY, ZOTERO_COLLECTION_ID
 */

import { readFileSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";

const root = join(fileURLToPath(import.meta.url), "../..");

// Parse .env.local manually — no dotenv dependency needed for a script
const env = Object.fromEntries(
  readFileSync(join(root, ".env.local"), "utf-8")
    .split("\n")
    .filter((l) => l.includes("=") && !l.startsWith("#"))
    .map((l) => l.split("=").map((s) => s.trim()))
);

const { ZOTERO_USER_ID, ZOTERO_API_KEY, ZOTERO_COLLECTION_ID } = env;

if (!ZOTERO_USER_ID || !ZOTERO_API_KEY || !ZOTERO_COLLECTION_ID) {
  console.error("Missing Zotero credentials in .env.local");
  process.exit(1);
}

const url = `https://api.zotero.org/users/${ZOTERO_USER_ID}/collections/${ZOTERO_COLLECTION_ID}/items/top?format=json&limit=2&v=3`;

console.log("Fetching:", url, "\n");

const res = await fetch(url, {
  headers: { "Zotero-API-Key": ZOTERO_API_KEY },
});

if (!res.ok) {
  console.error("HTTP", res.status, res.statusText);
  process.exit(1);
}

const totalResults = res.headers.get("Total-Results");
console.log("Total-Results:", totalResults, "\n");

const items = await res.json();

console.log("=== ITEM 0 (full) ===");
console.log(JSON.stringify(items[0], null, 2));

console.log("\n=== ITEM 1 (data only) ===");
console.log(JSON.stringify(items[1]?.data, null, 2));
