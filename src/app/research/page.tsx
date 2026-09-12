import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { NavLink } from '@/components/ui/NavLink'

export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: 'Research — Nicolas Van Labeke',
}

/**
 * /research — placeholder page.
 * Route registered so NavLink hrefs compile. Full implementation is a future step.
 */
export default async function ResearchPage() {
  const t = await getTranslations('ResearchPage')

  return (
    <main className="min-h-screen bg-ground text-ink">
      <header className="page-wrap">
        <nav
          aria-label={t('breadcrumb_aria')}
          className="flex items-baseline gap-lg border-b-ghost border-ink-ghost py-lg"
        >
          <NavLink href="/">Nicolas Van&nbsp;Labeke</NavLink>
          <span className="label text-ink-ghost" aria-hidden="true">
            /
          </span>
          <span className="label active-mark" aria-current="page">
            {t('title')}
          </span>
        </nav>
      </header>

      <div className="page-wrap py-2xl">
        <p className="mb-lg label text-ink-ghost">{t('era_label')}</p>
        <h1 className="mb-lg font-display text-headline leading-headline text-ink italic">
          {t('title')}
        </h1>
        <p className="mb-2xl max-w-prose font-body text-body leading-body text-ink-secondary">
          {t('intro')}
        </p>
        <NavLink href="/">{t('return_home')}</NavLink>
      </div>
    </main>
  )
}
