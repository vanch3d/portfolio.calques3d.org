/**
 * /case-studies — collection landing page.
 * The collection index.mdx as the lead, then the cases grouped by era.
 * Rendering: SSG
 */

import type { Metadata, Route } from 'next'
import { getTranslations } from 'next-intl/server'
import { PageShell } from '@/components/ui/PageShell'
import { importCollectionIntroMDX } from '@/lib/content/case-studies'
import { getCaseStudyGroups } from '@/lib/content/case-study-groups'
import { CaseStudiesLead } from './_components/CaseStudiesLead'
import { CaseStudiesLeadBody } from './_components/CaseStudiesLeadBody'
import { CaseStudyGroup } from './_components/CaseStudyGroup'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('CaseStudiesIndex')
  return { title: t('heading') }
}

export default async function CaseStudiesPage() {
  const t = await getTranslations('CaseStudiesIndex')
  const Intro = await importCollectionIntroMDX()
  const groups = getCaseStudyGroups()

  return (
    <PageShell
      breadcrumb={{
        items: [{ label: t('breadcrumb_home'), href: '/' as Route }],
        current: t('heading'),
      }}
    >
      <CaseStudiesLead>
        <CaseStudiesLeadBody Content={Intro} />
      </CaseStudiesLead>
      {groups.map((group) => (
        <CaseStudyGroup key={group.era} group={group} />
      ))}
    </PageShell>
  )
}
