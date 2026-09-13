import { getTranslations } from 'next-intl/server'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { MoleculeFrame } from './_components/MoleculeFrame'
import { PropsTable } from './_components/PropsTable'
import { TagFilterDrawerDemo } from './_components/TagFilterDrawerDemo'
import { PeriodRuler } from '@/components/ui/PeriodRuler'
import { PeriodStrip } from '@/components/ui/PeriodStrip'
import type { PeriodDatum } from '@/lib/period'
import type { PropRow } from './_components/PropsTable'
import type { TagWithCount } from '@/components/ui/TagFilterDrawer'

export const metadata = {
  title: 'Molecules · Design System',
}

const SAMPLE_TAGS: TagWithCount[] = [
  { tag: 'testing', count: 5 },
  { tag: 'workflow', count: 4 },
  { tag: 'agents', count: 3 },
  { tag: 'architecture', count: 3 },
  { tag: 'mdx', count: 3 },
  { tag: 'a11y', count: 2 },
  { tag: 'cypress', count: 2 },
  { tag: 'design-system', count: 2 },
  { tag: 'ci-cd', count: 1 },
  { tag: 'i18n', count: 1 },
  { tag: 'routing', count: 1 },
  { tag: 'wcag', count: 1 },
]

const CAREER_DOMAIN = { start: 1995, end: 2026 }

const ARCHIVED_DATUMS: PeriodDatum[] = [
  { year: 1995, role: 'default' },
  { year: 2010, role: 'project-end' },
]

const ONGOING_DATUMS: PeriodDatum[] = [
  { year: 1995, role: 'default' },
  { year: 2018, role: 'transition' },
  { year: 2023, role: 'project-start' },
  { year: 2026, role: 'present', label: 'Present' },
]

const STAGGER_DATUMS: PeriodDatum[] = [
  { year: 1995, role: 'default' },
  { year: 1997, role: 'project-start' },
  { year: 2026, role: 'default' },
]

const PERIOD_RULER_PROPS: PropRow[] = [
  {
    name: 'domain',
    type: '{ start: number; end: number }',
    required: true,
    notes: 'The full year range the ruler spans. Datums outside this range are dropped.',
  },
  {
    name: 'datums',
    type: 'PeriodDatum[]',
    required: true,
    notes:
      'Tick positions. Same-year datums are merged (deduplicateDatums); near-collisions are staggered above/below (assignLabelPositions).',
  },
  {
    name: 'span',
    type: '{ from: number; to: number }',
    required: false,
    notes: 'Renders a heavier bar above the baseline marking a sub-range, e.g. a project period.',
  },
  {
    name: 'ongoing',
    type: 'boolean',
    required: false,
    defaultValue: 'false',
    notes:
      "Unlocks the One Red Rule active colour on 'project-end' / 'present' datums. Archived timelines stay pure graphite.",
  },
  {
    name: 'contextLabel',
    type: 'string',
    required: false,
    notes:
      'Interpolated into the internally-owned aria-label (PeriodRuler.aria_label), e.g. "Research", a project title. Falls back to a generic label when omitted.',
  },
]

const PERIOD_STRIP_PROPS: PropRow[] = [
  {
    name: 'domain',
    type: '{ start: number; end: number }',
    required: true,
    notes: 'Start and end year rendered at either end of the compact strip.',
  },
  {
    name: 'ongoing',
    type: 'boolean',
    required: false,
    defaultValue: 'false',
    notes:
      'When true, the end label reads the localised "present" copy and both the end tick and label take the active colour.',
  },
  {
    name: 'contextLabel',
    type: 'string',
    required: false,
    notes:
      'Interpolated into the internally-owned aria-label (PeriodStrip.aria_label). Falls back to a generic label when omitted.',
  },
]

const TAG_FILTER_DRAWER_PROPS: PropRow[] = [
  {
    name: 'tags',
    type: 'TagWithCount[]',
    required: true,
    notes:
      'Full list of tags with frequency counts. Rendered in three tier groups: high frequency (≥3), multiple references (2), single reference (1).',
  },
  {
    name: 'activeTags',
    type: 'string[]',
    required: true,
    notes:
      'Currently selected tag values. Controls chip display and pressed state on drawer tag buttons.',
  },
  {
    name: 'onTagsChange',
    type: '(tags: string[]) => void',
    required: true,
    notes:
      'Callback invoked whenever the selection changes — via chip remove, drawer toggle, or NONE.',
  },
]

