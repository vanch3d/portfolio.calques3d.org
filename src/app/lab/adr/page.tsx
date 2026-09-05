import { getTranslations } from "next-intl/server";
import { getAllAdrs, getAllAdrTags, getMostRecentAcceptedAdrNumber } from "@/lib/content/adr";
import { getAllInsights } from "@/lib/content/insights";
import { LabBreadcrumb } from "@/app/lab/_components/LabBreadcrumb";
import { LabRegisterHeader } from "@/app/lab/_components/LabRegisterHeader";
import { InsightCalloutStrip } from "./_components/InsightCalloutStrip";
import { AdrIndexClient } from "./_components/AdrIndexClient";

export const dynamic = "force-static";

export default async function AdrIndexPage() {
  const t = await getTranslations("LabAdr");
  const tNav = await getTranslations("LabNav");

  const [adrs, tags, insights, mostRecentAcceptedNumber] = await Promise.all([
    getAllAdrs(),
    getAllAdrTags(),
    getAllInsights(),
    getMostRecentAcceptedAdrNumber(),
  ]);

  const today = new Date().toISOString().slice(0, 10);

  return (
    <div
      style={{
        maxWidth: "1080px",
        margin: "0 auto",
        padding: "var(--space-xl) var(--page-margin) var(--space-3xl)",
      }}
    >
      <LabBreadcrumb current={tNav("nav_adr")} />

      <LabRegisterHeader
        leftLabel={t("index_title")}
        title={t("register_subtitle")}
        metadata={[
          t("records_count", { count: adrs.length }),
          t("insights_count", { count: insights.length }),
          t("as_of", { date: today }),
        ]}
      />

      {insights.length > 0 && (
        <InsightCalloutStrip
          insights={insights}
          totalInsights={insights.length}
        />
      )}

      <AdrIndexClient
        adrs={adrs}
        tags={tags}
        mostRecentAcceptedNumber={mostRecentAcceptedNumber}
      />
    </div>
  );
}
