/**
 * / — Home page
 *
 * Rendering: SSG
 * Static at build time — no ISR needed for the portfolio home.
 */

import { getTranslations } from "next-intl/server";
import { getAllResearchProjects, getAllEngineeringProjects } from "@/lib/content";
import { BentoGrid, BentoCard, ProjectCard, SkeletonLoader } from "@/components/ui";
import { Hero } from "./Hero";

export const dynamic = "force-static";

export const metadata = {
  title: "Nicolas Van Labeke — Research & Engineering Portfolio",
};

export default async function Home() {
  const t = await getTranslations("HomePage");

  const researchProjects = getAllResearchProjects();
  const engineeringProjects = getAllEngineeringProjects();

  const featuredResearch = researchProjects.find((p) => p.featured) ?? null;
  const featuredEngineering = engineeringProjects.find((p) => p.featured) ?? null;

  const heroLabels = {
    name: t("heading"),
    role: t("role"),
    thesis: t("thesis"),
    currentlyLabel: t("currently_label"),
    currentlyPosition: t("currently_position"),
    currentlyHref: t("currently_href"),
  };

  const cardLabels = {
    ongoing: t("ongoing"),
  };

  return (
    <div>
      <Hero labels={heroLabels} />

      <div className="container-page py-10 space-y-4">
        {/* Grid A — Career arc + featured projects */}
        <BentoGrid columns={2}>
          <BentoCard
            size="tall"
            label={t("bento_research_era")}
            heading={t("bento_research_heading")}
            body={t("bento_research_body")}
            href="/research"
            linkLabel={t("bento_research_link")}
          />

          {featuredResearch ? (
            <ProjectCard
              project={featuredResearch}
              variant="mini"
              basePath="/research"
              labels={cardLabels}
            />
          ) : (
            <SkeletonLoader variant="card" />
          )}

          {featuredEngineering ? (
            <ProjectCard
              project={featuredEngineering}
              variant="mini"
              basePath="/engineering"
              labels={cardLabels}
            />
          ) : (
            <SkeletonLoader variant="card" />
          )}

          <BentoCard
            size="tall"
            label={t("bento_engineering_era")}
            heading={t("bento_engineering_heading")}
            body={t("bento_engineering_body")}
            href="/engineering"
            linkLabel={t("bento_engineering_link")}
          />
        </BentoGrid>

        {/* Grid B — Quick access */}
        <BentoGrid columns={3}>
          <BentoCard
            heading={t("bento_publications_heading")}
            body={t("bento_publications_body")}
            href="/research/publications"
            linkLabel={t("bento_publications_link")}
          />
          <BentoCard
            heading={t("bento_cv_heading")}
            body={t("bento_cv_body")}
            href="/cv"
            linkLabel={t("bento_cv_link")}
          />
          <BentoCard
            heading={t("bento_lab_heading")}
            body={t("bento_lab_body")}
            href="/lab"
            linkLabel={t("bento_lab_link")}
          />
        </BentoGrid>
      </div>
    </div>
  );
}
