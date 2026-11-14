import type { Route } from 'next'
import { NavLink } from '@/components/ui/NavLink'
import { PageShell } from '@/components/ui/PageShell'
import { getTranslations } from 'next-intl/server'

export default async function NotFound() {
  const t = await getTranslations('AppNav')
  return (
    <PageShell
      breadcrumb={{
        items: [{ label: t('breadcrumb_home'), href: '/' as Route }],
        current: t('not_found_title'),
      }}
    >
      <p className="mb-sm label text-ink">404</p>
      <h1 className="mb-md font-display text-headline leading-headline text-ink italic">
        {t('not_found_title')}
      </h1>
      <p className="mb-lg max-w-prose font-body text-body leading-body text-ink-secondary">
        {t('not_found_message')}
      </p>
      <NavLink href="/">{t('return_home')}</NavLink>
    </PageShell>
  )
}
