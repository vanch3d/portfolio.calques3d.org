import { getTranslations } from "next-intl/server";
import { getAllInsights, getMostRecentInsightNumber } from "@/lib/content/insights";
import { adrSlugFromNumber } from "@/lib/content/adr";
import { LabBreadcrumb } from "@/app/lab/_components/LabBreadcrumb";
import { LabRegisterHeader } from "@/app/lab/_components/LabRegisterHeader";
import { InsightsRegisterTable } from "./_components/InsightsRegisterTable";
import type { InsightRow } from "./_components/InsightsRegisterTable";

export const dynamic = "force-static";

export default async function InsightsIndexPage() {
  const t = await getTranslations("LabInsights");
  const tNav = await getTranslations("LabNav");

  const [insights, mostRecentNumber] = await Promise.all([
    getAllInsights(),
    getMostRecentInsightNumber(),
  ]);

  const rows: InsightRow[] = insights.map((insight) => ({
    ...insight,
    relatedAdrSlug:
      insight.relatedAdr != null ? adrSlugFromNumber(insight.relatedAdr) : null,
  }));

  const today = new Date().toISOString().slice(0, 10);

  return (
    <div
      style={{
        maxWidth: "1080px",
        margin: "0 auto",
        padding: "var(--space-xl) var(--page-margin) var(--space-3xl)",
      }}
    >
      <LabBreadcrumb current={tNav("nav_insights")} />

      <LabRegisterHeader
        leftLabel={t("index_title")}
        title={t("register_subtitle")}
        metadata={[
          t("records_count", { count: insights.length }),
          t("as_of", { date: today }),
        ]}
      />

      <main data-testid="insights-index-main">
        <InsightsRegisterTable rows={rows} mostRecentNumber={mostRecentNumber} />

        <footer
          style={{
            marginTop: "var(--space-xl)",
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          aria-label={t("load_more_aria")}
        >
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: "50%",
              height: "var(--line-ghost)",
              background: "var(--color-ink-ghost)",
              transform: "translateY(-50%)",
            }}
          />
          <div aria-hidden="true" style={{ position: "absolute", left: 0, display: "flex", gap: "var(--space-2xs)" }}>
            <div style={{ width: "var(--line-medium)", height: "var(--space-sm)", background: "var(--color-ink-ghost)" }} />
            <div style={{ width: "var(--line-medium)", height: "var(--space-sm)", background: "var(--color-ink-ghost)" }} />
          </div>
          <span
            className="label text-ink-ghost"
            style={{
              background: "var(--color-ground)",
              padding: "0 var(--space-md)",
              position: "relative",
              zIndex: 1,
              whiteSpace: "nowrap",
            }}
          >
            {t("records_count", { count: insights.length })}
          </span>
          <div aria-hidden="true" style={{ position: "absolute", right: 0, display: "flex", gap: "var(--space-2xs)" }}>
            <div style={{ width: "var(--line-medium)", height: "var(--space-sm)", background: "var(--color-ink-ghost)" }} />
            <div style={{ width: "var(--line-medium)", height: "var(--space-sm)", background: "var(--color-ink-ghost)" }} />
          </div>
        </footer>
      </main>
    </div>
  );
}
