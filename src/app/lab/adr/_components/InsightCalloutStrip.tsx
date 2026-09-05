import Link from "next/link";
import { getTranslations } from "next-intl/server";
import type { InsightMeta } from "@/lib/content/insights";

const MAX_SHOWN = 3;

type InsightCalloutStripProps = {
  insights: InsightMeta[];
  totalInsights: number;
};

export async function InsightCalloutStrip({
  insights,
  totalInsights,
}: InsightCalloutStripProps) {
  const t = await getTranslations("LabAdr");

  const shown = insights.slice(0, MAX_SHOWN);
  const hasMore = totalInsights > MAX_SHOWN;

  return (
    <aside
      data-testid="insight-callout-strip"
      aria-label={t("insights_strip_aria")}
      style={{
        background: "var(--color-ground-raised)",
        border: "var(--line-medium) solid var(--color-ink-secondary)",
        padding: "var(--space-md)",
        marginBottom: "var(--space-lg)",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: hasMore ? "1fr auto" : "1fr",
          gap: "var(--space-md)",
          alignItems: "start",
        }}
      >
        <div>
          <span
            className="label"
            style={{
              display: "block",
              marginBottom: "var(--space-sm)",
            }}
          >
            {t("discovered_in_practice")}
          </span>
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-sm)",
            }}
          >
            {shown.map((insight) => (
              <li key={insight.slug}>
                <Link
                  href={`/lab/insights/${insight.slug}`}
                  className="title-italic text-ink hover:underline focus-visible:underline"
                  style={{
                    display: "block",
                    fontSize: "var(--text-title)",
                    lineHeight: "var(--leading-headline)",
                    textDecoration: "none",
                  }}
                >
                  {String(insight.number).padStart(3, "0")} — {insight.title}
                </Link>
                {insight.tags.length > 0 && (
                  <div
                    aria-label={`Tags: ${insight.tags.join(", ")}`}
                    style={{
                      display: "flex",
                      gap: "var(--space-xs)",
                      flexWrap: "wrap",
                      marginTop: "var(--space-xs)",
                    }}
                  >
                    {insight.tags.map((tag) => (
                      <span
                        key={tag}
                        className="font-label tabular text-ink-secondary"
                        style={{
                          fontSize: "var(--text-label)",
                          letterSpacing: "var(--tracking-label)",
                          textTransform: "lowercase",
                          border: "var(--line-ghost) solid var(--color-ink-ghost)",
                          padding: "var(--space-2xs) var(--space-xs)",
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>

        {hasMore && (
          <div style={{ paddingTop: "var(--space-xs)" }}>
            <Link
              href="/lab/insights"
              className="label text-ink-ghost hover:text-ink-secondary"
              style={{
                textDecoration: "none",
                whiteSpace: "nowrap",
              }}
              aria-label={t("see_all_insights", { count: totalInsights })}
            >
              {t("see_all_insights", { count: totalInsights })}
            </Link>
          </div>
        )}
      </div>
    </aside>
  );
}
