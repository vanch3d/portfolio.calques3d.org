/**
 * Zotero API — typed fetch wrapper
 *
 * Fetches publications from the configured Zotero collection and transforms
 * raw API responses into the normalised Publication type.
 *
 * Server-side only — uses process.env, never called client-side.
 * Rendering: ISR with on-demand revalidation (Next.js fetch cache)
 *
 * See: ADR 003 — API Layer
 */

import type { Publication, PublicationType } from "@/types/content";

// ---------------------------------------------------------------
// Raw Zotero API types (subset of the v3 response we care about)
// ---------------------------------------------------------------

interface ZoteroCreator {
  creatorType: string;
  firstName?: string;
  lastName?: string;
  name?: string; // institutional authors
}

interface ZoteroTag {
  tag: string;
}

interface ZoteroItemData {
  key: string;
  itemType: string;
  title: string;
  creators: ZoteroCreator[];
  abstractNote: string;
  date: string;
  DOI: string;
  url: string;
  tags: ZoteroTag[];
  // Conference papers
  proceedingsTitle?: string;
  conferenceName?: string;
  place?: string;
  pages?: string;
  // Journal articles
  publicationTitle?: string;
  volume?: string;
  issue?: string;
  // Books/chapters
  bookTitle?: string;
  publisher?: string;
}

interface ZoteroItem {
  key: string;
  meta: {
    parsedDate?: string;
    numChildren: number;
  };
  data: ZoteroItemData;
}

// ---------------------------------------------------------------
// Transformation helpers
// ---------------------------------------------------------------

const ITEM_TYPE_MAP: Record<string, PublicationType> = {
  conferencePaper: "conferencePaper",
  journalArticle: "journalArticle",
  bookSection: "bookChapter",
  thesis: "thesis",
  report: "report",
  patent: "patent",
};

function formatAuthors(creators: ZoteroCreator[]): string[] {
  return creators
    .filter((c) => c.creatorType === "author")
    .map((c) =>
      c.name
        ? c.name
        : [c.lastName, c.firstName].filter(Boolean).join(", ")
    );
}

function extractYear(item: ZoteroItem): number {
  // Prefer parsedDate from meta (ISO format) over freeform date string
  const raw = item.meta.parsedDate ?? item.data.date;
  const match = raw?.match(/\d{4}/);
  return match ? parseInt(match[0], 10) : 0;
}

function extractVenue(data: ZoteroItemData): string | undefined {
  // conferenceName is the short event name (e.g. "ITS 2006") — stored separately
  // as eventName, not as venue. Venue is the full proceedings/journal/book title.
  const venue =
    data.proceedingsTitle ||
    data.publicationTitle ||
    data.bookTitle;
  return venue || undefined;
}

function extractDoi(data: ZoteroItemData): string | undefined {
  return data.DOI || undefined;
}

/**
 * Zotero project tags follow the convention nvl.<projectSlug>.
 * Strip the prefix and return the slug, plus any non-nvl tags as-is.
 */
function extractTags(tags: ZoteroTag[]): string[] {
  return tags.map(({ tag }) =>
    tag.startsWith("nvl.") ? tag.slice(4).toLowerCase() : tag
  );
}

function transform(item: ZoteroItem): Publication {
  const { data, key } = item;

  return {
    key,
    type: ITEM_TYPE_MAP[data.itemType] ?? "report",
    title: data.title,
    authors: formatAuthors(data.creators),
    year: extractYear(item),
    venue: extractVenue(data),
    eventName: data.conferenceName || undefined,
    place: data.place || undefined,
    pages: data.pages || undefined,
    abstract: data.abstractNote || undefined,
    doi: extractDoi(data),
    tags: extractTags(data.tags),
  };
}

// ---------------------------------------------------------------
// Public API
// ---------------------------------------------------------------

function getConfig() {
  const userId = process.env.ZOTERO_USER_ID;
  const apiKey = process.env.ZOTERO_API_KEY;
  const collectionId = process.env.ZOTERO_COLLECTION_ID;

  if (!userId || !apiKey || !collectionId) {
    throw new Error(
      "Missing Zotero credentials. Set ZOTERO_USER_ID, ZOTERO_API_KEY, " +
        "and ZOTERO_COLLECTION_ID in .env.local"
    );
  }

  return { userId, apiKey, collectionId };
}

const ZOTERO_BASE = "https://api.zotero.org";

/**
 * Fetches all publications from the collection, paginating automatically.
 * Results are sorted by year descending.
 *
 * Uses Next.js ISR cache — revalidated on demand via /api/revalidate.
 */
export async function getAllPublications(): Promise<Publication[]> {
  const { userId, apiKey, collectionId } = getConfig();

  const pageSize = 100;
  let start = 0;
  let total = Infinity;
  const all: ZoteroItem[] = [];

  while (all.length < total) {
    const url = `${ZOTERO_BASE}/users/${userId}/collections/${collectionId}/items/top` +
      `?format=json&limit=${pageSize}&start=${start}&v=3`;

    const res = await fetch(url, {
      headers: { "Zotero-API-Key": apiKey },
      // ISR: cache indefinitely, revalidate on demand
      next: { revalidate: false },
    });

    if (!res.ok) {
      throw new Error(`Zotero API error: ${res.status} ${res.statusText}`);
    }

    total = parseInt(res.headers.get("Total-Results") ?? "0", 10);
    const page: ZoteroItem[] = await res.json();
    all.push(...page);
    start += pageSize;

    if (page.length < pageSize) break;
  }

  return all
    .map(transform)
    .sort((a, b) => b.year - a.year);
}

/**
 * Fetches publications for a specific project by Zotero tag.
 * Tag convention: nvl.<projectSlug> e.g. "nvl.safesea"
 */
export async function getPublicationsByProject(
  projectSlug: string
): Promise<Publication[]> {
  const { userId, apiKey, collectionId } = getConfig();

  const tag = `nvl.${projectSlug}`;
  const url =
    `${ZOTERO_BASE}/users/${userId}/collections/${collectionId}/items/top` +
    `?format=json&limit=100&tag=${encodeURIComponent(tag)}&v=3`;

  const res = await fetch(url, {
    headers: { "Zotero-API-Key": apiKey },
    next: { revalidate: false },
  });

  if (!res.ok) {
    throw new Error(`Zotero API error: ${res.status} ${res.statusText}`);
  }

  const items: ZoteroItem[] = await res.json();
  return items.map(transform).sort((a, b) => b.year - a.year);
}
