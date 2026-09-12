import { getTranslations } from 'next-intl/server'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { ColorSwatch } from '../_components/ColorSwatch'

export const metadata = {
  title: 'Colours',
}

export default async function ColorsPage() {
  const t = await getTranslations('LabColors')

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

      {/* ── Neutral group ───────────────────────────────────────── */}
      <section aria-labelledby="neutral-heading" className="mb-xl">
        <SectionLabel
          as="h2"
          id="neutral-heading"
          className="mb-md border-b-ghost border-ink-ghost pb-xs"
        >
          {t('group_neutral')}
        </SectionLabel>

        <div className="flex flex-col gap-md">
          <ColorSwatch
            token="color-ground"
            name={t('color_ground_name')}
            hex={t('color_ground_hex')}
            usage={t('color_ground_usage')}
            ariaLabel={t('color_ground_swatch_aria')}
          />

          <hr className="border-t-ghost border-none border-ink-ghost" aria-hidden="true" />

          <ColorSwatch
            token="color-ink"
            name={t('color_ink_name')}
            hex={t('color_ink_hex')}
            usage={t('color_ink_usage')}
            ariaLabel={t('color_ink_swatch_aria')}
          />

          <hr className="border-t-ghost border-none border-ink-ghost" aria-hidden="true" />

          <ColorSwatch
            token="color-ink-secondary"
            name={t('color_ink_secondary_name')}
            hex={t('color_ink_secondary_hex')}
            usage={t('color_ink_secondary_usage')}
            ariaLabel={t('color_ink_secondary_swatch_aria')}
          />

          <hr className="border-t-ghost border-none border-ink-ghost" aria-hidden="true" />

          <ColorSwatch
            token="color-ink-ghost"
            name={t('color_ink_ghost_name')}
            hex={t('color_ink_ghost_hex')}
            usage={t('color_ink_ghost_usage')}
            ariaLabel={t('color_ink_ghost_swatch_aria')}
          />
        </div>
      </section>

      {/* ── Accent group ────────────────────────────────────────── */}
      <section aria-labelledby="accent-heading">
        <SectionLabel
          as="h2"
          id="accent-heading"
          className="mb-md border-b-ghost border-ink-ghost pb-xs"
        >
          {t('group_accent')}
        </SectionLabel>

        <ColorSwatch
          token="color-active"
          name={t('color_active_name')}
          hex={t('color_active_hex')}
          usage={t('color_active_usage')}
          ariaLabel={t('color_active_swatch_aria')}
          namedRule={{
            name: t('color_active_named_rule'),
            body: t('color_active_named_rule_body'),
          }}
        />
      </section>
    </main>
  )
}
