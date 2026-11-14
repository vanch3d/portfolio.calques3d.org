/**
 * Typed route builders
 *
 * Centralises string-template route construction so the URL shape for each
 * content type is defined exactly once. Callers cast the result with
 * `as Route` at the call site (the existing repo convention — see
 * EraTimeline.tsx) since these routes are not all resolvable by Next.js's
 * typedRoutes plugin (the case-study detail route is a documented follow-on
 * surface, not yet built — see Track P2 in TRACKER.md).
 */

/** `/projects/[slug]` — the project detail route (Track P). */
export function projectHref(slug: string): string {
  return `/projects/${slug}`
}

/**
 * `/case-studies/[project]/[slug]` (+ `/[chapter]` for chaptered cases) —
 * segments come from frontmatter (see src/lib/content/case-studies.ts and
 * ADR 012). Every caller builds the URL through here.
 */
export function caseStudyHref(
  projectSlug: string,
  caseStudySlug: string,
  chapterSlug?: string
): string {
  const base = `/case-studies/${projectSlug}/${caseStudySlug}`
  return chapterSlug ? `${base}/${chapterSlug}` : base
}

/** `/case-studies` — the collection landing page. */
export const CASE_STUDIES_HREF = '/case-studies'

/** `/case-studies#era-research` or `#era-engineering` — an era's group on the landing page. */
export function caseStudiesEraHref(type: 'research' | 'engineering'): string {
  return `${CASE_STUDIES_HREF}#${caseStudiesEraAnchor(type)}`
}

/** DOM id of an era group heading on the landing page. */
export function caseStudiesEraAnchor(type: 'research' | 'engineering'): string {
  return `era-${type}`
}

/** `/research` or `/engineering` — the era landing page for a project type. */
export function eraHref(type: 'research' | 'engineering'): string {
  return type === 'research' ? '/research' : '/engineering'
}
