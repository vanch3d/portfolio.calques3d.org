/**
 * Inspects archiveLocation field across all Zotero items.
 * Shows which items have it set, which don't, and cross-references
 * with known ownCloud filenames.
 *
 * Usage: node scripts/inspect-zotero-archive.mjs
 * Requires: .env.local with ZOTERO_USER_ID, ZOTERO_API_KEY, ZOTERO_COLLECTION_ID
 */

import { readFileSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";

const root = join(fileURLToPath(import.meta.url), "../..");
const env = Object.fromEntries(
  readFileSync(join(root, ".env.local"), "utf-8")
    .split("\n")
    .filter((l) => l.includes("=") && !l.startsWith("#"))
    .map((l) => {
      const i = l.indexOf("=");
      return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
    })
);

const { ZOTERO_USER_ID, ZOTERO_API_KEY, ZOTERO_COLLECTION_ID } = env;

const url =
  `https://api.zotero.org/users/${ZOTERO_USER_ID}/collections/${ZOTERO_COLLECTION_ID}/items/top` +
  `?format=json&limit=100&v=3`;

const res = await fetch(url, { headers: { "Zotero-API-Key": ZOTERO_API_KEY } });
const items = await res.json();

const withArchive = items.filter((i) => i.data.archiveLocation);
const without = items.filter((i) => !i.data.archiveLocation);
const withChildren = items.filter((i) => i.meta.numChildren > 0);

console.log(`Total items: ${items.length}`);
console.log(`With archiveLocation: ${withArchive.length}`);
console.log(`Without archiveLocation: ${without.length}`);
console.log(`With child attachments (numChildren > 0): ${withChildren.length}`);

if (without.length > 0) {
  console.log("\n=== Items WITHOUT archiveLocation ===");
  without.forEach((i) =>
    console.log(`  [${i.key}] ${i.data.title.slice(0, 60)} (children: ${i.meta.numChildren})`)
  );
}

if (withChildren.length > 0) {
  console.log("\n=== Items WITH child attachments ===");
  withChildren.forEach((i) =>
    console.log(`  [${i.key}] archiveLocation="${i.data.archiveLocation}" children=${i.meta.numChildren} — ${i.data.title.slice(0, 50)}`)
  );
}

console.log("\n=== archiveLocation → expected PDF filename ===");
withArchive.forEach((i) =>
  console.log(`  ${i.data.archiveLocation}.pdf`)
);
