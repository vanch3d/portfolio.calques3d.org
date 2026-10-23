import type { Route } from 'next'
import { getTranslations } from 'next-intl/server'
import { SiteNav } from './_components/SiteNav'
import { HomepageScrollHandler } from './_components/HomepageScrollHandler'
import { CareerArc } from './_components/CareerArc'
import { IdentityBlock } from './_components/IdentityBlock'
import { EraTimeline } from './_components/EraTimeline'
import { getAllResearchProjects } from '@/lib/content/research'
import { getAllEngineeringProjects } from '@/lib/content/engineering'
import { pickSprinkle } from './_utils/arc-sprinkles'
import { RESEARCH_SPRINKLE_YEARS, ENGINEERING_SPRINKLE_YEARS } from './_utils/arc-geometry'
import { CAREER_START } from '@/lib/period'
import Link from 'next/link'

export const dynamic = 'force-static'

export default async function HomePage() {
  const t = await getTranslations('HomePage')
  const tCommon = await getTranslations('Common')

  const present = tCommon('period_present')
  const allResearch = getAllResearchProjects()
  const allEngineering = getAllEngineeringProjects()

  // Rebuilt from the current year on each deploy (force-static) rather than hardcoded.
  const currentYear = new Date().getFullYear()
  const timelineEnd = String(currentYear)
  const yearsElapsed = currentYear - CAREER_START

  const researchSprinkles = RESEARCH_SPRINKLE_YEARS.map((year) =>
    pickSprinkle(allResearch, String(year), present, currentYear)
  )

  const engineeringSprinkles = ENGINEERING_SPRINKLE_YEARS.map((year) =>
    pickSprinkle(allEngineering, String(year), present, currentYear)
  )

  return (
    <>
      <SiteNav id="site-nav" />
      <HomepageScrollHandler />

      <main>
        <section
          id="hero"
          aria-label={t('arc_label', { years: yearsElapsed })}
          className="relative h-screen min-h-[600px] w-full overflow-hidden"
        >
          <p className="sr-only">{t('arc_sr_description')}</p>

          <CareerArc
            arcLabel={t('arc_label', { years: yearsElapsed }).toUpperCase()}
            timelineStart={t('timeline_start')}
            timelineTransition={t('timeline_transition')}
            timelineEnd={timelineEnd}
            researchSprinkles={researchSprinkles}
            engineeringSprinkles={engineeringSprinkles}
          />

          <IdentityBlock />

          <p
            aria-hidden="true"
            className="absolute label text-ink-secondary vertical-rl"
            style={{
              bottom: 'clamp(1.5rem, 4vh, 2.5rem)',
              right: 'var(--page-margin)',
            }}
          >
            {t('scroll_to_explore')}
          </p>
        </section>

        <section aria-label={t('career_timeline_label')} className="px-page pb-2xl">
          <div className="mb-loose flex items-baseline gap-md border-t-ghost border-ink-ghost py-dense">
            <span className="label text-ink-secondary">{t('career_timeline_label')}</span>
            <span className="ml-auto label text-ink-secondary">
              {t('career_timeline_span', {
                start: CAREER_START,
                end: timelineEnd,
                years: yearsElapsed,
              })}
            </span>
          </div>

          <EraTimeline />

          <nav
            aria-label={t('secondary_nav_aria')}
            className="mt-xl flex items-center gap-lg border-t-ghost border-ink-ghost pt-md"
          >
            <Link href="/lab" className="label text-ink-secondary transition-colors hover:text-ink">
              {t('secondary_nav_lab')}
            </Link>
            <Link
              href="/lab/adr"
              className="label text-ink-secondary transition-colors hover:text-ink"
            >
              {t('secondary_nav_adr')}
            </Link>
            <Link
              href="/lab/design-system"
              className="label text-ink-secondary transition-colors hover:text-ink"
            >
              {t('secondary_nav_tokens')}
            </Link>
            <Link
              href={'/contact' as Route}
              aria-label={t('secondary_nav_contact_aria')}
              className="ml-auto label text-active transition-colors hover:text-ink"
            >
              {t('secondary_nav_contact')}
            </Link>
          </nav>
        </section>
      </main>
    </>
  )
}
