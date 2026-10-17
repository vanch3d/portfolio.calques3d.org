/**
 * ResourceAnnotationBar — Client, needs ProjectDetail.* strings
 *
 * Full-width separator between narrative (above) and evidence (below).
 * Shows counts for every resource type that has content — types with a
 * zero count are omitted silently (direction contract: "only types with
 * content" appear in the bar).
 */

'use client'

import { useTranslations } from 'next-intl'
import type { ResourceCounts } from '@/lib/content/project-resources'

type ResourceAnnotationBarProps = {
  counts: ResourceCounts
}

const RESOURCE_KEYS = [
  'publications',
  'caseStudies',
  'repositories',
  'external',
  'slides',
  'gallery',
] as const

const MESSAGE_KEY: Record<(typeof RESOURCE_KEYS)[number], string> = {
  publications: 'resource_count_publications',
  caseStudies: 'resource_count_case_studies',
  repositories: 'resource_count_repositories',
  external: 'resource_count_external',
  slides: 'resource_count_slides',
  gallery: 'resource_count_gallery',
}

export function ResourceAnnotationBar({ counts }: ResourceAnnotationBarProps) {
  const t = useTranslations('ProjectDetail')

  const entries = RESOURCE_KEYS.map((key) => ({ key, count: counts[key] })).filter(
    (entry) => entry.count > 0
  )

  if (entries.length === 0) return null

  return (
    <div
      data-testid="resource-annotation-bar"
      className="my-lg flex flex-wrap items-center gap-x-md gap-y-xs border-t-heavy border-ink pt-sm"
    >
      {entries.map((entry) => (
        <span key={entry.key} className="flex flex-col items-center">
          <span aria-hidden="true" className="mb-xs hidden period-tick bg-ink-ghost lg:block" />
          <span className="label text-ink-secondary tabular">
            {t(MESSAGE_KEY[entry.key], { count: entry.count })}
          </span>
        </span>
      ))}
    </div>
  )
}
