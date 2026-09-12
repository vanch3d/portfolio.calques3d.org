import { getTranslations } from 'next-intl/server'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { NavLink } from '@/components/ui/NavLink'
import { NamedRuleCard } from './_components/NamedRuleCard'

export const metadata = {
  title: 'Design System',
}

// Static colour strip data — class names must be literal for Tailwind's scanner.
const COLOR_STRIP = [
  { bg: 'bg-ground', hex: '#f8f4ed', name: 'Ground' },
  { bg: 'bg-ink', hex: '#2a2a2a', name: 'Ink' },
  { bg: 'bg-ink-secondary', hex: '#6b6b6b', name: 'Secondary' },
  { bg: 'bg-ink-ghost', hex: '#c8c4bc', name: 'Ghost' },
  { bg: 'bg-active', hex: '#c0392b', name: 'Active' },
] as const

export default async function DesignSystemPage() {
  const t = await getTranslations('LabDesignSystem')
  const tRules = await getTranslations('NamedRuleCard')
  const tNav = await getTranslations('LabNav')

  return (
    <main className="page-wrap py-xl">
      {/* ── Page header ─────────────────────────────────────────── */}
      <header className="mb-2xl">
        <SectionLabel className="mb-sm">{t('section_label')}</SectionLabel>
        <h1 className="mb-md font-display text-headline leading-headline text-ink italic">
          {t('title')}
        </h1>
        <p className="max-w-prose font-body text-body leading-body text-ink-secondary">
          {t('thesis')}
        </p>
      </header>

      {/* ── Named rules ─────────────────────────────────────────── */}
      <section aria-labelledby="named-rules-heading">
        <SectionLabel as="h2" id="named-rules-heading" className="mb-lg">
          {t('named_rules_heading')}
        </SectionLabel>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-md">
          <NamedRuleCard
            name={tRules('one_red_name')}
            statement={tRules('one_red_statement')}
            rationale={tRules('one_red_rationale')}
          />
          <NamedRuleCard
            name={tRules('no_decoration_name')}
            statement={tRules('no_decoration_statement')}
            rationale={tRules('no_decoration_rationale')}
          />
          <NamedRuleCard
            name={tRules('flat_by_construction_name')}
            statement={tRules('flat_by_construction_statement')}
            rationale={tRules('flat_by_construction_rationale')}
          />
        </div>
      </section>

      {/* ── Section divider ─────────────────────────────────────── */}
      <hr className="my-2xl border-t-heavy border-none border-ink" aria-hidden="true" />

      {/* ── Colours preview ─────────────────────────────────────── */}
      <section aria-labelledby="colors-heading" className="mb-2xl">
        <SectionLabel as="h2" id="colors-heading" className="mb-md">
          {t('colors_section_label')}
        </SectionLabel>
        <p className="mb-lg max-w-prose font-body text-body leading-body text-ink-secondary">
          {t('colors_intro')}
        </p>

        {/* Compact colour strip — static class names for Tailwind scanner */}
        <div className="mb-md flex flex-wrap items-end gap-md" aria-hidden="true">
          {COLOR_STRIP.map(({ bg, hex, name }) => (
            <div key={name} className="flex flex-col gap-xs">
              <div
                className={`h-swatch-strip-h w-swatch-strip-w border-ghost border-ink-ghost ${bg}`}
              />
              <span className="label">{name}</span>
              <span className="label text-ink-ghost">{hex}</span>
            </div>
          ))}
        </div>

        <NavLink href="/lab/design-system/colors" className="mt-sm inline-block">
          {t('full_colors_doc_link')}
        </NavLink>
      </section>

      {/* ── Typography preview ──────────────────────────────────── */}
      <section aria-labelledby="type-heading">
        <SectionLabel as="h2" id="type-heading" className="mb-md">
          {t('type_section_label')}
        </SectionLabel>
        <p className="mb-lg max-w-prose font-body text-body leading-body text-ink-secondary">
          {t('type_intro')}
        </p>

        {/* Compact type ramp — static classes required */}
        <div className="flex flex-col border-t-ghost border-ink-ghost">
          <div className="grid grid-cols-[80px_1fr] items-baseline gap-lg border-b-ghost border-ink-ghost py-md">
            <span className="label text-ink-ghost">{t('type_role_display')}</span>
            <span className="font-display text-display leading-display text-ink italic">
              {t('type_specimen_display')}
            </span>
          </div>
          <div className="grid grid-cols-[80px_1fr] items-baseline gap-lg border-b-ghost border-ink-ghost py-md">
            <span className="label text-ink-ghost">{t('type_role_headline')}</span>
            <span className="font-display text-headline leading-headline text-ink italic">
              {t('type_specimen_headline')}
            </span>
          </div>
          <div className="grid grid-cols-[80px_1fr] items-baseline gap-lg border-b-ghost border-ink-ghost py-md">
            <span className="label text-ink-ghost">{t('type_role_title')}</span>
            <span className="font-body text-title leading-title font-medium text-ink">
              {t('type_specimen_title')}
            </span>
          </div>
          <div className="grid grid-cols-[80px_1fr] items-baseline gap-lg border-b-ghost border-ink-ghost py-md">
            <span className="label text-ink-ghost">{t('type_role_body')}</span>
            <span className="font-body text-body leading-body text-ink">
              {t('type_specimen_body')}
            </span>
          </div>
          <div className="grid grid-cols-[80px_1fr] items-baseline gap-lg border-b-ghost border-ink-ghost py-md">
            <span className="label text-ink-ghost">{t('type_role_label')}</span>
            <span className="label">{t('type_specimen_label')}</span>
          </div>
        </div>

        <NavLink href="/lab/design-system/typography" className="mt-md inline-block">
          {t('full_type_doc_link')}
        </NavLink>
      </section>

      {/* ── Section divider ─────────────────────────────────────── */}
      <hr className="my-2xl border-t-ghost border-none border-ink-ghost" aria-hidden="true" />

      {/* ── Atoms preview ───────────────────────────────────────── */}
      <section aria-labelledby="atoms-heading" className="mb-2xl">
        <SectionLabel as="h2" id="atoms-heading" className="mb-md">
          {t('atoms_section_label')}
        </SectionLabel>
        <p className="mb-lg max-w-prose font-body text-body leading-body text-ink-secondary">
          {t('atoms_preview_intro')}
        </p>

        {/* Compact atom strip — one specimen row per atom */}
        <div className="mb-md flex flex-col border-t-ghost border-ink-ghost">
          <div className="grid grid-cols-[100px_1fr] items-baseline gap-lg border-b-ghost border-ink-ghost py-md">
            <span className="label text-ink-ghost">NavLink</span>
            <nav aria-label="NavLink preview" className="flex items-baseline gap-lg">
              <NavLink href="/">Nicolas Van Labeke</NavLink>
              <span className="label text-ink-ghost" aria-hidden="true">
                /
              </span>
              <NavLink href="/lab">Lab</NavLink>
              <span className="label text-ink-ghost" aria-hidden="true">
                /
              </span>
              <span className="label active-mark">Design System</span>
            </nav>
          </div>
          <div className="grid grid-cols-[100px_1fr] items-baseline gap-lg border-b-ghost border-ink-ghost py-md">
            <span className="label text-ink-ghost">SectionLabel</span>
            <div className="flex items-baseline gap-lg">
              <SectionLabel>Colors</SectionLabel>
              <SectionLabel active>Lab</SectionLabel>
              <SectionLabel as="h3">Typography</SectionLabel>
            </div>
          </div>
          <div className="grid grid-cols-[100px_1fr] items-start gap-lg border-b-ghost border-ink-ghost py-md">
            <span className="label text-ink-ghost">NamedRuleCard</span>
            <NamedRuleCard name={tRules('one_red_name')} statement={tRules('one_red_statement')} />
          </div>
        </div>

        <NavLink href="/lab/design-system/atoms">{t('full_atoms_doc_link')}</NavLink>
      </section>

      {/* ── Section divider ─────────────────────────────────────── */}
      <hr className="my-2xl border-t-ghost border-none border-ink-ghost" aria-hidden="true" />

      {/* ── Molecules preview ───────────────────────────────────── */}
      <section aria-labelledby="molecules-heading" className="mb-2xl">
        <SectionLabel as="h2" id="molecules-heading" className="mb-md">
          {t('molecules_section_label')}
        </SectionLabel>
        <p className="mb-lg max-w-prose font-body text-body leading-body text-ink-secondary">
          {t('molecules_preview_intro')}
        </p>

        <div className="mb-md flex flex-col border-t-ghost border-ink-ghost">
          <div className="grid grid-cols-[140px_1fr] items-baseline gap-lg border-b-ghost border-ink-ghost py-md">
            <span className="label text-ink-ghost">TagFilterDrawer</span>
            <span className="font-body text-caption leading-body text-ink-secondary">
              {t('tag_filter_drawer_desc')}
            </span>
          </div>
        </div>

        <NavLink href="/lab/design-system/molecules">{t('full_molecules_doc_link')}</NavLink>
      </section>

      {/* ── Footer ──────────────────────────────────────────────── */}
      <footer className="mt-2xl flex flex-wrap items-baseline justify-between gap-md border-t-ghost border-ink-ghost pt-xl">
        <span className="label text-ink-ghost">{tNav('footer_note')}</span>
        <nav aria-label={tNav('nav_footer_aria')} className="flex gap-lg">
          <NavLink href="/lab/design-system/colors">{tNav('nav_colors')}</NavLink>
          <NavLink href="/lab/design-system/typography">{tNav('nav_typography')}</NavLink>
          <NavLink href="/lab/design-system/atoms">{tNav('nav_atoms')}</NavLink>
          <NavLink href="/lab/design-system/molecules">{tNav('nav_molecules')}</NavLink>
        </nav>
      </footer>
    </main>
  )
}
