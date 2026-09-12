/**
 * PublicationsBlock — Client, needs ProjectDetail.* strings
 *
 * Citation list for a project's publications (Zotero data, resolved and
 * passed in by page.tsx). Hidden entirely when there are none.
 */

'use client'

import { useTranslations } from 'next-intl'
import type { Publication } from '@/types/content'

type PublicationsBlockProps = {
  publications: Publication[]
}

function citation(pub: Publication): string {
  const authors = pub.authors.join(', ')
  const venue = pub.venue ? `, ${pub.venue}` : ''
  return `${authors} (${pub.year}). ${pub.title}${venue}.`
}

export function PublicationsBlock({ publications }: PublicationsBlockProps) {
  const t = useTranslations('ProjectDetail')

  if (publications.length === 0) return null

  return (
    <section data-testid="publications-block" className="mb-lg">
      <p className="mb-sm label text-ink-ghost">{t('publications_heading')}</p>
      <ol className="flex flex-col gap-sm">
        {publications.map((pub) => (
          <li
            key={pub.key}
            className="border-b-ghost border-ink-ghost pb-sm font-body text-caption leading-body text-ink-secondary"
          >
            {pub.doi ? (
              <a
                href={`https://doi.org/${pub.doi}`}
                className="nav-link hover:text-ink"
                target="_blank"
                rel="noopener noreferrer"
              >
                {citation(pub)}
              </a>
            ) : (
              citation(pub)
            )}
          </li>
        ))}
      </ol>
    </section>
  )
}
