import { getTranslations } from 'next-intl/server'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { NavLink } from '@/components/ui/NavLink'
import { Button } from '@/components/ui/Button'
import { NamedRuleCard } from '../_components/NamedRuleCard'
import { FilterInputDemo } from './_components/FilterInputDemo'

export const metadata = {
  title: 'Atoms · Design System',
}

export default async function AtomsPage() {
  const t = await getTranslations('LabAtoms')
  const tRules = await getTranslations('NamedRuleCard')

  return (
    <main className="page-wrap py-xl">
      {/* ── Page header ─────────────────────────────────────────── */}
      <header className="mb-2xl">
        <SectionLabel className="mb-sm">{t('page_section_label')}</SectionLabel>
        <h1 className="mb-md font-display text-headline leading-headline text-ink italic">
          {t('page_title')}
        </h1>
        <p className="max-w-prose font-body text-body leading-body text-ink-secondary">
          {t('page_intro')}
        </p>
      </header>

      {/* ── NavLink ─────────────────────────────────────────────── */}
      <section aria-labelledby="atom-nav-link-heading" className="mb-2xl">
        <SectionLabel as="h2" id="atom-nav-link-heading" className="mb-md">
          {t('nav_link_heading')}
        </SectionLabel>
        <p className="mb-lg max-w-prose font-body text-body leading-body text-ink-secondary">
          {t('nav_link_intro')}
        </p>

        {/* Specimens */}
        <div className="mb-lg flex flex-col border-t-ghost border-ink-ghost">
          {/* Breadcrumb */}
          <div className="border-b-ghost border-ink-ghost py-md">
            <span className="mb-sm block label text-ink-secondary">
              {t('nav_link_specimen_breadcrumb')}
            </span>
            <nav aria-label="NavLink breadcrumb specimen" className="flex items-baseline gap-lg">
              <NavLink href="/">Nicolas Van Labeke</NavLink>
              <span className="label text-ink-ghost" aria-hidden="true">
                /
              </span>
              <NavLink href="/lab">Lab</NavLink>
              <span className="label text-ink-ghost" aria-hidden="true">
                /
              </span>
              <span className="label active-mark" aria-current="page">
                Design System
              </span>
            </nav>
          </div>

          {/* Section nav */}
          <div className="border-b-ghost border-ink-ghost py-md">
            <span className="mb-sm block label text-ink-secondary">
              {t('nav_link_specimen_section')}
            </span>
            <nav aria-label="NavLink section nav specimen" className="flex items-baseline gap-lg">
              <NavLink href="/lab/design-system/colors">Colors</NavLink>
              <NavLink href="/lab/design-system/typography">Typography</NavLink>
              <NavLink href="/lab/design-system/atoms">Atoms</NavLink>
            </nav>
          </div>

          {/* Standalone */}
          <div className="border-b-ghost border-ink-ghost py-md">
            <span className="mb-sm block label text-ink-secondary">
              {t('nav_link_specimen_standalone')}
            </span>
            <NavLink href="/lab/design-system">{t('nav_link_standalone_example')}</NavLink>
          </div>
        </div>

        {/* State annotations */}
        <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-md">
          {[
            { state: 'Rest', desc: t('state_rest') },
            { state: 'Hover', desc: t('state_hover') },
            { state: 'Focus', desc: t('state_focus') },
            { state: 'Current', desc: t('state_current') },
          ].map(({ state, desc }) => (
            <div key={state} className="border-l-heavy border-ink-ghost py-xs pl-md">
              <p className="mb-xs label">{state}</p>
              <p className="font-body text-caption leading-body text-ink-secondary">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <hr className="my-2xl border-t-ghost border-none border-ink-ghost" aria-hidden="true" />

      {/* ── SectionLabel ────────────────────────────────────────── */}
      <section aria-labelledby="atom-section-label-heading" className="mb-2xl">
        <SectionLabel as="h2" id="atom-section-label-heading" className="mb-md">
          {t('section_label_heading')}
        </SectionLabel>
        <p className="mb-lg max-w-prose font-body text-body leading-body text-ink-secondary">
          {t('section_label_intro')}
        </p>

        {/* Specimens */}
        <div className="flex flex-col border-t-ghost border-ink-ghost">
          <div className="grid grid-cols-[120px_1fr] items-baseline gap-lg border-b-ghost border-ink-ghost py-md">
            <span className="label text-ink-secondary">Default</span>
            <SectionLabel>Design System</SectionLabel>
          </div>
          <div className="grid grid-cols-[120px_1fr] items-baseline gap-lg border-b-ghost border-ink-ghost py-md">
            <span className="label text-ink-secondary">active</span>
            <SectionLabel active>Lab</SectionLabel>
          </div>
          <div className="grid grid-cols-[120px_1fr] items-baseline gap-lg border-b-ghost border-ink-ghost py-md">
            <span className="label text-ink-secondary">as=&quot;h2&quot;</span>
            <SectionLabel as="h2">Named Rules</SectionLabel>
          </div>
          <div className="grid grid-cols-[120px_1fr] items-baseline gap-lg border-b-ghost border-ink-ghost py-md">
            <span className="label text-ink-secondary">as=&quot;span&quot;</span>
            <SectionLabel as="span">Era I · Research</SectionLabel>
          </div>
        </div>
      </section>

      <hr className="my-2xl border-t-ghost border-none border-ink-ghost" aria-hidden="true" />

      {/* ── FilterInput ─────────────────────────────────────────── */}
      <section aria-labelledby="atom-filter-input-heading" className="mb-2xl">
        <SectionLabel as="h2" id="atom-filter-input-heading" className="mb-md">
          {t('filter_input_heading')}
        </SectionLabel>
        <p className="mb-lg max-w-prose font-body text-body leading-body text-ink-secondary">
          {t('filter_input_intro')}
        </p>

        {/* Specimens */}
        <div className="mb-lg flex flex-col border-t-ghost border-ink-ghost">
          <div className="border-b-ghost border-ink-ghost py-md">
            <span className="mb-sm block label text-ink-secondary">
              {t('filter_input_specimen_default')}
            </span>
            <div className="max-w-xs">
              <FilterInputDemo
                placeholder="SEARCH..."
                ariaLabel="Filter records — default specimen"
              />
            </div>
          </div>

          <div className="border-b-ghost border-ink-ghost py-md">
            <span className="mb-sm block label text-ink-secondary">
              {t('filter_input_specimen_icon')}
            </span>
            <div className="max-w-xs">
              <FilterInputDemo
                placeholder="SEARCH..."
                ariaLabel="Filter records — icon prefix specimen"
                startAddon="⌕"
              />
            </div>
          </div>

          <div className="border-b-ghost border-ink-ghost py-md">
            <span className="mb-sm block label text-ink-secondary">
              {t('filter_input_specimen_filled')}
            </span>
            <div className="max-w-xs">
              <FilterInputDemo
                placeholder="SEARCH..."
                ariaLabel="Filter records — filled specimen"
                startAddon="⌕"
                initialValue="accessibility"
              />
            </div>
          </div>
        </div>

        {/* State annotations */}
        <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-md">
          {[
            { state: 'Rest', desc: t('state_filter_rest') },
            { state: 'Focus', desc: t('state_filter_focus') },
            { state: 'Filled', desc: t('state_filter_filled') },
          ].map(({ state, desc }) => (
            <div key={state} className="border-l-heavy border-ink-ghost py-xs pl-md">
              <p className="mb-xs label">{state}</p>
              <p className="font-body text-caption leading-body text-ink-secondary">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <hr className="my-2xl border-t-ghost border-none border-ink-ghost" aria-hidden="true" />

      {/* ── NamedRuleCard ────────────────────────────────────────── */}
      <section aria-labelledby="atom-named-rule-card-heading">
        <SectionLabel as="h2" id="atom-named-rule-card-heading" className="mb-md">
          {t('named_rule_card_heading')}
        </SectionLabel>
        <p className="mb-lg max-w-prose font-body text-body leading-body text-ink-secondary">
          {t('named_rule_card_intro')}
        </p>

        {/* With rationale */}
        <span className="mb-sm block label text-ink-secondary">{t('example_with_rationale')}</span>
        <NamedRuleCard
          name={tRules('one_red_name')}
          statement={tRules('one_red_statement')}
          rationale="A second red on the same surface means the first was wrong. Its rarity is the point: it marks the foreground construction element, nothing else."
          className="mb-lg max-w-prose"
        />

        {/* Without rationale */}
        <span className="mb-sm block label text-ink-secondary">
          {t('example_without_rationale')}
        </span>
        <NamedRuleCard
          name={tRules('flat_by_construction_name')}
          statement={tRules('flat_by_construction_statement')}
          className="mb-lg max-w-prose"
        />

        {/* In grid */}
        <span className="mb-sm block label text-ink-secondary">{t('example_in_grid')}</span>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-md">
          <NamedRuleCard name={tRules('one_red_name')} statement={tRules('one_red_statement')} />
          <NamedRuleCard
            name={tRules('no_decoration_name')}
            statement={tRules('no_decoration_statement')}
          />
          <NamedRuleCard
            name={tRules('flat_by_construction_name')}
            statement={tRules('flat_by_construction_statement')}
          />
        </div>
      </section>

      <hr className="my-2xl border-t-ghost border-none border-ink-ghost" aria-hidden="true" />

      {/* ── Interaction states — shared reference for the atoms below ── */}
      <section aria-labelledby="atom-states-heading" className="mb-2xl">
        <SectionLabel as="h2" id="atom-states-heading" className="mb-md">
          {t('states_heading')}
        </SectionLabel>
        <p className="mb-lg max-w-prose font-body text-body leading-body text-ink-secondary">
          {t('states_intro')}
        </p>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-md">
          {[
            { state: 'Rest', desc: t('states_rest_desc') },
            { state: 'Hover', desc: t('states_hover_desc') },
            { state: 'Focus-visible', desc: t('states_focus_desc') },
            { state: 'Active / pressed', desc: t('states_active_desc') },
            { state: 'Selected / checked', desc: t('states_selected_desc') },
            { state: 'Disabled', desc: t('states_disabled_desc') },
          ].map(({ state, desc }) => (
            <div key={state} className="border-l-heavy border-ink-ghost py-xs pl-md">
              <p className="mb-xs label">{state}</p>
              <p className="font-body text-caption leading-body text-ink-secondary">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <hr className="my-2xl border-t-ghost border-none border-ink-ghost" aria-hidden="true" />

      {/* ── Button ──────────────────────────────────────────────── */}
      <section aria-labelledby="atom-button-heading">
        <SectionLabel as="h2" id="atom-button-heading" className="mb-md">
          {t('button_heading')}
        </SectionLabel>
        <p className="mb-lg max-w-prose font-body text-body leading-body text-ink-secondary">
          {t('button_intro')}
        </p>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-lg border-t-ghost border-ink-ghost pt-lg">
          <div className="flex flex-col items-start gap-sm">
            <span className="label">{t('button_specimen_primary')}</span>
            <Button variant="primary">{t('button_label_apply')}</Button>
            <span className="font-label text-micro leading-label text-ink-secondary">
              {t('button_specimen_primary_hint')}
            </span>
          </div>
          <div className="flex flex-col items-start gap-sm">
            <span className="label">{t('button_specimen_primary_disabled')}</span>
            <Button variant="primary" disabled>
              {t('button_label_apply')}
            </Button>
            <span className="font-label text-micro leading-label text-ink-secondary">
              {t('button_specimen_primary_disabled_hint')}
            </span>
          </div>
          <div className="flex flex-col items-start gap-sm">
            <span className="label">{t('button_specimen_secondary')}</span>
            <Button variant="secondary">{t('button_label_cancel')}</Button>
            <span className="font-label text-micro leading-label text-ink-secondary">
              {t('button_specimen_secondary_hint')}
            </span>
          </div>
          <div className="flex flex-col items-start gap-sm">
            <span className="label">{t('button_specimen_secondary_disabled')}</span>
            <Button variant="secondary" disabled>
              {t('button_label_cancel')}
            </Button>
          </div>
          <div className="flex flex-col items-start gap-sm">
            <span className="label">{t('button_specimen_text_action')}</span>
            <Button variant="text-action">{t('button_label_clear')}</Button>
            <span className="font-label text-micro leading-label text-ink-secondary">
              {t('button_specimen_text_action_hint')}
            </span>
          </div>
          <div className="flex flex-col items-start gap-sm">
            <span className="label">{t('button_specimen_text_action_disabled')}</span>
            <Button variant="text-action" disabled>
              {t('button_label_clear')}
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}
