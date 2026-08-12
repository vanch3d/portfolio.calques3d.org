/**
 * /research — Research projects listing
 *
 * Rendering: SSG
 * Research content is frozen legacy work — built once at deploy time.
 * No revalidation needed.
 */

import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getAllResearchProjects } from "@/lib/content";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { ProjectCard } from "./ProjectCard";

// SSG — no dynamic data, no revalidation
export const dynamic = "force-static";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("ResearchPage");
  return {
    title: t("heading"),
    description: t("description"),
  };
}

export default async function ResearchPage() {
  const [t, navT] = await Promise.all([
    getTranslations("ResearchPage"),
    getTranslations("Navigation"),
  ]);
  const projects = getAllResearchProjects();

  const cardLabels = {
    fundedBy: (funder: string) => t("funded_by", { funder }),
    ongoing: t("ongoing"),
  };

  return (
    <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
      <Breadcrumb
        items={[
          { label: navT("home"), href: "/" },
          { label: navT("research") },
        ]}
        navLabel={navT("breadcrumb_nav_label")}
      />
      <div className="mt-6">
        <SectionHeader heading={t("heading")} tagline={t("tagline")} />
      </div>
      <section className="mt-10 flex flex-col gap-6" aria-label={t("projects_section_label")}>
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} labels={cardLabels} />
        ))}
      </section>
    </div>
  );
}
