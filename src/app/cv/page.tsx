/**
 * /cv — Career timeline
 *
 * Rendering: dynamic (next-intl uses headers() internally, which opts the page
 * out of static generation — `revalidate = false` would conflict and cause a
 * 404 in production). Caching is handled by Vercel's CDN on the edge.
 * Content changes trigger a manual redeploy.
 */

import { getTranslations } from "next-intl/server";
import { getAllPositions, getSkills, getEducation } from "@/lib/content";
import { PageHeader, SectionHeader } from "@/components/layout";
import { TimelineEntry, SkillGroup, EducationEntry } from "@/components/ui";
import type { TimelineEntryLabels } from "@/components/ui";
import type { PositionType } from "@/types/content";

export const metadata = {
  title: "CV",
};

export default async function CVPage() {
  const t = await getTranslations("CVPage");
  const positions = getAllPositions();
  const skills = getSkills();
  const education = getEducation();

  const researchPositions = positions.filter(
    (p) => p.type === "phd" || p.type === "academic"
  );
  const engineeringPositions = positions.filter(
    (p) => p.type === "employment" || p.type === "contract" || p.type === "freelance"
  );

  const TYPE_LABEL: Record<PositionType, string> = {
    phd: t("type_phd"),
    academic: t("type_academic"),
    contract: t("type_contract"),
    employment: t("type_employment"),
    freelance: t("type_freelance"),
    voluntary: t("type_voluntary"),
  };

  function entryLabels(type: PositionType): TimelineEntryLabels {
    return { ongoing: t("ongoing"), typeLabel: TYPE_LABEL[type] };
  }

  return (
    <div>
      <PageHeader
        heading={t("heading")}
        tagline={t("tagline")}
        meta={t("positions_count", { count: positions.length })}
      />

      <div className="container-page py-10 space-y-16">
        {/* ── Experience ──────────────────────────────────────────────── */}
        <section aria-label={t("section_experience")}>
          <SectionHeader heading={t("section_experience")} ruled />

          <div className="mt-10 space-y-12">
            {/* Research era */}
            <div>
              <p className="mb-6 font-mono text-xs uppercase tracking-widest text-text-muted">
                {t("era_research")}
              </p>
              <ol className="relative ml-3 border-l-2 border-border space-y-8">
                {researchPositions.map((pos) => (
                  <TimelineEntry
                    key={pos.slug}
                    position={pos}
                    labels={entryLabels(pos.type)}
                  />
                ))}
              </ol>
            </div>

            {/* Engineering era */}
            <div>
              <p className="mb-6 font-mono text-xs uppercase tracking-widest text-text-muted">
                {t("era_engineering")}
              </p>
              <ol className="relative ml-3 border-l-2 border-border space-y-8">
                {engineeringPositions.map((pos) => (
                  <TimelineEntry
                    key={pos.slug}
                    position={pos}
                    labels={entryLabels(pos.type)}
                  />
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* ── Skills ──────────────────────────────────────────────────── */}
        <section aria-label={t("section_skills")}>
          <SectionHeader heading={t("section_skills")} ruled />
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {skills.map((group) => (
              <SkillGroup key={group.id} group={group} />
            ))}
          </div>
        </section>

        {/* ── Education ───────────────────────────────────────────────── */}
        <section aria-label={t("section_education")}>
          <SectionHeader heading={t("section_education")} ruled />
          <div className="mt-8 divide-y divide-border">
            {education.map((entry) => (
              <EducationEntry key={entry.degree} entry={entry} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
