import { getTranslations } from 'next-intl/server'
import type { InsightMeta } from '@/lib/content/insights'
import { adrSlugFromNumber } from '@/lib/content/adr'

type InsightCalloutStripProps = {
  insight: InsightMeta
}

/**
 * InsightCalloutStrip — surfaces the most recent Engineering Insight on the
 * ADR register index.
 *
 * Visually distinct from the register: warmer background, medium-weight border.
 * Two-column layout: main content left, related ADR box right.
 * The "DISCOVERED IN PRACTICE" label signals that this knowledge was not
 * planned — it emerged from running the system.
 */
export async function InsightCalloutStrip({ insight }: InsightCalloutStripProps) {
  const t = await getTranslations('LabAdr')

  const relatedAdrSlug = insight.relatedAdr ? adrSlugFromNumber(insight.relatedAdr) : null
  void relatedAdrSlug // slug reserved for when detail pages are built

  return (
    <aside
      aria-label={t('insights_strip_aria')}
      className="mb-lg grid grid-cols-callout-strip gap-lg border-medium border-ink-secondary bg-ground-warm px-lg py-md"
    >
      {/* ── Main content ──────────────────────────────────────── */}
      <div>
        <span className="mb-xs block label">{t('discovered_in_practice')}</span>

        <p className="mb-xs font-display text-title leading-title text-ink italic">
          {String(insight.number).padStart(3, '0')} — {insight.title}
        </p>

        <p className="mb-sm font-body text-caption leading-body text-ink-secondary">
          {insight.discoveredDuring}
        </p>

        {insight.tags.length > 0 && (
          <ul className="m-0 flex list-none flex-wrap gap-xs p-0" aria-label="Tags">
            {insight.tags.map((tag) => (
              <li key={tag} className="border-ghost border-ink-ghost px-xs py-xs label">
                {tag}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* ── Related ADR box ───────────────────────────────────── */}
      {insight.relatedAdr != null && (
        <div
          className="self-center border-ghost border-ink-ghost px-md py-sm text-center"
          aria-label={t('related_adr', { number: insight.relatedAdr })}
        >
          <span className="mb-xs block label text-ink-ghost">{t('related_label')}</span>
          <span className="block label">{t('related_adr', { number: insight.relatedAdr })}</span>
        </div>
      )}
    </aside>
  )
}
