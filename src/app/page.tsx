import type { Route } from "next";
import { getTranslations } from "next-intl/server";
import { SiteNav } from "./_components/SiteNav";
import { HomepageScrollHandler } from "./_components/HomepageScrollHandler";
import { CareerArc } from "./_components/CareerArc";
import { IdentityBlock } from "./_components/IdentityBlock";
import { EraTimeline } from "./_components/EraTimeline";
import { getAllResearchProjects } from "@/lib/content/research";
import { getAllEngineeringProjects } from "@/lib/content/engineering";
import { pickSprinkle } from "./_utils/arc-sprinkles";
import Link from "next/link";

export const dynamic = "force-static";

export default async function HomePage() {
  const t = await getTranslations("HomePage");
  const tCommon = await getTranslations("Common");

  const present = tCommon("period_present");
  const allResearch = getAllResearchProjects();
  const allEngineering = getAllEngineeringProjects();

  const researchSprinkles = [
    // Slot 0 — arc origin area (~2002): early research, Calques 3D era
    pickSprinkle(allResearch, "2002", present),
    // Slot 1 — arc mid-point (~2013): learning analytics era, random from overlapping projects
    pickSprinkle(allResearch, "2013", present),
  ];

  const engineeringSprinkles = [
    // Slot 0 — arc terminus (~2023): current engineering work
    pickSprinkle(allEngineering, "2023", present),
  ];

  return (
    <>
      <SiteNav id="site-nav" />
      <HomepageScrollHandler />

      <main>
        <section
          id="hero"
          aria-label={t("arc_label")}
          className="relative w-full h-screen min-h-[600px] overflow-hidden"
        >
          <p className="sr-only">{t("arc_sr_description")}</p>

          <CareerArc
            arcLabel={t("arc_label").toUpperCase()}
            timelineStart={t("timeline_start")}
            timelineTransition={t("timeline_transition")}
            timelineEnd={t("timeline_end")}
            researchSprinkles={researchSprinkles}
            engineeringSprinkles={engineeringSprinkles}
          />

          <IdentityBlock />

          <p
            aria-hidden="true"
            className="absolute label text-ink-ghost vertical-rl"
            style={{
              bottom: "clamp(1.5rem, 4vh, 2.5rem)",
              right: "var(--page-margin)",
            }}
          >
            {t("scroll_to_explore")}
          </p>
        </section>

        <section
          aria-label={t("career_timeline_label")}
          className="px-page pb-2xl"
        >
          <div className="flex items-baseline gap-md border-t-ghost border-ink-ghost py-dense mb-loose">
            <span className="label text-ink-secondary">{t("career_timeline_label")}</span>
            <span className="label text-ink-ghost ml-auto">{t("career_timeline_span")}</span>
          </div>

          <EraTimeline />

          <nav
            aria-label={t("secondary_nav_aria")}
            className="flex items-center gap-lg border-t-ghost border-ink-ghost pt-md mt-xl"
          >
            <Link href="/lab" className="label text-ink-secondary hover:text-ink transition-colors">
              {t("secondary_nav_lab")}
            </Link>
            <Link href="/lab/adr" className="label text-ink-secondary hover:text-ink transition-colors">
              {t("secondary_nav_adr")}
            </Link>
            <Link href="/lab/design-system" className="label text-ink-secondary hover:text-ink transition-colors">
              {t("secondary_nav_tokens")}
            </Link>
            <Link
              href={"/contact" as Route}
              aria-label={t("secondary_nav_contact_aria")}
              className="label text-active ml-auto hover:text-ink transition-colors"
            >
              {t("secondary_nav_contact")}
            </Link>
          </nav>
        </section>
      </main>
    </>
  );
}
