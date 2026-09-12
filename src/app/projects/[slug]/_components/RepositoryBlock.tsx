/**
 * RepositoryBlock — Client, needs ProjectDetail.* strings
 *
 * GitHub links as reference entries. `repos` are "org/name" strings
 * (project.links.github). Hidden when empty.
 */

'use client'

import { useTranslations } from 'next-intl'

type RepositoryBlockProps = {
  repos: string[]
}

export function RepositoryBlock({ repos }: RepositoryBlockProps) {
  const t = useTranslations('ProjectDetail')

  if (repos.length === 0) return null

  return (
    <section data-testid="repository-block" className="mb-lg">
      <p className="mb-sm label text-ink-ghost">{t('repositories_heading')}</p>
      <ul className="flex flex-col gap-xs">
        {repos.map((repo) => (
          <li key={repo}>
            <a
              href={`https://github.com/${repo}`}
              className="label text-ink-secondary nav-link hover:text-ink"
              target="_blank"
              rel="noopener noreferrer"
            >
              {repo}
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}
