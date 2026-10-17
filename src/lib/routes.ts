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
 * `/case-studies/[project]--[slug]` — flat URL, uniqueness enforced by the
 * `{project}--{slug}` naming convention (see src/lib/content/case-studies.ts).
 * The route itself is not yet built (Track P2) — this builder exists so
 * CaseStudiesBlock can link to it once it lands, without every caller
 * re-deriving the URL shape.
 */
export function caseStudyHref(projectSlug: string, caseStudySlug: string): string {
  return `/case-studies/${projectSlug}--${caseStudySlug}`
}

/** `/research` or `/engineering` — the era landing page for a project type. */
export function eraHref(type: 'research' | 'engineering'): string {
  return type === 'research' ? '/research' : '/engineering'
}
