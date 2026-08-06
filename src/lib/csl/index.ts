/**
 * Server-side CSL bibliography formatter.
 *
 * Uses citation-js (@citation-js/core + @citation-js/plugin-csl) with the
 * custom umuai-nvl.csl style (Springer UMUAI journal format, author-date).
 *
 * Server-only — citation-js is ~450 kB unpacked and must never be bundled
 * client-side. All callers must be Server Components or server utilities.
 *
 * The CSL style is registered once on first call (module-level singleton).
 */

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { Publication } from "@/types/content";

const STYLE_NAME = "umuai-nvl";

let registered = false;

async function ensureStyleRegistered() {
  if (registered) return;
  await import("@citation-js/plugin-csl");
  const { plugins } = await import("@citation-js/core");
  const cslXml = readFileSync(resolve("src/lib/csl/umuai-nvl.csl"), "utf8");
  plugins.config.get("@csl").styles.add(STYLE_NAME, cslXml);
  registered = true;
}

/** Maps our PublicationType to CSL item type */
const TYPE_MAP: Record<Publication["type"], string> = {
  conferencePaper: "paper-conference",
  journalArticle: "article-journal",
  bookChapter: "chapter",
  thesis: "thesis",
  report: "report",
  patent: "patent",
};

function toCSLItem(pub: Publication): Record<string, unknown> {
  // Authors are stored as "Family, Given" (inverted bibliographic order).
  // Split on the first ", " to get unambiguous family/given — this correctly
  // handles compound surnames like "Van Labeke, Nicolas".
  // Institutional authors (no comma) are passed as { literal }.
  const authors = pub.authors.map((name) => {
    const commaIdx = name.indexOf(", ");
    if (commaIdx !== -1) {
      return { family: name.slice(0, commaIdx), given: name.slice(commaIdx + 2) };
    }
    return { literal: name };
  });

  return {
    id: pub.key,
    type: TYPE_MAP[pub.type] ?? "article",
    title: pub.title,
    author: authors,
    issued: { "date-parts": [[pub.year]] },
    ...(pub.doi && { DOI: pub.doi }),
    ...(pub.venue && { "container-title": pub.venue }),
    // publisher-place is what the UMUAI CSL style uses for conference location
    ...(pub.place && { "publisher-place": pub.place }),
  };
}

/**
 * Formats a single publication as an HTML bibliography entry using umuai-nvl.csl.
 * Returns the inner HTML of the `<div class="csl-entry">` — no wrapper div.
 */
export async function formatCitation(pub: Publication): Promise<string> {
  await ensureStyleRegistered();
  const { Cite } = await import("@citation-js/core");

  const cite = new Cite([toCSLItem(pub)]);
  const html: string = cite.format("bibliography", {
    format: "html",
    template: STYLE_NAME,
    lang: "en-US",
  });

  // Extract inner content of the single <div class="csl-entry">
  const match = html.match(/<div[^>]*class="csl-entry"[^>]*>([\s\S]*?)<\/div>/);
  return match ? match[1].trim() : pub.title;
}

/**
 * Formats a list of publications as HTML bibliography entries.
 * Returns a map of Zotero key → formatted HTML string.
 */
export async function formatCitations(
  publications: Publication[]
): Promise<Map<string, string>> {
  await ensureStyleRegistered();
  const { Cite } = await import("@citation-js/core");

  const cite = new Cite(publications.map(toCSLItem));
  const html: string = cite.format("bibliography", {
    format: "html",
    template: STYLE_NAME,
    lang: "en-US",
  });

  const result = new Map<string, string>();
  const entryRegex =
    /<div[^>]*data-csl-entry-id="([^"]+)"[^>]*class="csl-entry"[^>]*>([\s\S]*?)<\/div>/g;

  let m: RegExpExecArray | null;
  while ((m = entryRegex.exec(html)) !== null) {
    result.set(m[1], m[2].trim());
  }

  // Fallback: any pubs not matched get their title
  for (const pub of publications) {
    if (!result.has(pub.key)) result.set(pub.key, pub.title);
  }

  return result;
}
