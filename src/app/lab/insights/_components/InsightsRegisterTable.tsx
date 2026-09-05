import Link from "next/link";
import { getTranslations } from "next-intl/server";
import type { InsightMeta } from "@/lib/content/insights";
import {
  RegisterTable,
  RegisterTableHead,
  RegisterTableBody,
  RegisterTableRow,
} from "@/app/lab/_components/RegisterTable";

export type InsightRow = InsightMeta & {
  relatedAdrSlug: string | null;
};

type InsightsRegisterTableProps = {
  rows: InsightRow[];
  mostRecentNumber: number | null;
};

const COLUMN_WIDTHS = ["56px", "auto", "200px", "108px"];

export async function InsightsRegisterTable({
  rows,
  mostRecentNumber,
}: InsightsRegisterTableProps) {
  const t = await getTranslations("LabInsights");

  const columns = [
    { key: "no", label: t("col_number"), align: "right" as const },
    { key: "title", label: t("col_title") },
    { key: "discovered", label: t("col_discovered_during") },
    { key: "related", label: t("col_related_adr") },
  ];

  return (
    <RegisterTable
      ariaLabel={t("register_subtitle")}
      columnWidths={COLUMN_WIDTHS}
    >
      <RegisterTableHead columns={columns} />
      <RegisterTableBody>
        {rows.map((row) => {
          const isActive = row.number === mostRecentNumber;

          return (
            <RegisterTableRow
              key={row.slug}
              isActive={isActive}
              data-testid={`insight-row-${row.number}`}
              aria-label={
                isActive
                  ? `Insight ${row.number} — ${row.title} (${t("most_recent_label")})`
                  : undefined
              }
            >
              <td
                className="label tabular"
                style={{
                  textAlign: "right",
                  padding: "var(--space-sm) var(--space-md) var(--space-sm) 0",
                  color: isActive ? "var(--color-active)" : "var(--color-ink-secondary)",
                  verticalAlign: "middle",
                }}
              >
                {String(row.number).padStart(3, "0")}
                {isActive && (
                  <span className="sr-only">, {t("most_recent_label")}</span>
                )}
              </td>
              <td
                className="title-italic text-ink"
                style={{
                  fontSize: "var(--text-body)",
                  lineHeight: "var(--leading-label)",
                  padding: "var(--space-sm) var(--space-sm) var(--space-sm) 0",
                  verticalAlign: "middle",
                }}
              >
                <Link
                  href={`/lab/insights/${row.slug}`}
                  className="text-ink underline decoration-transparent hover:decoration-ink"
                  style={{
                    textUnderlineOffset: "3px",
                    transition: "text-decoration-color 0.15s",
                  }}
                >
                  {row.title}
                </Link>
              </td>
              <td
                className="label"
                style={{
                  padding: "var(--space-sm)",
                  verticalAlign: "middle",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {row.discoveredDuring}
              </td>
              <td
                style={{
                  padding: "var(--space-sm)",
                  verticalAlign: "middle",
                }}
              >
                {row.relatedAdr != null && row.relatedAdrSlug != null ? (
                  <Link
                    href={`/lab/adr/${row.relatedAdrSlug}`}
                    className="label underline decoration-transparent hover:text-ink hover:decoration-ink"
                    style={{
                      border: "var(--line-ghost) solid var(--color-ink-ghost)",
                      padding: "var(--space-2xs) var(--space-xs)",
                      textUnderlineOffset: "3px",
                      whiteSpace: "nowrap",
                      transition: "color 0.15s, text-decoration-color 0.15s",
                    }}
                  >
                    {t("related_adr_link", { number: row.relatedAdr })}
                  </Link>
                ) : null}
              </td>
            </RegisterTableRow>
          );
        })}
      </RegisterTableBody>
    </RegisterTable>
  );
}
