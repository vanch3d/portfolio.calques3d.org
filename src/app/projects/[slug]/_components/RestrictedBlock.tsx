/**
 * RestrictedBlock — Client, needs ProjectDetail.* strings
 *
 * RESTRICTED annotation replacing artefact content for proprietary work.
 * Always shown (never hidden) when a project's visibility calls for it —
 * this is the correct empty state, not an omission.
 */

'use client'

import { useId } from 'react'
import { useTranslations } from 'next-intl'
import { SectionLabel } from '@/components/ui/SectionLabel'

export function RestrictedBlock() {
  const t = useTranslations('ProjectDetail')
  const headingId = useId()

  return (
    <section
      data-testid="restricted-block"
      aria-labelledby={headingId}
      className="mb-lg border-medium border-ink-ghost p-md"
    >
      <SectionLabel as="h2" id={headingId} className="mb-xs">
        {t('restricted_heading')}
      </SectionLabel>
      <p className="font-body text-caption leading-body text-ink-secondary">
        {t('restricted_explanation')}
      </p>
    </section>
  )
}
