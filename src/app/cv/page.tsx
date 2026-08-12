/**
 * /cv — Career timeline
 *
 * Rendering: dynamic (next-intl uses headers() internally, which opts the page
 * out of static generation). Caching is handled by Vercel's CDN on the edge.
 * Content changes trigger a manual redeploy.
 */

import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getAllPositions } from "@/lib/content";
import type { Position, PositionType } from "@/types/content";
import { TimelineEntry, type TimelineEntryLabels } from "./TimelineEntry";
import { EraMarker } from "./EraMarker";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { SectionHeader } from "@/components/layout/SectionHeader";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("CVPage");
  return {
    title: t("heading"),
    description: t("description"),
  };
}

const ENGINEERING_TYPES = new Set<PositionType>([
  "employment",
  "contract",
  "freelance",
]);

export default async function CVPage() {
  const [t, navT] = await Promise.all([
    getTranslations("CVPage"),
    getTranslations("Navigation"),
  ]);
  const positions = getAllPositions();

  const engineering = positions.filter((p) => ENGINEERING_TYPES.has(p.type));
  const research = positions.filter((p) => !ENGINEERING_TYPES.has(p.type));

  const typeLabelMap: Record<PositionType, string> = {
    employment: t("position_type_employment"),
    contract:   t("position_type_contract"),
    freelance:  t("position_type_freelance"),
    voluntary:  t("position_type_voluntary"),
    academic:   t("position_type_academic"),
    phd:        t("position_type_phd"),
  };

  const entryLabels: TimelineEntryLabels = {
    ongoing: t("ongoing"),
    typeLabel: (type) => typeLabelMap[type],
  };

  function renderEntries(group: Position[]) {
    return group.map((pos) => (
      <TimelineEntry key={pos.slug} position={pos} labels={entryLabels} />
    ));
  }

  return (
    <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
      <Breadcrumb
        items={[
          { label: navT("home"), href: "/" },
          { label: navT("cv") },
        ]}
        navLabel={navT("breadcrumb_nav_label")}
      />
      <div className="mt-6">
        <SectionHeader heading={t("heading")} />
      </div>
      <p className="mt-2 text-sm text-foreground-secondary">
        {t("positions_count", { count: positions.length })}
      </p>

      <ol aria-label={t("timeline_label")} className="mt-10">
        {/* Engineering era */}
        <EraMarker
          label={t("engineering_era_label")}
          period={t("engineering_era_period")}
        />
        {renderEntries(engineering)}

        {/* Research era */}
        <EraMarker
          label={t("research_era_label")}
          period={t("research_era_period")}
        />
        {renderEntries(research)}
      </ol>
    </div>
  );
}
