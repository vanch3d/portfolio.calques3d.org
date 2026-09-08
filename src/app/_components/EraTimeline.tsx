/**
 * EraTimeline — 50/50 grid wrapper for the two era columns.
 *
 * Server component. Resolves all i18n strings and position data, then
 * passes typed props down to EraColumn. Mobile: single column, engineering
 * first (order-1), research second (order-2) — handled by EraColumn className.
 *
 * Position data is hardcoded for now (deferred D-03).
 */

import type { Route } from "next";
import { getTranslations } from "next-intl/server";
import { EraColumn, type EraEntry } from "./EraColumn";

const RESEARCH_POSITIONS: EraEntry[] = [
  { year: "2013", institution: "Senior Research Fellow, University of Leeds" },
  { year: "2010", institution: "Research Fellow, The Open University" },
  { year: "2005", institution: "Research Fellow, University of Edinburgh / Northumbria" },
  { year: "2000", institution: "Research Fellow, University of Nottingham" },
  { year: "1995", institution: "PhD, Université de Nancy I" },
];

const ENGINEERING_POSITIONS: EraEntry[] = [
  { year: "2022", institution: "Senior Frontend Engineer, HiveMQ (remote)" },
  { year: "2021", institution: "Senior Frontend Engineer, Matillion" },
  { year: "2020", institution: "UX Engineer, Almotech Galway" },
  { year: "2018", institution: "Frontend Engineer, HubSpot Dublin" },
];

export async function EraTimeline() {
  const t = await getTranslations("HomePage");

  return (
    <div className="grid grid-cols-2 gap-0 max-md:grid-cols-1">
      <EraColumn
        era="research"
        badge={t("era_research_label")}
        name={t("era_research_name")}
        summary={t("era_research_summary")}
        positions={RESEARCH_POSITIONS}
        positionsAriaLabel={t("era_research_positions_aria")}
        links={[
          { href: "/research" as Route, label: t("era_research_link_explore") },
          { href: "/research/publications" as Route, label: t("era_research_link_publications") },
        ]}
      />
      <EraColumn
        era="engineering"
        badge={t("era_engineering_label")}
        name={t("era_engineering_name")}
        summary={t("era_engineering_summary")}
        positions={ENGINEERING_POSITIONS}
        positionsAriaLabel={t("era_engineering_positions_aria")}
        links={[
          { href: "/engineering" as Route, label: t("era_engineering_link_explore") },
        ]}
      />
    </div>
  );
}
