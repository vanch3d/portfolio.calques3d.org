/**
 * /research — Research projects listing
 *
 * Rendering: SSG
 * Research content is frozen legacy work — built once at deploy time.
 * No revalidation needed.
 */

import { getTranslations } from "next-intl/server";
import { getAllResearchProjects } from "@/lib/content";
import { PageHeader } from "@/components/layout";
import { ProjectCard } from "./ProjectCard";

// SSG — no dynamic data, no revalidation
export const dynamic = "force-static";

export const metadata = { title: "Research" };

export default async function ResearchPage() {
  const t = await getTranslations("ResearchPage");
  const projects = getAllResearchProjects();

  const cardLabels = {
    fundedBy: (funder: string) => t("funded_by", { funder }),
    ongoing: t("ongoing"),
  };

  return (
    <div>
      <PageHeader
        heading={t("heading")}
        tagline={t("tagline")}
        meta={t("projects_count", { count: projects.length })}
      />
      <section className="container-page py-10">
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} labels={cardLabels} />
        ))}
      </section>
    </div>
  );
}
