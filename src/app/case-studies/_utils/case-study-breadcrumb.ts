import type { Route } from 'next'
import type { BreadcrumbItem } from '@/components/ui/Breadcrumb'
import { CASE_STUDIES_HREF, caseStudyHref } from '@/lib/routes'

type CaseStudyBreadcrumbParams = {
  project: string
  slug: string
  /** Label of the page itself (the case title, or the chapter title on chapter pages). */
  current: string
  /** Set on chapter pages: adds the hub as a crumb, titled with the case. */
  hubTitle?: string
  labels: { home: string; list: string }
}

/** Trail for a case-study page: Home / Case studies [/ hub] / current. */
export function buildCaseStudyBreadcrumb({
  project,
  slug,
  current,
  hubTitle,
  labels,
}: CaseStudyBreadcrumbParams): { items: BreadcrumbItem[]; current: string } {
  const items: BreadcrumbItem[] = [
    { label: labels.home, href: '/' as Route },
    { label: labels.list, href: CASE_STUDIES_HREF as Route },
  ]
  if (hubTitle) items.push({ label: hubTitle, href: caseStudyHref(project, slug) as Route })

  return { items, current }
}
