"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import type { AdrMeta, AdrStatus } from "@/lib/content/adr";

type AdrRegisterTableProps = {
  adrs: AdrMeta[];
  mostRecentAcceptedNumber: number | null;
};

/**
 * AdrRegisterTable — the revision register as a ruled technical table.
 *
 * Client Component — receives filtered adrs from AdrIndexClient.
 *
 * Columns (fixed widths from comp tokens):
 *   NO.    w-col-register-no     right-aligned, tabular figures
 *   TITLE  auto                  body font, ink colour
 *   STATUS w-col-register-status label uppercase
 *   DATE   w-col-register-date   label tabular figures
 *   TAGS   w-col-register-tags   label ghost colour, truncated
 *
 * The most recent accepted ADR row is marked with a red left border
 * and its number rendered in active (compass-arc red). Alternating
 * rows use bg-ground-alt.
 */
export function AdrRegisterTable({
  adrs,
  mostRecentAcceptedNumber,
}: AdrRegisterTableProps) {
  const t = useTranslations("LabAdr");

  // Type-safe status label map — avoids dynamic key lookup
  const STATUS_LABELS: Record<AdrStatus, string> = {
    accepted:   t("status_accepted"),
    proposed:   t("status_proposed"),
    deprecated: t("status_deprecated"),
    superseded: t("status_superseded"),
  };

  if (adrs.length === 0) {
    return (
      <p className="label text-ink-secondary py-lg text-center">
        {t("no_results")}
      </p>
    );
  }

  return (
    <table
      className="w-full border-collapse table-fixed"
      aria-label={t("register_aria")}
    >
      <colgroup>
        <col className="w-col-register-no" />
        <col />
        <col className="w-col-register-status" />
        <col className="w-col-register-date" />
        <col className="w-col-register-tags" />
      </colgroup>

      <thead>
        <tr className="border-b-heavy border-ink">
          <th scope="col" className="label text-ink-secondary font-normal pb-sm text-right pr-md">
            {t("col_number")}
          </th>
          <th scope="col" className="label text-ink-secondary font-normal pb-sm text-left">
            {t("col_title")}
          </th>
          <th scope="col" className="label text-ink-secondary font-normal pb-sm text-left pl-md">
            {t("col_status")}
          </th>
          <th scope="col" className="label text-ink-secondary font-normal pb-sm text-left pl-md">
            {t("col_date")}
          </th>
          <th scope="col" className="label text-ink-secondary font-normal pb-sm text-left pl-md">
            {t("col_tags")}
          </th>
        </tr>
      </thead>

      <tbody>
        {adrs.map((adr, i) => {
          const isActive = adr.number === mostRecentAcceptedNumber;
          const isEven = i % 2 === 1;
          const numLabel = String(adr.number).padStart(3, "0");

          return (
            <tr
              key={adr.slug}
              className={cn(
                "border-b-ghost border-ink-ghost",
                isEven ? "bg-ground-alt" : "bg-ground",
                isActive && "border-l-heavy border-active"
              )}
            >
              {/* NO. */}
              <td
                className={cn(
                  "label text-ink-secondary text-right pr-md py-sm align-middle",
                  isActive && "text-active"
                )}
              >
                {numLabel}
                {isActive && (
                  <span className="sr-only"> — {t("most_recent_label")}</span>
                )}
              </td>

              {/* TITLE */}
              <td className="font-body text-caption text-ink py-sm align-middle leading-title">
                {adr.title}
              </td>

              {/* STATUS */}
              <td className="label text-ink-secondary py-sm pl-md align-middle">
                {STATUS_LABELS[adr.status]}
              </td>

              {/* DATE */}
              <td className="label text-ink-secondary py-sm pl-md align-middle whitespace-nowrap">
                {adr.date}
              </td>

              {/* TAGS */}
              <td className="label text-ink-secondary py-sm pl-md align-middle truncate">
                {adr.tags.join(", ")}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
