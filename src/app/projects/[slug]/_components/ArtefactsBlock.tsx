/**
 * ArtefactsBlock — Client, needs ProjectDetail.* strings
 *
 * Engineering-only. Figma/screenshot links. When visibility is
 * 'proprietary', renders RestrictedBlock instead — never the artefact list.
 * Hidden (returns null) only when public with zero artefacts.
 */

'use client'

import { useTranslations } from 'next-intl'
import type { ProjectVisibility } from '@/types/content'
import { RestrictedBlock } from './RestrictedBlock'

type ArtefactsBlockProps = {
  artefacts: string[]
  visibility: ProjectVisibility
}

export function ArtefactsBlock({ artefacts, visibility }: ArtefactsBlockProps) {
  const t = useTranslations('ProjectDetail')

  if (visibility === 'proprietary') return <RestrictedBlock />
  if (artefacts.length === 0) return null

  return (
    <section data-testid="artefacts-block" className="mb-lg">
      <p className="mb-sm label text-ink-ghost">{t('artefacts_heading')}</p>
      <ul className="flex flex-col gap-xs">
        {artefacts.map((url) => (
          <li key={url}>
            <a
              href={url}
              className="label text-ink-secondary nav-link hover:text-ink"
              target="_blank"
              rel="noopener noreferrer"
            >
              {url}
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}
