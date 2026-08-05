/**
 * /research — Research projects listing
 *
 * Rendering: SSG
 * Research content is frozen legacy work — built once at deploy time.
 * No revalidation needed.
 */

import { getTranslations } from "next-intl/server";
import { getAllResearchProjects } from "@/lib/content";
import { ProjectCard } from "./ProjectCard";

// SSG — no dynamic data, no revalidation
export const dynamic = "force-static";

export default async function ResearchPage() {
  const t = await getTranslations("ResearchPage");
  const projects = getAllResearchProjects();

  const cardLabels = {
    fundedBy: (funder: string) => t("funded_by", { funder }),
    ongoing: t("ongoing"),
  };

  return (
    <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-semibold text-foreground">{t("heading")}</h1>
      <p className="mt-4 text-foreground-secondary">{t("tagline")}</p>
      <section className="mt-10 flex flex-col gap-6" aria-label={t("projects_section_label")}>
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} labels={cardLabels} />
        ))}
      </section>
    </div>
  );
}
