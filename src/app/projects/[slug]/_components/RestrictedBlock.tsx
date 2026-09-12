/**
 * RestrictedBlock — Client, needs ProjectDetail.* strings
 *
 * RESTRICTED annotation replacing artefact content for proprietary work.
 * Always shown (never hidden) when a project's visibility calls for it —
 * this is the correct empty state, not an omission.
 */

'use client'

import { useTranslations } from 'next-intl'

export function RestrictedBlock() {
  const t = useTranslations('ProjectDetail')

  return (
    <section data-testid="restricted-block" className="mb-lg border-medium border-ink-ghost p-md">
      <p className="mb-xs label text-ink-ghost">{t('restricted_heading')}</p>
      <p className="font-body text-caption leading-body text-ink-secondary">
        {t('restricted_explanation')}
      </p>
    </section>
  )
}
