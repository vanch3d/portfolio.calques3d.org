import type { Publication } from '@/types/content'
import { unstable_cache } from 'next/cache'
import { getAllPublications, getPublicationsByProject } from '@/lib/api'
import { formatCitations } from '@/lib/csl'

/**
 * Groups publications by year, sorted descending.
 * Returns an array of [year, publications[]] tuples.
 */
export function groupByYear(publications: Publication[]): [number, Publication[]][] {
  const groups = new Map<number, Publication[]>()
  for (const pub of publications) {
    const existing = groups.get(pub.year) ?? []
    existing.push(pub)
    groups.set(pub.year, existing)
  }
  return [...groups.entries()].sort(([a], [b]) => b - a)
}

/**
 * Fetches publications for a project's Zotero tag, cached per-tag with
 * on-demand revalidation via revalidateTag("publications"). Zotero outages
 * resolve to an empty array rather than failing the page — see ADR 020.
 */
export function getCachedPublications(tag?: string) {
  return unstable_cache(
    async (): Promise<Publication[]> => {
      try {
        const pubs = await (tag ? getPublicationsByProject(tag) : getAllPublications())
        const citations = await formatCitations(pubs)
        return pubs.map((e) => ({ ...e, formated: citations.get(e.key) }))
      } catch {
        return []
      }
    },
    [`publications-${tag ?? 'ALL'}`],
    { tags: ['publications', `publications-${tag ?? 'ALL'}`] }
  )()
}
