import type { Metadata, Route } from 'next'
import { getTranslations } from 'next-intl/server'
import { NavLink } from '@/components/ui/NavLink'
import { PageShell } from '@/components/ui/PageShell'

export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: 'Engineering — Nicolas Van Labeke',
}

/**
 * /engineering — placeholder page.
 * Route registered so NavLink hrefs compile. Full implementation is a future step.
 */
export default async function EngineeringPage() {
  const t = await getTranslations('EngineeringPage')

  return (
    <PageShell
      breadcrumb={{
        items: [{ label: t('breadcrumb_home'), href: '/' as Route }],
        current: t('title'),
      }}
    >
      <p className="mb-lg label text-ink-secondary">{t('era_label')}</p>
      <h1 className="mb-lg font-display text-headline leading-headline text-ink italic">
        {t('title')}
      </h1>
      <p className="mb-2xl max-w-prose font-body text-body leading-body text-ink-secondary">
        {t('intro')}
      </p>
      <NavLink href="/">{t('return_home')}</NavLink>
    </PageShell>
  )
}
