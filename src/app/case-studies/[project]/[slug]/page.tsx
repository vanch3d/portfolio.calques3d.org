/**
 * /case-studies/[project]/[slug] — flat case: the whole page.
 * Chaptered case: the hub (intro, reading guide, chapter list, closing).
 * Per ADR 021 this page.tsx is the only async component on the surface: it
 * imports the MDX modules and resolves every image up front.
 * Rendering: SSG
 */

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import {
  getCaseStudyBySlug,
  getCaseStudyDir,
  getCaseStudyParams,
  importCaseStudyFileMDX,
  importCaseStudyMDX,
  readCaseStudySource,
} from '@/lib/content/case-studies'
import { resolveCaseStudyImages } from '@/lib/content/case-study-images'
import { getProjectBySlug } from '@/lib/content/projects'
import { getTranslations } from 'next-intl/server'
import { ChapterList } from '@/components/case-studies/ChapterList'
import { PageShell } from '@/components/ui/PageShell'
import { ReadingGuide } from '@/components/case-studies/ReadingGuide'
import { CaseStudyBody } from '../../_components/CaseStudyBody'
import { CaseStudyProjectLink } from '../../_components/CaseStudyProjectLink'
import { CaseStudyOutro } from '../../_components/CaseStudyOutro'
import { CaseTitleBlock } from '../../_components/CaseTitleBlock'
import { buildCaseStudyBreadcrumb } from '../../_utils/case-study-breadcrumb'

type CaseStudyPageParams = { project: string; slug: string }

type CaseStudyPageProps = {
  params: Promise<CaseStudyPageParams>
}

export const dynamicParams = false

export async function generateStaticParams(): Promise<CaseStudyPageParams[]> {
  return getCaseStudyParams()
}

export async function generateMetadata({ params }: CaseStudyPageProps): Promise<Metadata> {
  const { project, slug } = await params
  const cs = getCaseStudyBySlug(project, slug)
  return cs ? { title: cs.title } : {}
}

export default async function CaseStudyPage({ params }: CaseStudyPageProps) {
  const { project, slug } = await params
  const cs = getCaseStudyBySlug(project, slug)
  const dir = getCaseStudyDir(project, slug)
  if (!cs || !dir) notFound()

  const projectName = getProjectBySlug(project)?.project.title ?? project
  const indexSource = readCaseStudySource(dir)
  const sources = [indexSource]
  if (cs.intro) sources.push(readCaseStudySource(dir, cs.intro))
  if (cs.outro) sources.push(readCaseStudySource(dir, cs.outro))

  const [Main, Intro, Outro, images] = await Promise.all([
    importCaseStudyMDX(dir),
    cs.intro ? importCaseStudyFileMDX(dir, cs.intro) : null,
    cs.outro ? importCaseStudyFileMDX(dir, cs.outro) : null,
    resolveCaseStudyImages(dir, sources),
  ])

  const t = await getTranslations('CaseStudyHeader')
  const shellProps = {
    breadcrumb: buildCaseStudyBreadcrumb({
      project,
      slug,
      current: cs.title,
      labels: { home: t('home'), list: t('list') },
    }),
    headerExtra: <CaseStudyProjectLink project={project} projectName={projectName} />,
  }

  if (cs.chapters) {
    const guide = indexSource.trim() ? (
      <ReadingGuide>
        <Main />
      </ReadingGuide>
    ) : undefined

    return (
      <PageShell {...shellProps}>
        <article>
          <CaseTitleBlock
            title={cs.title}
            status={cs.status}
            chapterCount={cs.chapters.length}
            tags={cs.tags}
          />
          <div className="mt-xl">
            {Intro ? <CaseStudyBody Content={Intro} images={images} aside={guide} /> : null}
          </div>
          <ChapterList project={project} slug={slug} chapters={cs.chapters} />
          {Outro ? (
            <CaseStudyOutro>
              <CaseStudyBody Content={Outro} images={images} />
            </CaseStudyOutro>
          ) : null}
        </article>
      </PageShell>
    )
  }

  return (
    <PageShell {...shellProps}>
      <article>
        <CaseStudyBody
          Content={Main}
          images={images}
          lead
          renderTitleBlock={(lead) => (
            <CaseTitleBlock title={cs.title} status={cs.status} tags={cs.tags} lead={lead} />
          )}
        />
      </article>
    </PageShell>
  )
}
