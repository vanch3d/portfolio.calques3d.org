/**
 * TaxonomyPanel — Client, needs ProjectDetail.* strings
 *
 * A single aside; responsive arrangement (2-col grid on sm/md, single
 * column with a right-hand rule on lg) comes from CSS classes on one shared
 * field set — no duplicated column/band DOM blocks.
 *
 * Takes the full `tags` list and slices it internally (sliceTags, per
 * breakpoint tag limit) rather than receiving pre-sliced props — the
 * caller shouldn't need to know this component truncates tags differently
 * per breakpoint. Only the (small) tag-chip area needs three
 * responsively-toggled variants, since a fixed truncation count can't be
 * chosen at render time without JS breakpoint detection (this route is
 * SSG) — everything else in the panel renders once.
 */

'use client'

import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'
import { formatPeriod } from '@/lib/period'
import type { ProjectType, ProjectStatus, ProjectVisibility } from '@/types/content'
import { sliceTags } from '../_utils/project-utils'

type RoleOrFunding = { kind: 'role'; value: string } | { kind: 'funding'; value: string }

type TaxonomyPanelProps = {
  type: ProjectType
  status: ProjectStatus
  roleOrFunding: RoleOrFunding | null
  client?: string
  organisation: string
  location: string
  period: { start: string; end: string | null }
  visibility: ProjectVisibility
  tags: string[]
}

type FieldProps = {
  label: string
  children: React.ReactNode
  primary?: boolean
  className?: string
}

function Field({ label, children, primary = false, className }: FieldProps) {
  return (
    <div className={className}>
      <p className="mb-xs label text-ink-ghost">{label}</p>
      <p className={cn('label', primary ? 'text-title text-ink' : 'text-ink-secondary')}>
        {children}
      </p>
    </div>
  )
}

const TAG_LIMITS = { sm: 3, md: 5 } as const

export function TaxonomyPanel({
  type,
  status,
  roleOrFunding,
  client,
  organisation,
  location,
  period,
  visibility,
  tags,
}: TaxonomyPanelProps) {
  const t = useTranslations('ProjectDetail')

  const typeLabel = type === 'research' ? t('type_research') : t('type_engineering')
  const statusLabel = t(`status_${status}`)
  const visibilityLabel = t(`visibility_${visibility}`)
  const periodLabel = formatPeriod(period.start, period.end, t('period_present_label'))
  const tagsLabel = type === 'engineering' ? t('taxonomy_stack_label') : t('taxonomy_tags_label')

  const roleOrFundingField = roleOrFunding && (
    <Field
      label={roleOrFunding.kind === 'role' ? t('taxonomy_role_label') : t('taxonomy_funding_label')}
      primary
    >
      {roleOrFunding.value}
    </Field>
  )

  const tagSlices = {
    sm: sliceTags(tags, TAG_LIMITS.sm),
    md: sliceTags(tags, TAG_LIMITS.md),
    all: sliceTags(tags, tags.length),
  }

  return (
    <aside
      data-testid="taxonomy-panel"
      aria-label={t('taxonomy_heading')}
      className="lg:border-r-ghost grid grid-cols-2 gap-x-md gap-y-sm md:flex md:flex-wrap md:items-baseline md:gap-lg lg:flex-col lg:flex-nowrap lg:items-stretch lg:gap-lg lg:border-ink-ghost lg:pr-lg"
    >
      <Field label={t('taxonomy_type_label')} primary>
        {typeLabel}
      </Field>
      <Field label={t('taxonomy_status_label')}>
        <span className={status === 'ongoing' ? 'text-active' : undefined}>{statusLabel}</span>
      </Field>
      {roleOrFundingField}
      <Field label={t('taxonomy_organisation_label')} primary>
        {organisation}
        <span className="mt-2xs hidden text-ink-secondary lg:block">{location}</span>
        {client && <span className="mt-2xs hidden text-ink-secondary lg:block">{client}</span>}
      </Field>
      <Field label={t('taxonomy_period_label')}>
        <span className="tabular">{periodLabel}</span>
      </Field>
      <Field label={t('taxonomy_visibility_label')} primary className="hidden lg:block">
        {visibilityLabel}
      </Field>

      <div className="col-span-2 md:col-span-1">
        <p className="mb-xs label text-ink-ghost">{tagsLabel}</p>

        <div className="flex flex-wrap gap-xs md:hidden">
          {tagSlices.sm.visible.map((tag) => (
            <span
              key={tag}
              className="py-2xs border-ghost border-ink-ghost px-xs label text-ink-secondary"
            >
              {tag}
            </span>
          ))}
          {tagSlices.sm.moreCount > 0 && (
            <span className="label text-ink-ghost">
              {t('tags_more', { count: tagSlices.sm.moreCount })}
            </span>
          )}
        </div>

        <div className="hidden flex-wrap gap-xs md:flex lg:hidden">
          {tagSlices.md.visible.map((tag) => (
            <span
              key={tag}
              className="py-2xs border-ghost border-ink-ghost px-xs label text-ink-secondary"
            >
              {tag}
            </span>
          ))}
          {tagSlices.md.moreCount > 0 && (
            <span className="label text-ink-ghost">
              {t('tags_more', { count: tagSlices.md.moreCount })}
            </span>
          )}
        </div>

        <div className="hidden flex-wrap gap-xs lg:flex">
          {tagSlices.all.visible.map((tag) => (
            <span
              key={tag}
              className="py-2xs border-ghost border-ink-ghost px-xs label text-ink-secondary"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </aside>
  )
}
