/**
 * ExternalLinksBlock — Client, needs ProjectDetail.* strings
 *
 * External site links plus an optional live-deployment link. Hidden when
 * there is nothing to show.
 */

'use client'

import { useTranslations } from 'next-intl'
import { ResourceBlockSection } from './ResourceBlockSection'
import { ExternalAnchor } from './ExternalAnchor'

type ExternalLinksBlockProps = {
  links: string[]
  live?: string
}

export function ExternalLinksBlock({ links, live }: ExternalLinksBlockProps) {
  const t = useTranslations('ProjectDetail')

  if (links.length === 0 && !live) return null

  return (
    <ResourceBlockSection testId="external-links-block" heading={t('external_links_heading')}>
      <ul className="flex flex-col gap-xs">
        {live && (
          <li>
            <ExternalAnchor href={live} className="text-active">
              {t('view_live')}
            </ExternalAnchor>
          </li>
        )}
        {links.map((url) => (
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
