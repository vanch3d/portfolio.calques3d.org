import { getTranslations } from "next-intl/server";

type AdrRegisterHeaderProps = {
  adrCount: number;
  insightCount: number;
  asOf: string;
  minNumber: number;
  maxNumber: number;
};

/**
 * AdrRegisterHeader — the blueprint-style title block for the ADR register.
 *
 * Three-column layout flanked by heavy borders (the "ruled sheet" frame):
 *   Left:   "ARCHITECTURE / DECISION RECORDS" in label type
 *   Centre: h1 in display italic
 *   Right:  RECORDS: N / INSIGHTS: N / AS OF: DATE in label type (right-aligned)
 *
 * Below: a dimension line (ghost rule) with tick marks at the first and last
 * ADR numbers — a technical-drawing annotation of the register's span.
 */
export async function AdrRegisterHeader({
  adrCount,
  insightCount,
  asOf,
  minNumber,
  maxNumber,
}: AdrRegisterHeaderProps) {
  const t = await getTranslations("LabAdr");

  const minLabel = String(minNumber).padStart(3, "0");
  const maxLabel = String(maxNumber).padStart(3, "0");

  return (
    <>
      {/* ── 3-column title block ──────────────────────────────── */}
      <div
        className="grid grid-cols-centred-header items-center gap-lg py-md border-t-heavy border-b-heavy border-ink"
      >
        {/* Left: document type label */}
        <div className="label leading-body">
          Architecture<br />
          Decision Records
        </div>

        {/* Centre: register title */}
        <h1 className="font-display italic text-title leading-title text-ink whitespace-nowrap text-center">
          {t("register_subtitle")}
        </h1>

        {/* Right: counters */}
        <div className="label text-right leading-body">
          <span className="block">{t("records_count", { count: adrCount })}</span>
          <span className="block">{t("insights_count", { count: insightCount })}</span>
          <span className="block">{t("as_of", { date: asOf })}</span>
        </div>
      </div>

      {/* ── Dimension line ────────────────────────────────────── */}
      <div
        className="relative flex items-center my-md h-lg"
        aria-hidden="true"
      >
        {/* Ghost rule */}
        <div className="absolute inset-x-0 top-1/2 border-t-ghost border-ink-ghost" />

        {/* Tick — start */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 flex flex-col items-center">
          <div className="border-l-medium border-ink-ghost h-sm" />
          <span className="label text-ink-ghost mt-xs">
            {minLabel}
          </span>
        </div>

        {/* Tick — end */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 flex flex-col items-center">
          <div className="border-l-medium border-ink-ghost h-sm" />
          <span className="label text-ink-ghost mt-xs">
            {maxLabel}
          </span>
        </div>
      </div>
    </>
  );
}
