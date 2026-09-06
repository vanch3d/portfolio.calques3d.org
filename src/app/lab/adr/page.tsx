import { getTranslations } from "next-intl/server";
import { NavLink } from "@/components/ui/NavLink";
import { getAllAdrs, getAllAdrTags, getMostRecentAcceptedAdrNumber } from "@/lib/content/adr";
import { getAllInsights } from "@/lib/content/insights";
import { AdrRegisterHeader } from "./_components/AdrRegisterHeader";
import { InsightCalloutStrip } from "./_components/InsightCalloutStrip";
import { AdrIndexClient } from "./_components/AdrIndexClient";

export const metadata = {
  title: "ADR",
};

// SSG — content is static markdown files, no runtime data fetching required.
export const dynamic = "force-static";

export default async function AdrIndexPage() {
  const t = await getTranslations("LabAdr");

  const [adrs, insights, tags, mostRecentAcceptedNumber] = await Promise.all([
    getAllAdrs(),
    getAllInsights(),
    getAllAdrTags(),
    getMostRecentAcceptedAdrNumber(),
  ]);

  const mostRecentInsight = insights[0] ?? null;
  const minNumber = adrs.length > 0 ? Math.min(...adrs.map((a) => a.number)) : 1;
  const maxNumber = adrs.length > 0 ? Math.max(...adrs.map((a) => a.number)) : 1;
  const asOf = adrs.length > 0 ? adrs[0].date : new Date().toISOString().slice(0, 10);

  return (
    <main className="min-h-screen bg-ground text-ink">
      <div className="page-wrap py-xl">

        {/* ── Breadcrumb nav ─────────────────────────────────── */}
        <header>
          <nav
            aria-label={t("breadcrumb_aria")}
            className="flex items-baseline gap-lg pb-lg border-b-ghost border-ink-ghost mb-lg"
          >
            <NavLink href="/">{t("breadcrumb_home")}</NavLink>
            <span className="label text-ink-ghost" aria-hidden="true">/</span>
            <NavLink href="/lab">{t("breadcrumb_lab")}</NavLink>
            <span className="label text-ink-ghost" aria-hidden="true">/</span>
            <span className="label active-mark" aria-current="page">
              {t("breadcrumb_adr")}
            </span>
          </nav>
        </header>

        {/* ── Register header (3-col title block + dimension line) */}
        <AdrRegisterHeader
          adrCount={adrs.length}
          insightCount={insights.length}
          asOf={asOf}
          minNumber={minNumber}
          maxNumber={maxNumber}
        />

        {/* ── Most recent insight callout ────────────────────── */}
        {mostRecentInsight && (
          <InsightCalloutStrip insight={mostRecentInsight} />
        )}

        {/* ── Interactive register (filter + table + load more) */}
        <AdrIndexClient
          adrs={adrs}
          tags={tags}
          mostRecentAcceptedNumber={mostRecentAcceptedNumber}
        />

      </div>
    </main>
  );
}
