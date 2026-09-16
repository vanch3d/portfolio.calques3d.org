/**
 * Server-side CSL bibliography formatter.
 *
 * Uses citation-js (@citation-js/core + @citation-js/plugin-csl) with
 * selectable CSL styles. The active style is controlled by the
 * CITATION_STYLE environment variable (default: "umuai-nvl").
 *
 * Server-only — citation-js is ~450 kB unpacked and must never be bundled
 * client-side. All callers must be Server Components or server utilities.
 *
 * Registered styles (local .csl files in src/lib/csl/):
 *   umuai-nvl — custom Springer UMUAI journal format, author-date
 *   apa-7     — APA 7th edition (official CSL repository)
 */

import 'server-only'

import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import type { Publication } from '@/types/content'
import { CITATION_PRIMARY_STYLE } from '@/lib/constants/publications'

// ---------------------------------------------------------------
// Style registry
// ---------------------------------------------------------------

const CITATION_STYLES = {
  'umuai-nvl': 'umuai-nvl',
  'apa-7': 'apa-7',
} as const

export type CitationStyle = keyof typeof CITATION_STYLES

const STYLE_FILES: Record<CitationStyle, string> = {
  'umuai-nvl': 'src/lib/csl/umuai-nvl.csl',
  'apa-7': 'src/lib/csl/apa.csl',
}

const registered = new Set<CitationStyle>()

async function ensureStyleRegistered(style: CitationStyle) {
  if (registered.has(style)) return
  await import('@citation-js/plugin-csl')
  const { plugins } = await import('@citation-js/core')
  const cslXml = readFileSync(resolve(STYLE_FILES[style]), 'utf8')
  plugins.config.get('@csl').styles.add(style, cslXml)
  registered.add(style)
}

/**
 * Returns the active citation style from the environment.
 * Falls back to "umuai-nvl" if unset or unrecognised.
 */
export function getActiveCitationStyle(): CitationStyle {
  const env = process.env.CITATION_STYLE
  if (env && env in CITATION_STYLES) return env as CitationStyle
  return CITATION_PRIMARY_STYLE
}

// ---------------------------------------------------------------
// CSL-JSON mapping
// ---------------------------------------------------------------

/** Maps our PublicationType to CSL item type */
const TYPE_MAP: Record<Publication['type'], string> = {
  conferencePaper: 'paper-conference',
  journalArticle: 'article-journal',
  bookChapter: 'chapter',
  thesis: 'thesis',
  report: 'report',
  patent: 'patent',
}

function toCSLItem(pub: Publication): Record<string, unknown> {
  // Authors are stored as "Family, Given" (inverted bibliographic order).
  // Split on the first ", " to get unambiguous family/given — this correctly
  // handles compound surnames like "Van Labeke, Nicolas".
  // Institutional authors (no comma) are passed as { literal }.
  const authors = pub.authors.map((name) => {
    const commaIdx = name.indexOf(', ')
    if (commaIdx !== -1) {
      return { family: name.slice(0, commaIdx), given: name.slice(commaIdx + 2) }
    }
    return { literal: name }
  })

  return {
    id: pub.key,
    type: TYPE_MAP[pub.type] ?? 'article',
    title: pub.title,
    author: authors,
    issued: { 'date-parts': [[pub.year]] },
    ...(pub.doi && { DOI: pub.doi }),
    ...(pub.venue && { 'container-title': pub.venue }),
    ...(pub.eventName && { event: pub.eventName }),
    // publisher-place is what CSL styles use for conference/publication location
    ...(pub.place && { 'publisher-place': pub.place }),
    ...(pub.pages && { page: pub.pages }),
  }
}

// ---------------------------------------------------------------
// Public API
// ---------------------------------------------------------------

/**
 * Formats a single publication as an HTML bibliography entry.
 * Returns the inner HTML of the `<div class="csl-entry">` — no wrapper div.
 *
 * Uses the active style from CITATION_STYLE env var unless overridden.
 */
export async function formatCitation(
  pub: Publication,
  style: CitationStyle = getActiveCitationStyle()
): Promise<string> {
  await ensureStyleRegistered(style)
  const { Cite } = await import('@citation-js/core')

  const cite = new Cite([toCSLItem(pub)])
  const html: string = cite.format('bibliography', {
    format: 'html',
    template: style,
    lang: 'en-US',
  })

  const match = html.match(/<div[^>]*class="csl-entry"[^>]*>([\s\S]*?)<\/div>/)
  return match ? match[1].trim() : pub.title
}

/**
 * Formats a list of publications as HTML bibliography entries.
 * Returns a map of Zotero key → formatted HTML string.
 *
 * Uses the active style from CITATION_STYLE env var unless overridden.
 */
export async function formatCitations(
  publications: Publication[],
  style: CitationStyle = getActiveCitationStyle()
): Promise<Map<string, string>> {
  await ensureStyleRegistered(style)
  const { Cite } = await import('@citation-js/core')

  const cite = new Cite(publications.map(toCSLItem))
  const html: string = cite.format('bibliography', {
    format: 'html',
    template: style,
    lang: 'en-US',
  })

  const result = new Map<string, string>()
  const entryRegex =
    /<div[^>]*data-csl-entry-id="([^"]+)"[^>]*class="csl-entry"[^>]*>([\s\S]*?)<\/div>/g

  let m: RegExpExecArray | null
  while ((m = entryRegex.exec(html)) !== null) {
    result.set(m[1], m[2].trim())
  }

  // Fallback: any pubs not matched get their title
  for (const pub of publications) {
    if (!result.has(pub.key)) result.set(pub.key, pub.title)
  }

  return result
}
