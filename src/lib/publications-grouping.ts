import type { Publication } from '@/types/content'

/**
 * Groups publications by year, sorted descending. Pure and side-effect-free —
 * split out of publications.ts so Client Components can import it without
 * pulling in that module's server-only chain (next/cache, @/lib/csl, which
 * has `import 'server-only'` and bundles citation-js).
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
