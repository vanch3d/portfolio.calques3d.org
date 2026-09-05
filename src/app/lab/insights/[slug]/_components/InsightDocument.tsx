import Link from "next/link";
import { getTranslations } from "next-intl/server";
import type { Insight, InsightMeta } from "@/lib/content/insights";
import { adrSlugFromNumber } from "@/lib/content/adr";

type InsightDocumentProps = {
  insight: Insight;
  prevInsight: InsightMeta | null;
  nextInsight: InsightMeta | null;
};

export async function InsightDocument({
  insight,
  prevInsight,
  nextInsight,
}: InsightDocumentProps) {
  const t = await getTranslations("LabInsights");

  const relatedAdrSlug =
    insight.relatedAdr != null
      ? adrSlugFromNumber(insight.relatedAdr)
      : null;

  return (
    <article data-testid="insight-document">
      <header style={{ marginBottom: "var(--space-lg)" }}>
        <div
          className="rule-heavy-x"
          style={{
            padding: "var(--space-md) 0",
            display: "grid",
            gridTemplateColumns: "auto 1fr",
            gap: "var(--space-lg)",
            alignItems: "start",
            marginBottom: "var(--space-md)",
          }}
        >
          <div
            className="font-label tabular text-ink-secondary"
            style={{
              fontSize: "var(--text-headline)",
              letterSpacing: "var(--tracking-label)",
              lineHeight: "var(--leading-display)",
            }}
          >
            {String(insight.number).padStart(3, "0")}
          </div>
          <h1
            className="title-italic text-ink"
            style={{
              fontSize: "var(--text-headline)",
              lineHeight: "var(--leading-headline)",
              margin: 0,
            }}
          >
            {insight.title}
          </h1>
        </div>

        <dl
          aria-label={t("detail_frontmatter_aria")}
          style={{
            display: "flex",
            gap: "var(--space-lg)",
            flexWrap: "wrap",
          }}
        >
          <div>
            <dt className="label" style={{ marginBottom: "var(--space-2xs)" }}>
              {t("detail_date_label")}
            </dt>
            <dd className="label tabular text-ink" style={{ margin: 0 }}>
              {insight.date}
            </dd>
          </div>

          <div>
            <dt className="label" style={{ marginBottom: "var(--space-2xs)" }}>
              {t("discovered_during_label")}
            </dt>
            <dd className="label text-ink" style={{ margin: 0 }}>
              {insight.discoveredDuring}
            </dd>
          </div>

          {relatedAdrSlug != null && insight.relatedAdr != null && (
            <div>
              <dt className="label" style={{ marginBottom: "var(--space-2xs)" }}>
                {t("related_adr_label")}
              </dt>
              <dd style={{ margin: 0 }}>
                <Link
                  href={`/lab/adr/${relatedAdrSlug}`}
                  className="label hover:text-ink"
                  style={{
                    border: "var(--line-ghost) solid var(--color-ink-ghost)",
                    padding: "var(--space-2xs) var(--space-xs)",
                    textDecoration: "none",
                  }}
                >
                  {t("related_adr_link", { number: insight.relatedAdr })}
                </Link>
              </dd>
            </div>
          )}

          {insight.tags.length > 0 && (
            <div>
              <dt className="label" style={{ marginBottom: "var(--space-2xs)" }}>
                {t("detail_tags_label")}
              </dt>
              <dd
                style={{
                  display: "flex",
                  gap: "var(--space-xs)",
                  flexWrap: "wrap",
                  margin: 0,
                }}
              >
                {insight.tags.map((tag) => (
                  <span
                    key={tag}
                    className="label text-ink-secondary"
                    style={{
                      border: "var(--line-ghost) solid var(--color-ink-ghost)",
                      padding: "var(--space-2xs) var(--space-xs)",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </dd>
            </div>
          )}
        </dl>
      </header>

      <div
        data-testid="insight-body"
        className="register-body"
        dangerouslySetInnerHTML={{ __html: insight.body }}
      />

      {relatedAdrSlug != null && insight.relatedAdr != null && (
        <div
          style={{
            marginTop: "var(--space-lg)",
            paddingTop: "var(--space-md)",
            borderTop: "var(--line-ghost) solid var(--color-ink-ghost)",
          }}
        >
          <Link
            href={`/lab/adr/${relatedAdrSlug}`}
            className="label text-ink-ghost hover:text-ink-secondary"
            style={{ textDecoration: "none" }}
          >
            {t("back_to_adr", { number: insight.relatedAdr })}
          </Link>
        </div>
      )}

      <nav
        aria-label={t("detail_nav_label")}
        style={{
          marginTop: "var(--space-xl)",
          paddingTop: "var(--space-lg)",
          borderTop: "var(--line-ghost) solid var(--color-ink-ghost)",
          display: "flex",
          justifyContent: "space-between",
          gap: "var(--space-md)",
        }}
      >
        {prevInsight ? (
          <Link
            href={`/lab/insights/${prevInsight.slug}`}
            className="label text-ink-ghost hover:text-ink-secondary"
            style={{ textDecoration: "none" }}
          >
            {t("prev_insight", { number: String(prevInsight.number).padStart(3, "0") })}
          </Link>
        ) : (
          <span />
        )}
        {nextInsight ? (
          <Link
            href={`/lab/insights/${nextInsight.slug}`}
            className="label text-ink-ghost hover:text-ink-secondary"
            style={{ textDecoration: "none" }}
          >
            {t("next_insight", { number: String(nextInsight.number).padStart(3, "0") })}
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </article>
  );
}
