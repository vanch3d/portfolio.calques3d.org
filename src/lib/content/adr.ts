/**
 * ADR content layer
 *
 * Reads and parses all Architecture Decision Records from .docs/adr/*.md.
 * Server-side only — uses Node.js fs module.
 * Rendering: SSG (force-static on /lab/adr routes)
 */

import "server-only";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import matter from "gray-matter";

const ADR_DIR = join(process.cwd(), ".docs/adr");

export type AdrStatus = "proposed" | "accepted" | "deprecated" | "superseded";

export type AdrMeta = {
  number: number;
  title: string;
  status: AdrStatus;
  date: string;
  tags: string[];
  slug: string;
  supersededBy?: number;
};

export type Adr = AdrMeta & {
  body: string;
};

type AdrFrontmatter = {
  number: number;
  title: string;
  status: string;
  date: string;
  "decision-makers"?: string;
  tags?: string[];
  "superseded-by"?: number;
};

function slugFromFilename(filename: string): string {
  return filename.replace(/\.md$/, "");
}

function parseAdrFile(filename: string): Adr {
  const raw = readFileSync(join(ADR_DIR, filename), "utf-8");
  const { data, content } = matter(raw);
  const fm = data as AdrFrontmatter;

  const status = (fm.status ?? "proposed") as AdrStatus;

  return {
    number: fm.number,
    title: fm.title,
    status,
    date: typeof fm.date === "string" ? fm.date : String(fm.date),
    tags: Array.isArray(fm.tags) ? fm.tags : [],
    slug: slugFromFilename(filename),
    supersededBy: fm["superseded-by"],
    body: content.trim(),
  };
}

function getAdrFilenames(): string[] {
  return readdirSync(ADR_DIR)
    .filter((f) => /^\d{3}-/.test(f) && f.endsWith(".md"))
    .sort();
}

/**
 * Returns all ADR metadata, sorted by number descending (most recent first).
 */
export async function getAllAdrs(): Promise<AdrMeta[]> {
  const filenames = getAdrFilenames();
  const adrs = filenames.map((f) => {
    const { body: _body, ...meta } = parseAdrFile(f);
    void _body;
    return meta;
  });
  return adrs.sort((a, b) => b.number - a.number);
}

/**
 * Returns a single ADR by slug, or null if not found.
 */
export async function getAdr(slug: string): Promise<Adr | null> {
  const filename = `${slug}.md`;
  try {
    return parseAdrFile(filename);
  } catch {
    return null;
  }
}

export type TagWithCount = { tag: string; count: number };

/**
 * Returns all unique tags across all ADRs with their occurrence counts,
 * sorted descending by count (highest-frequency first).
 */
export async function getAllAdrTags(): Promise<TagWithCount[]> {
  const adrs = await getAllAdrs();
  const tagCounts = new Map<string, number>();
  for (const adr of adrs) {
    for (const tag of adr.tags) {
      tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1);
    }
  }
  return Array.from(tagCounts.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

/**
 * Returns the slug for a given ADR number by scanning the filesystem.
 * Used to resolve "ADR NNN" cross-references to /lab/adr/{slug} links.
 */
export function adrSlugFromNumber(n: number): string {
  const filenames = getAdrFilenames();
  const padded = String(n).padStart(3, "0");
  const match = filenames.find((f) => f.startsWith(padded));
  if (!match) return padded;
  return slugFromFilename(match);
}

/**
 * Returns all ADR slugs, for use with generateStaticParams.
 */
export async function getAdrSlugs(): Promise<string[]> {
  return getAdrFilenames().map(slugFromFilename);
}

/**
 * Returns the most recent accepted ADR number, or null if none.
 */
export async function getMostRecentAcceptedAdrNumber(): Promise<number | null> {
  const adrs = await getAllAdrs();
  const accepted = adrs.filter((a) => a.status === "accepted");
  if (accepted.length === 0) return null;
  return accepted[0].number;
}
