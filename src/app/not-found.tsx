import { NavLink } from '@/components/ui/NavLink'
import { getTranslations } from 'next-intl/server'

export default async function NotFound() {
  const t = await getTranslations('AppNav')
  return (
    <main className="page-wrap flex min-h-screen flex-col justify-center bg-ground text-ink">
      <p className="mb-sm label text-ink-ghost">404</p>
      <h1 className="mb-md font-display text-headline leading-headline text-ink italic">
        {t('not_found_title')}
      </h1>
      <p className="mb-lg max-w-prose font-body text-body leading-body text-ink-secondary">
        {t('not_found_message')}
      </p>
      <NavLink href="/">{t('return_home')}</NavLink>
    </main>
  )
}
