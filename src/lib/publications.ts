import type { Publication } from '@/types/content'

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
