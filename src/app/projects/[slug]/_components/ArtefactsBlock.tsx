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
import { ResourceBlockSection } from './ResourceBlockSection'
import { ExternalAnchor } from './ExternalAnchor'

type ArtefactsBlockProps = {
  artefacts: string[]
  visibility: ProjectVisibility
}

export function ArtefactsBlock({ artefacts, visibility }: ArtefactsBlockProps) {
  const t = useTranslations('ProjectDetail')

  if (visibility === 'proprietary') return <RestrictedBlock />
  if (artefacts.length === 0) return null

  return (
    <ResourceBlockSection testId="artefacts-block" heading={t('artefacts_heading')}>
      <ul className="flex flex-col gap-xs">
        {artefacts.map((url) => (
          <li key={url}>
            <ExternalAnchor href={url} className="text-ink-secondary">
              {url}
            </ExternalAnchor>
          </li>
        ))}
      </ul>
    </ResourceBlockSection>
  )
}
