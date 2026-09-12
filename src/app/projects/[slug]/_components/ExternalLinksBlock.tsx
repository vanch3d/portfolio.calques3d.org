/**
 * ExternalLinksBlock — Client, needs ProjectDetail.* strings
 *
 * External site links plus an optional live-deployment link. Hidden when
 * there is nothing to show.
 */

'use client'

import { useTranslations } from 'next-intl'

type ExternalLinksBlockProps = {
  links: string[]
  live?: string
}

export function ExternalLinksBlock({ links, live }: ExternalLinksBlockProps) {
  const t = useTranslations('ProjectDetail')

  if (links.length === 0 && !live) return null

  return (
    <section data-testid="external-links-block" className="mb-lg">
      <p className="mb-sm label text-ink-ghost">{t('external_links_heading')}</p>
      <ul className="flex flex-col gap-xs">
        {live && (
          <li>
            <a
              href={live}
              className="label text-active nav-link hover:text-ink"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t('view_live')}
            </a>
          </li>
        )}
        {links.map((url) => (
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
