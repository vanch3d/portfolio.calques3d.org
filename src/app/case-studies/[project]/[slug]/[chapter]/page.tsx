/**
 * /case-studies/[project]/[slug]/[chapter] — one chapter of a chaptered case.
 * Rendering: SSG
 */

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import {
  getAdjacentChapters,
  getCaseStudyBySlug,
  getCaseStudyDir,
  getChapterBySlug,
  getChapterParams,
  importCaseStudyFileMDX,
  readCaseStudySource,
} from '@/lib/content/case-studies'
import { extractH1 } from '@/lib/case-study-blocks'
import { resolveCaseStudyImages } from '@/lib/content/case-study-images'
import { getProjectBySlug } from '@/lib/content/projects'
import { isFlagEnabled } from '@/lib/flags'
import { getTranslations } from 'next-intl/server'
import { PageShell } from '@/components/ui/PageShell'
import { CaseStudyBody } from '../../../_components/CaseStudyBody'
import { CaseStudyProjectLink } from '../../../_components/CaseStudyProjectLink'
import { CaseTitleBlock } from '../../../_components/CaseTitleBlock'
import { ChapterNav } from '../../../_components/ChapterNav'
import { ChapterRail } from '../../../_components/ChapterRail'
import { buildCaseStudyBreadcrumb } from '../../../_utils/case-study-breadcrumb'

type ChapterPageParams = { project: string; slug: string; chapter: string }

type ChapterPageProps = {
  params: Promise<ChapterPageParams>
}

export const dynamicParams = false

export async function generateStaticParams(): Promise<ChapterPageParams[]> {
  return getChapterParams()
}

export async function generateMetadata({ params }: ChapterPageProps): Promise<Metadata> {
  const { project, slug, chapter } = await params
  const cs = getCaseStudyBySlug(project, slug)
  const ch = cs ? getChapterBySlug(cs, chapter) : null
  return cs && ch ? { title: `${ch.title} — ${cs.title}` } : {}
}

export default async function ChapterPage({ params }: ChapterPageProps) {
  const { project, slug, chapter } = await params
  const cs = getCaseStudyBySlug(project, slug)
  const dir = getCaseStudyDir(project, slug)
  const ch = cs ? getChapterBySlug(cs, chapter) : null
  if (!cs || !dir || !ch || !cs.chapters) notFound()

  const source = readCaseStudySource(dir, ch.file)
  const [Content, images] = await Promise.all([
    importCaseStudyFileMDX(dir, ch.file),
    resolveCaseStudyImages(dir, [source]),
  ])
  const { prev, next } = getAdjacentChapters(cs, chapter)
  const projectName = getProjectBySlug(project)?.project.title ?? project
  const chapterNo = cs.chapters.findIndex((c) => c.slug === chapter) + 1
  const hasClosing = Boolean(cs.outro)
  const railOn = isFlagEnabled('chapterRail')
  const t = await getTranslations('CaseStudyHeader')

  return (
    <PageShell
      breadcrumb={buildCaseStudyBreadcrumb({
        project,
        slug,
        current: ch.title,
        hubTitle: cs.title,
        labels: { home: t('home'), list: t('list') },
      })}
      headerExtra={<CaseStudyProjectLink project={project} projectName={projectName} />}
      footer={
        <ChapterNav project={project} slug={slug} prev={prev} next={next} hasClosing={hasClosing} />
      }
    >
      {railOn ? (
        <ChapterRail
          project={project}
          slug={slug}
          chapters={cs.chapters}
          currentSlug={chapter}
          hasClosing={hasClosing}
        />
      ) : null}
      <article>
        <CaseTitleBlock
          title={extractH1(source) ?? ch.title}
          status={cs.status}
          variant="chapter"
          chapterPosition={railOn ? undefined : { number: chapterNo, total: cs.chapters.length }}
        />
        <div className="mt-xl">
          <CaseStudyBody Content={Content} images={images} chapterNo={chapterNo} />
        </div>
      </article>
    </PageShell>
  )
}
