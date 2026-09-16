'use client'

import type { Publication } from '@/types/content'
import PublicationSearchBar from '@/app/publications/_components/PublicationSearchBar'
import { PublicationsBlock } from '@/app/projects/[slug]/_components/PublicationsBlock'
import { useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'

type PublicationMainClientProps = {
  publications: Publication[]
}

function groupByYear(publications: Publication[]): [number, Publication[]][] {
  const groups = new Map<number, Publication[]>()
  for (const pub of publications) {
    const existing = groups.get(pub.year) ?? []
    existing.push(pub)
    groups.set(pub.year, existing)
  }
  return [...groups.entries()].sort(([a], [b]) => b - a)
}

export default function PublicationMainClient({ publications }: PublicationMainClientProps) {
  const t = useTranslations('Publications')

  const [activeTags, setActiveTags] = useState<string[]>([])
  function handleTagsChange(newTags: string[]) {
    setActiveTags(newTags)
  }

  const byYear = groupByYear(publications)
  const byYearFiltered = byYear.map(([year, pubs]): [number, number, Publication[]] => {
    return [
      year,
      pubs.length,
      pubs.filter(
        (e) => activeTags.length === 0 || e.tags.some((item) => activeTags.includes(item))
      ),
    ]
  })

  const countFiltered = useMemo(() => {
    return byYearFiltered.reduce((count, [, , pubs]) => count + pubs.length, 0)
  }, [byYearFiltered])

  return (
    <main>
      <div className={'my-xl'}>
        <PublicationSearchBar
          publications={publications}
          activeTags={activeTags}
          onTagsChange={handleTagsChange}
        />

        <p
          role="status"
          id="result-count"
          className={
            'font-label text-tag-w2 leading-label tracking-label text-ink-secondary uppercase'
          }
        >
          {t('list_filtered_count', { count: countFiltered, max: publications.length })}
        </p>
      </div>

      <div className="columns-1 md:columns-2">
        {byYearFiltered.map(([year, max, pubs]) => (
          <PublicationsBlock
            key={`pub-${year}`}
            groupName={`${year} - ${pubs.length}/${max}`}
            publications={pubs}
            className={'mb-sm break-inside-avoid'}
            hasAbstract
            hasMetadata
            hasProject
          />
        ))}
      </div>
    </main>
  )
}
