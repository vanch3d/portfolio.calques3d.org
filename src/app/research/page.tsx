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
import { ProjectCard } from "@/components/ui";

// SSG — no dynamic data, no revalidation
export const dynamic = "force-static";

export const metadata = { title: "Research" };

export default async function ResearchPage() {
  const t = await getTranslations("ResearchPage");
  const projects = getAllResearchProjects();

  const cardLabels = {
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
        <ul
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 stagger-children"
          aria-label={t("heading")}
        >
          {projects.map((project) => (
            <li key={project.slug} className="animate-reveal-up">
              <ProjectCard
                project={project}
                basePath="/research"
                labels={cardLabels}
              />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
