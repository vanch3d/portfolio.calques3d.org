import Link from "next/link";
import { getTranslations } from "next-intl/server";
import type { Adr, AdrMeta } from "@/lib/content/adr";
import type { InsightMeta } from "@/lib/content/insights";
import { InsightCalloutBlock, extractBodyExcerpt } from "./InsightCalloutBlock";

// Breadcrumb is rendered by the page shell via LabBreadcrumb — not here.

type AdrDocumentProps = {
  adr: Adr;
  relatedInsight: InsightMeta | null;
  relatedInsightBody: string | null;
  prevAdr: AdrMeta | null;
  nextAdr: AdrMeta | null;
};

export async function AdrDocument({
  adr,
  relatedInsight,
  relatedInsightBody,
  prevAdr,
  nextAdr,
}: AdrDocumentProps) {
  const t = await getTranslations("LabAdr");

  const statusLabel: Record<string, string> = {
    accepted: t("status_accepted"),
    proposed: t("status_proposed"),
    deprecated: t("status_deprecated"),
    superseded: t("status_superseded"),
  };

  const excerpt =
    relatedInsight && relatedInsightBody
      ? extractBodyExcerpt(relatedInsightBody)
      : "";

  return (
    <article data-testid="adr-document">
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
            {String(adr.number).padStart(3, "0")}
          </div>
          <h1
            className="title-italic text-ink"
            style={{
              fontSize: "var(--text-headline)",
              lineHeight: "var(--leading-headline)",
              margin: 0,
            }}
          >
            {adr.title}
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
              {t("detail_status_label")}
            </dt>
            <dd className="label text-ink" style={{ margin: 0 }}>
              {statusLabel[adr.status] ?? adr.status.toUpperCase()}
            </dd>
          </div>
          <div>
            <dt className="label" style={{ marginBottom: "var(--space-2xs)" }}>
              {t("detail_date_label")}
            </dt>
            <dd className="label tabular text-ink" style={{ margin: 0 }}>
              {adr.date}
            </dd>
          </div>
          {adr.tags.length > 0 && (
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
                {adr.tags.map((tag) => (
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

      {relatedInsight && (
        <InsightCalloutBlock
          insight={relatedInsight}
          bodyExcerpt={excerpt}
        />
      )}

      <div
        data-testid="adr-body"
        className="register-body"
        dangerouslySetInnerHTML={{ __html: adr.body }}
      />

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
        {prevAdr ? (
          <Link
            href={`/lab/adr/${prevAdr.slug}`}
            className="label text-ink-ghost hover:text-ink-secondary"
            style={{ textDecoration: "none" }}
          >
            {t("prev_adr", { number: String(prevAdr.number).padStart(3, "0") })}
          </Link>
        ) : (
          <span />
        )}
        {nextAdr ? (
          <Link
            href={`/lab/adr/${nextAdr.slug}`}
            className="label text-ink-ghost hover:text-ink-secondary"
            style={{ textDecoration: "none" }}
          >
            {t("next_adr", { number: String(nextAdr.number).padStart(3, "0") })}
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </article>
  );
}
