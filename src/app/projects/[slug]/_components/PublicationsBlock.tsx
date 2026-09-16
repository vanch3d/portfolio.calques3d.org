/**
 * PublicationsBlock — Client, needs ProjectDetail.* strings
 *
 * Citation list for a project's publications (Zotero data, resolved and
 * passed in by page.tsx). Hidden entirely when there are none.
 */

'use client'

import { useTranslations } from 'next-intl'
import type { Publication } from '@/types/content'
import { ResourceBlockSection } from './ResourceBlockSection'
import { cn } from '@/lib/utils'
import { projectHref } from '@/lib/routes'
import Link from 'next/link'
import { Route } from 'next'

type PublicationsBlockProps = {
  publications: Publication[]
  groupName?: string
  className?: string
  hasAbstract?: boolean
  hasMetadata?: boolean
  hasProject?: boolean
}

export function PublicationsBlock({
  groupName = undefined,
  publications,
  className,
  hasAbstract = false,
  hasMetadata = false,
  hasProject = false,
}: PublicationsBlockProps) {
  const t = useTranslations('ProjectDetail')

  if (publications.length === 0) return null

  return (
    <ResourceBlockSection
      testId="publications-block"
      heading={groupName ?? t('publications_heading')}
      className={cn(className, 'border-t-heavy pt-sm')}
    >
      <ol className="flex flex-col gap-sm">
        {publications.map((pub) => {
          return (
            <li key={pub.key} className="my-sm font-body text-caption leading-body">
              <p className="mb-xs label tracking-tight text-ink-secondary">
                {t('type', { type: pub.type })}
              </p>

              <p
                className="mb-xs font-body leading-caption"
                data-testid="publication-title"
                dangerouslySetInnerHTML={{ __html: pub.formated || 'record missing' }}
              />

              {hasAbstract && (
                <details className="mb-xs ml-md max-w-full text-label leading-label">
                  <summary>{t('publications_abstract_label')}</summary>
                  <p className={'mb-0'}>{pub.abstract}</p>
                </details>
              )}

              <div className={'ml-md flex gap-sm leading-display'}>
                {hasProject && (
                  <Link href={projectHref(pub.project ?? '') as Route}>
                    <span className="label text-micro text-ink-secondary nav-link transition-colors hover:text-ink">
                      {t('publications_go_to_project')}
                    </span>
                  </Link>
                )}
                {hasMetadata && (
                  <div className="flex gap-sm">
                    {pub.doi && (
                      <a
                        href={`https://www.doi.org/${pub.doi}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={t('publications_doi_aria', { doi: pub.doi })}
                      >
                        <span className="label text-micro text-ink-secondary nav-link transition-colors hover:text-ink">
                          {t('publications_doi_label')}
                        </span>
                      </a>
                    )}

                    {pub.pdf && (
                      <a
                        href={`/publications/${pub.key}/pdf`}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={t('publications_pdf_aria')}
                      >
                        <span
                          className="label text-micro text-ink-secondary nav-link transition-colors hover:text-ink"
                          aria-hidden="true"
                        >
                          {t('publications_pdf_label')}
                        </span>
                      </a>
                    )}
                  </div>
                )}
              </div>
            </li>
          )
        })}
      </ol>
    </ResourceBlockSection>
  )
}
