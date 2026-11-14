import type { Route } from 'next'
import { getTranslations } from 'next-intl/server'
import { NavLink } from '@/components/ui/NavLink'
import { PageShell } from '@/components/ui/PageShell'

type DesignSystemLayoutProps = {
  children: React.ReactNode
}

// The shell lives here, not in each page: every design-system page shares the
// same breadcrumb (Home / Lab / Design System) and the same section links.
export default async function DesignSystemLayout({ children }: DesignSystemLayoutProps) {
  const t = await getTranslations('LabNav')

  return (
    <PageShell
      breadcrumb={{
        items: [
          { label: t('site_name'), href: '/' as Route },
          { label: t('nav_lab'), href: '/lab' as Route },
        ],
        current: t('nav_design_system'),
      }}
      headerExtra={
        <nav aria-label={t('nav_section_links_aria')} className="mb-lg flex items-baseline gap-lg">
          <NavLink href="/lab/design-system/colors">{t('nav_colors')}</NavLink>
          <NavLink href="/lab/design-system/typography">{t('nav_typography')}</NavLink>
          <NavLink href="/lab/design-system/atoms">{t('nav_atoms')}</NavLink>
          <NavLink href="/lab/design-system/molecules">{t('nav_molecules')}</NavLink>
        </nav>
      }
    >
      {children}
    </PageShell>
  )
}
