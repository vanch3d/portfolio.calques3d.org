import { getTranslations } from "next-intl/server";
import type { InsightMeta } from "@/lib/content/insights";
import { adrSlugFromNumber } from "@/lib/content/adr";

type InsightCalloutStripProps = {
  insight: InsightMeta;
};

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
  const t = await getTranslations("LabAdr");

  const relatedAdrSlug = insight.relatedAdr
    ? adrSlugFromNumber(insight.relatedAdr)
    : null;
  void relatedAdrSlug; // slug reserved for when detail pages are built

  return (
    <aside
      aria-label={t("insights_strip_aria")}
      className="grid grid-cols-callout-strip gap-lg bg-ground-warm border-medium border-ink-secondary px-lg py-md mb-lg"
    >
      {/* ── Main content ──────────────────────────────────────── */}
      <div>
        <span className="label block mb-xs">
          {t("discovered_in_practice")}
        </span>

        <p className="font-display italic text-title leading-title text-ink mb-xs">
          {String(insight.number).padStart(3, "0")} — {insight.title}
        </p>

        <p className="font-body text-caption leading-body text-ink-secondary mb-sm">
          {insight.discoveredDuring}
        </p>

        {insight.tags.length > 0 && (
          <ul
            className="flex flex-wrap gap-xs list-none p-0 m-0"
            aria-label="Tags"
          >
            {insight.tags.map((tag) => (
              <li
                key={tag}
                className="label border-ghost border-ink-ghost px-xs py-xs"
              >
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
          aria-label={t("related_adr", { number: insight.relatedAdr })}
        >
          <span className="label text-ink-ghost block mb-xs">
            {t("related_label")}
          </span>
          <span className="label block">
            {t("related_adr", { number: insight.relatedAdr })}
          </span>
        </div>
      )}
    </aside>
  );
}
