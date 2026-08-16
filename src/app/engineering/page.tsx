/**
 * /engineering — Engineering projects listing
 *
 * Rendering: SSG
 * Engineering content is stable once authored — built once at deploy time.
 */

import { getTranslations } from "next-intl/server";
import { getAllEngineeringProjects } from "@/lib/content";
import { PageHeader } from "@/components/layout";
import { ProjectCard } from "@/components/ui";

export const dynamic = "force-static";

export const metadata = { title: "Engineering" };

export default async function EngineeringPage() {
  const t = await getTranslations("EngineeringPage");
  const projects = getAllEngineeringProjects();

  const cardLabels = {
    ongoing: t("ongoing"),
    visibilityPublic: t("visibility_public"),
    visibilityProprietary: t("visibility_proprietary"),
    visibilityRedacted: t("visibility_redacted"),
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
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
          aria-label={t("heading")}
        >
          {projects.map((project) => (
            <li key={project.slug}>
              <ProjectCard
                project={project}
                basePath="/engineering"
                labels={cardLabels}
              />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
