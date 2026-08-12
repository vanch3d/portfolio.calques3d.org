/**
 * /engineering — Engineering projects listing
 *
 * Rendering: SSG
 * Engineering content is stable once authored — built once at deploy time.
 * No revalidation needed.
 */

import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getAllEngineeringProjects } from "@/lib/content";
import { EngineeringCard } from "./EngineeringCard";

// SSG — no dynamic data, no revalidation
export const dynamic = "force-static";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("EngineeringPage");
  return {
    title: t("heading"),
    description: t("description"),
  };
}

export default async function EngineeringPage() {
  const t = await getTranslations("EngineeringPage");
  const projects = getAllEngineeringProjects();

  const cardLabels = {
    ongoing: t("ongoing"),
    visibilityPublic: t("visibility_public"),
    visibilityProprietary: t("visibility_proprietary"),
    visibilityRedacted: t("visibility_redacted"),
    cardLinkLabel: t("card_link_label"),
  };

  return (
    <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-semibold text-foreground">{t("heading")}</h1>
      <p className="mt-4 text-foreground-secondary">{t("tagline")}</p>
      <section
        className="mt-10 flex flex-col gap-6"
        aria-label={t("projects_section_label")}
      >
        {projects.map((project) => (
          <EngineeringCard
            key={project.slug}
            project={project}
            labels={cardLabels}
          />
        ))}
      </section>
    </div>
  );
}
