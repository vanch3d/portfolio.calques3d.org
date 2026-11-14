import type { Route } from 'next'
import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { NavLink } from '@/components/ui/NavLink'
import { PageShell } from '@/components/ui/PageShell'

export default async function LabIndexPage() {
  const t = await getTranslations('LabNav')

  return (
    <PageShell
      breadcrumb={{
        items: [{ label: t('site_name'), href: '/' as Route }],
        current: t('nav_lab'),
      }}
    >
      <div>
        <SectionLabel className="mb-sm">Lab</SectionLabel>
        <h1 className="mb-2xl max-w-prose font-display text-headline leading-headline text-ink italic">
          {t('index_title')}
        </h1>

        {/* Route list */}
        <nav aria-label={t('nav_section_links_aria')}>
          <ul className="m-0 list-none border-t-heavy border-ink p-0">
            {/* Design System */}
            <li className="border-b-ghost border-ink-ghost">
              <Link
                href="/lab/design-system"
                className="group flex items-baseline justify-between py-md no-underline transition-colors hover:text-active"
              >
                <div className="flex flex-col gap-xs">
                  <span className="font-body text-title leading-title font-medium text-ink transition-colors group-hover:text-active">
                    {t('nav_design_system')}
                  </span>
                  <span className="label">{t('nav_design_system_subtitle')}</span>
                </div>
                <span className="ml-lg label text-ink-secondary transition-colors group-hover:text-active">
                  →
                </span>
              </Link>

              {/* Sub-routes */}
              <div className="flex gap-lg pb-md pl-md">
                <NavLink href="/lab/design-system/colors" className="text-ink-secondary">
                  {t('nav_colors')}
                </NavLink>
                <NavLink href="/lab/design-system/typography" className="text-ink-secondary">
                  {t('nav_typography')}
                </NavLink>
              </div>
            </li>

            {/* ADR */}
            <li className="border-b-ghost border-ink-ghost">
              <Link
                href="/lab/adr"
                className="group flex items-baseline justify-between py-md no-underline transition-colors hover:text-active"
              >
                <div className="flex flex-col gap-xs">
                  <span className="font-body text-title leading-title font-medium text-ink transition-colors group-hover:text-active">
                    {t('nav_adr')}
                  </span>
                  <span className="label">{t('nav_adr_subtitle')}</span>
                </div>
                <span className="ml-lg label text-ink-secondary transition-colors group-hover:text-active">
                  →
                </span>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </PageShell>
  )
}
