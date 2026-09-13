/**
 * RepositoryBlock — Client, needs ProjectDetail.* strings
 *
 * GitHub links as reference entries. `repos` are "org/name" strings
 * (project.links.github). When visibility is 'proprietary', renders
 * RestrictedBlock instead — never the repo list. Hidden (returns null)
 * only when public with zero repos.
 */

'use client'

import { useTranslations } from 'next-intl'
import type { ProjectVisibility } from '@/types/content'
import { RestrictedBlock } from './RestrictedBlock'
import { ResourceBlockSection } from './ResourceBlockSection'
import { ExternalAnchor } from './ExternalAnchor'

type RepositoryBlockProps = {
  repos: string[]
  visibility: ProjectVisibility
}

export function RepositoryBlock({ repos, visibility }: RepositoryBlockProps) {
  const t = useTranslations('ProjectDetail')

  if (visibility === 'proprietary') return <RestrictedBlock />
  if (repos.length === 0) return null

  return (
    <ResourceBlockSection testId="repository-block" heading={t('repositories_heading')}>
      <ul className="flex flex-col gap-xs">
        {repos.map((repo) => (
          <li key={repo}>
            <ExternalAnchor href={`https://github.com/${repo}`} className="text-ink-secondary">
              {repo}
            </ExternalAnchor>
          </li>
        ))}
      </ul>
    </ResourceBlockSection>
  )
}
