import { getTranslations } from 'next-intl/server'
import { NavLink } from '@/components/ui/NavLink'

type DesignSystemLayoutProps = {
  children: React.ReactNode
}

export default async function DesignSystemLayout({ children }: DesignSystemLayoutProps) {
  const t = await getTranslations('LabNav')

  return (
    <>
      {/* ── Navigation ─────────────────────────────────────────── */}
      <header className="page-wrap">
        <nav aria-label={t('nav_aria_label')} className="border-b-ghost border-ink-ghost py-lg">
          <div className="flex items-baseline gap-lg">
            {/* Breadcrumb */}
            <NavLink href="/">{t('site_name')}</NavLink>
            <span className="label text-ink-ghost" aria-hidden="true">
              /
            </span>
            <NavLink href="/lab">{t('nav_lab')}</NavLink>
            <span className="label text-ink-ghost" aria-hidden="true">
              /
            </span>
            {/* The One Red Rule: active breadcrumb segment — non-link span, not NavLink */}
            <span className="label active-mark" aria-current="page">
              {t('nav_design_system')}
            </span>

            {/* Section links — right-aligned */}
            <nav
              aria-label={t('nav_section_links_aria')}
              className="ml-auto flex items-baseline gap-lg"
            >
              <NavLink href="/lab/design-system/colors">{t('nav_colors')}</NavLink>
              <NavLink href="/lab/design-system/typography">{t('nav_typography')}</NavLink>
              <NavLink href="/lab/design-system/atoms">{t('nav_atoms')}</NavLink>
              <NavLink href="/lab/design-system/molecules">{t('nav_molecules')}</NavLink>
            </nav>
          </div>
        </nav>
      </header>

      {/* ── Page content ────────────────────────────────────────── */}
      {children}
    </>
  )
}
