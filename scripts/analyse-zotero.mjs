/**
 * Analyse Zotero export JSON for nvl.* tags, publication counts, and orphan detection.
 * Usage: node scripts/analyse-zotero.mjs
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const jsonPath = join(__dirname, '../.local/2026-08-06T143307.200.json');
const raw = JSON.parse(readFileSync(jsonPath, 'utf-8'));

// Filter to real publication items (exclude attachments, notes)
const EXCLUDED_TYPES = new Set(['attachment', 'note']);
const items = raw.filter(item => !EXCLUDED_TYPES.has(item.data?.itemType));

const tagCounts = {};
const orphans = [];
const crossProject = [];

const TABLE_ROWS = [];

for (const item of items) {
  const d = item.data;
  const key = d.key;
  const title = d.title || '(no title)';
  const itemType = d.itemType;

  // Extract year
  let year = '';
  if (d.date) {
    const m = d.date.match(/\b(1\d{3}|20\d{2})\b/);
    if (m) year = m[1];
  }
  if (!year && item.meta?.parsedDate) {
    const m = item.meta.parsedDate.match(/^(\d{4})/);
    if (m) year = m[1];
  }

  // Authors
  const authors = (d.creators || [])
    .filter(c => c.creatorType === 'author')
    .map(c => c.lastName || c.name || '')
    .filter(Boolean)
    .join(', ');

  // Venue
  const venue = d.proceedingsTitle || d.publicationTitle || d.bookTitle || d.university || d.institution || '';

  // DOI
  const doi = d.DOI || '';

  // nvl.* tags
  const nvlTags = (d.tags || [])
    .map(t => t.tag)
    .filter(t => t.startsWith('nvl.'));

  // Count per tag
  for (const t of nvlTags) {
    tagCounts[t] = (tagCounts[t] || 0) + 1;
  }

  const row = {
    key,
    year,
    itemType,
    title,
    titleShort: title.length > 60 ? title.slice(0, 57) + '...' : title,
    authors,
    venue,
    doi,
    nvlTags,
  };

  TABLE_ROWS.push(row);

  if (nvlTags.length === 0) {
    orphans.push(row);
  } else if (nvlTags.length > 1) {
    crossProject.push(row);
  }
}

// Sort table by year
TABLE_ROWS.sort((a, b) => (a.year || '0').localeCompare(b.year || '0'));

// --- Output ---

console.log('\n=== DEDUPLICATED nvl.* TAGS WITH PUBLICATION COUNTS ===\n');
const sortedTags = Object.entries(tagCounts).sort((a, b) => b[1] - a[1]);
for (const [tag, count] of sortedTags) {
  console.log(`  ${tag.padEnd(30)} ${count}`);
}
console.log(`\n  Total unique tags: ${sortedTags.length}`);
console.log(`  Total publication items (excl. attachments): ${items.length}`);

console.log('\n=== FULL PUBLICATIONS TABLE ===\n');
console.log('KEY       | YEAR | TYPE              | PROJECT TAG(S)              | TITLE');
console.log('----------|------|-------------------|-----------------------------|' + '-'.repeat(62));
for (const r of TABLE_ROWS) {
  const typeShort = r.itemType.padEnd(18).slice(0, 18);
  const tags = (r.nvlTags.join(', ') || '(orphan)').padEnd(28).slice(0, 28);
  const yr = (r.year || '????').padEnd(4);
  console.log(`${r.key} | ${yr} | ${typeShort} | ${tags} | ${r.titleShort}`);
}

console.log('\n=== ORPHAN ITEMS (no nvl.* tag) ===\n');
if (orphans.length === 0) {
  console.log('  None.');
} else {
  for (const r of orphans) {
    console.log(`  ${r.key} (${r.year}) [${r.itemType}] ${r.titleShort}`);
  }
}

console.log('\n=== CROSS-PROJECT ITEMS (multiple nvl.* tags) ===\n');
if (crossProject.length === 0) {
  console.log('  None.');
} else {
  for (const r of crossProject) {
    console.log(`  ${r.key} (${r.year}) [${r.itemType}]`);
    console.log(`    Tags: ${r.nvlTags.join(', ')}`);
    console.log(`    Title: ${r.titleShort}`);
  }
}

console.log('\n=== PUBLICATIONS PER TAG (sorted by tag) ===\n');
const sortedAlpha = Object.entries(tagCounts).sort((a, b) => a[0].localeCompare(b[0]));
for (const [tag, count] of sortedAlpha) {
  console.log(`  ${tag}: ${count}`);
}
