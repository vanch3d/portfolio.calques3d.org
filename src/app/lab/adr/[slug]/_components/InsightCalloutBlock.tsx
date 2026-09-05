import Link from "next/link";
import { getTranslations } from "next-intl/server";
import type { InsightMeta } from "@/lib/content/insights";

type InsightCalloutBlockProps = {
  insight: InsightMeta;
  bodyExcerpt: string;
};

export async function InsightCalloutBlock({
  insight,
  bodyExcerpt,
}: InsightCalloutBlockProps) {
  const t = await getTranslations("LabAdr");

  return (
    <aside
      data-testid="insight-callout-block"
      aria-label={t("discovered_in_practice")}
      style={{
        background: "var(--color-ground-raised)",
        border: "var(--line-medium) solid var(--color-ink-secondary)",
        padding: "var(--space-md)",
        margin: "var(--space-lg) 0",
      }}
    >
      <span
        className="label"
        style={{
          display: "block",
          marginBottom: "var(--space-xs)",
        }}
      >
        {t("discovered_in_practice")}
      </span>

      <p
        className="title-italic text-ink"
        style={{
          fontSize: "var(--text-title)",
          lineHeight: "var(--leading-headline)",
          margin: "0 0 var(--space-sm)",
        }}
      >
        {String(insight.number).padStart(3, "0")} — {insight.title}
      </p>

      {bodyExcerpt && (
        <p
          className="font-body text-ink-secondary"
          style={{
            fontSize: "var(--text-body)",
            lineHeight: "var(--leading-body)",
            margin: "0 0 var(--space-sm)",
          }}
        >
          {bodyExcerpt}
        </p>
      )}

      <Link
        href={`/lab/insights/${insight.slug}`}
        className="label hover:text-ink"
        style={{
          textDecoration: "none",
        }}
      >
        {t("read_insight")}
      </Link>
    </aside>
  );
}

/**
 * Extracts a short excerpt (first ~2 sentences) from a markdown body string.
 * Strips markdown syntax before extracting.
 */
export function extractBodyExcerpt(body: string, maxLength = 200): string {
  const stripped = body
    .replace(/^#+\s.*/gm, "")
    .replace(/\*\*/g, "")
    .replace(/\*/g, "")
    .replace(/`[^`]+`/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .trim();

  const sentences = stripped.match(/[^.!?]+[.!?]+/g) ?? [];
  const excerpt = sentences.slice(0, 2).join(" ").trim();

  if (!excerpt) return stripped.slice(0, maxLength);
  if (excerpt.length > maxLength) return excerpt.slice(0, maxLength) + "…";
  return excerpt;
}
