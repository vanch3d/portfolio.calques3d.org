"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import type { AdrMeta, AdrStatus } from "@/lib/content/adr";
import { LabTag } from "@/components/ui/LabTag";
import {
  RegisterTable,
  RegisterTableHead,
  RegisterTableBody,
  RegisterTableRow,
} from "@/app/lab/_components/RegisterTable";

type AdrRegisterTableProps = {
  adrs: AdrMeta[];
  activeTag: string | null;
  searchQuery: string;
  mostRecentAcceptedNumber: number | null;
};

function statusLabel(status: AdrStatus, t: ReturnType<typeof useTranslations>): string {
  const map: Record<AdrStatus, string> = {
    accepted: t("status_accepted"),
    proposed: t("status_proposed"),
    deprecated: t("status_deprecated"),
    superseded: t("status_superseded"),
  };
  return map[status];
}

function rowIsGhosted(adr: AdrMeta, activeTag: string | null, searchQuery: string): boolean {
  if (!activeTag && !searchQuery) return false;
  const matchesTag = activeTag ? adr.tags.includes(activeTag) : true;
  const matchesSearch = searchQuery
    ? adr.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      adr.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    : true;
  return !(matchesTag && matchesSearch);
}

const COLUMNS = [
  { key: "no", label: "NO.", align: "right" as const },
  { key: "title", label: "TITLE" },
  { key: "status", label: "STATUS" },
  { key: "date", label: "DATE" },
  { key: "tags", label: "TAGS" },
];

const COLUMN_WIDTHS = ["56px", "auto", "96px", "108px", "200px"];

export function AdrRegisterTable({
  adrs,
  activeTag,
  searchQuery,
  mostRecentAcceptedNumber,
}: AdrRegisterTableProps) {
  const t = useTranslations("LabAdr");

  return (
    <RegisterTable
      ariaLabel={t("register_subtitle")}
      columnWidths={COLUMN_WIDTHS}
    >
      <RegisterTableHead columns={COLUMNS} />
      <RegisterTableBody>
        {adrs.map((adr) => {
          const isActive = adr.number === mostRecentAcceptedNumber;
          const isGhosted = rowIsGhosted(adr, activeTag, searchQuery);

          return (
            <RegisterTableRow
              key={adr.slug}
              isActive={isActive}
              data-testid={`adr-row-${adr.number}`}
              aria-label={
                isActive
                  ? `ADR ${adr.number} — ${adr.title} (${t("most_recent_label")})`
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
                  opacity: isGhosted ? 0.3 : 1,
                  transition: "opacity 0.2s",
                }}
              >
                {String(adr.number).padStart(3, "0")}
                {isActive && (
                  <span className="sr-only">, {t("most_recent_label")}</span>
                )}
              </td>
              <td
                className="font-body text-ink"
                style={{
                  fontSize: "var(--text-body)",
                  lineHeight: "var(--leading-label)",
                  padding: "var(--space-sm) var(--space-sm) var(--space-sm) 0",
                  verticalAlign: "middle",
                  opacity: isGhosted ? 0.3 : 1,
                  transition: "opacity 0.2s",
                }}
              >
                <Link
                  href={`/lab/adr/${adr.slug}`}
                  className="text-ink underline decoration-transparent hover:decoration-ink"
                  style={{
                    textUnderlineOffset: "3px",
                    transition: "text-decoration-color 0.15s",
                  }}
                >
                  {adr.title}
                </Link>
              </td>
              <td
                className="label"
                style={{
                  padding: "var(--space-sm) var(--space-sm) var(--space-sm) var(--space-sm)",
                  verticalAlign: "middle",
                  opacity: isGhosted ? 0.3 : 1,
                  transition: "opacity 0.2s",
                }}
              >
                {statusLabel(adr.status, t)}
              </td>
              <td
                className="label tabular"
                style={{
                  padding: "var(--space-sm) var(--space-sm) var(--space-sm) var(--space-sm)",
                  whiteSpace: "nowrap",
                  verticalAlign: "middle",
                  opacity: isGhosted ? 0.3 : 1,
                  transition: "opacity 0.2s",
                }}
              >
                {adr.date}
              </td>
              <td
                style={{
                  padding: "var(--space-sm) var(--space-sm) var(--space-sm) var(--space-sm)",
                  verticalAlign: "middle",
                  overflow: "hidden",
                  opacity: isGhosted ? 0.3 : 1,
                  transition: "opacity 0.2s",
                }}
              >
                <div style={{ display: "flex", gap: "var(--space-xs)", flexWrap: "wrap" }}>
                  {adr.tags.map((tag) => (
                    <LabTag key={tag}>{tag}</LabTag>
                  ))}
                </div>
              </td>
            </RegisterTableRow>
          );
        })}
      </RegisterTableBody>
    </RegisterTable>
  );
}