export default async function MoleculesPage() {
  const t = await getTranslations('LabMolecules')

  const decisions = [
    { label: t('decision_layout_label'), note: t('decision_layout_note') },
    { label: t('decision_chips_hide_label'), note: t('decision_chips_hide_note') },
    { label: t('decision_none_label'), note: t('decision_none_note') },
    { label: t('decision_frequency_label'), note: t('decision_frequency_note') },
  ]

  return (
    <main className="page-wrap py-xl">
      <header className="mb-2xl">
        <SectionLabel className="mb-sm">{t('page_section_label')}</SectionLabel>
        <h1 className="mb-md font-display text-headline leading-headline text-ink italic">
          {t('page_title')}
        </h1>
        <p className="max-w-prose font-body text-body leading-body text-ink-secondary">
          {t('page_intro')}
        </p>
      </header>

      <section aria-labelledby="molecule-tag-filter-heading">
        <SectionLabel as="h2" id="molecule-tag-filter-heading" className="mb-md">
          {t('tag_filter_drawer_heading')}
        </SectionLabel>
        <p className="mb-2xl max-w-prose font-body text-body leading-body text-ink-secondary">
          {t('tag_filter_drawer_intro')}
        </p>

        <MoleculeFrame
          name={t('frame_empty_label')}
          description={t('frame_empty_desc')}
          decisions={[]}
        >
          <TagFilterDrawerDemo tags={SAMPLE_TAGS} initialActiveTags={[]} />
        </MoleculeFrame>

        <MoleculeFrame
          name={t('frame_active_label')}
          description={t('frame_active_desc')}
          decisions={decisions}
        >
          <TagFilterDrawerDemo tags={SAMPLE_TAGS} initialActiveTags={['testing', 'a11y']} />
        </MoleculeFrame>

        <div className="mt-2xl">
          <SectionLabel className="mb-md">Props</SectionLabel>
          <PropsTable rows={TAG_FILTER_DRAWER_PROPS} />
        </div>
      </section>

      <section aria-labelledby="molecule-period-ruler-heading" className="mt-2xl">
        <SectionLabel as="h2" id="molecule-period-ruler-heading" className="mb-md">
          {t('period_ruler_heading')}
        </SectionLabel>
        <p className="mb-2xl max-w-prose font-body text-body leading-body text-ink-secondary">
          {t('period_ruler_intro')}
        </p>

        <MoleculeFrame
          name={t('period_ruler_frame_archived_label')}
          description={t('period_ruler_frame_archived_desc')}
          decisions={[]}
        >
          <PeriodRuler domain={CAREER_DOMAIN} datums={ARCHIVED_DATUMS} contextLabel="Calques 3D" />
        </MoleculeFrame>

        <MoleculeFrame
          name={t('period_ruler_frame_ongoing_label')}
          description={t('period_ruler_frame_ongoing_desc')}
          decisions={[]}
        >
          <PeriodRuler
            domain={CAREER_DOMAIN}
            datums={ONGOING_DATUMS}
            span={{ from: 2023, to: 2026 }}
            ongoing={true}
            contextLabel="HiveMQ Edge"
          />
        </MoleculeFrame>

        <MoleculeFrame
          name={t('period_ruler_frame_stagger_label')}
          description={t('period_ruler_frame_stagger_desc')}
          decisions={[]}
        >
          <PeriodRuler domain={CAREER_DOMAIN} datums={STAGGER_DATUMS} contextLabel="Career" />
        </MoleculeFrame>

        <div className="mt-2xl">
          <SectionLabel className="mb-md">Props</SectionLabel>
          <PropsTable rows={PERIOD_RULER_PROPS} />
        </div>
      </section>

      <section aria-labelledby="molecule-period-strip-heading" className="mt-2xl">
        <SectionLabel as="h2" id="molecule-period-strip-heading" className="mb-md">
          {t('period_strip_heading')}
        </SectionLabel>
        <p className="mb-2xl max-w-prose font-body text-body leading-body text-ink-secondary">
          {t('period_strip_intro')}
        </p>

        <MoleculeFrame
          name={t('period_strip_frame_archived_label')}
          description={t('period_strip_frame_archived_desc')}
          decisions={[]}
        >
          <PeriodStrip domain={{ start: 1995, end: 2010 }} contextLabel="Calques 3D" />
        </MoleculeFrame>

        <MoleculeFrame
          name={t('period_strip_frame_ongoing_label')}
          description={t('period_strip_frame_ongoing_desc')}
          decisions={[]}
        >
          <PeriodStrip
            domain={{ start: 2023, end: 2026 }}
            ongoing={true}
            contextLabel="HiveMQ Edge"
          />
        </MoleculeFrame>

        <div className="mt-2xl">
          <SectionLabel className="mb-md">Props</SectionLabel>
          <PropsTable rows={PERIOD_STRIP_PROPS} />
        </div>
      </section>
    </main>
  )
}
