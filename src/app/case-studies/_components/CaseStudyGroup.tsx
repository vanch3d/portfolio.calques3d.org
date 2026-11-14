/** CaseStudyGroup — Client, owns CaseStudiesIndex.* strings. One era group: ruled label with count, then its entries. */

'use client'

import { useTranslations } from 'next-intl'
import type { CaseStudyGroup as CaseStudyGroupModel } from '@/lib/content/case-study-groups'
import { caseStudiesEraAnchor } from '@/lib/routes'
import { CaseStudyEntry } from './CaseStudyEntry'

type CaseStudyGroupProps = {
  group: CaseStudyGroupModel
}

export function CaseStudyGroup({ group }: CaseStudyGroupProps) {
  const t = useTranslations('CaseStudiesIndex')
  const id = caseStudiesEraAnchor(group.era)

  return (
    <section aria-labelledby={id} className="mt-xl max-w-prose" data-testid="case-study-group">
      <div className="flex items-baseline justify-between border-t-heavy border-ink pt-sm">
        <h2 id={id} className="label not-italic">
          {t(group.era === 'engineering' ? 'group_engineering' : 'group_research')}
        </h2>
        <span aria-hidden="true" className="label">
          {group.items.length}
        </span>
      </div>
      <ol className="list-none">
        {group.items.map((item) => (
          <CaseStudyEntry key={item.href} item={item} />
        ))}
      </ol>
    </section>
  )
}
