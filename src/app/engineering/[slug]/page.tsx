/**
 * /engineering/[slug] — Engineering project detail page
 *
 * Rendering: SSG
 * All routable slugs are known at build time via getEngineeringSlugs(),
 * which excludes redacted projects (no detail page for those).
 * dynamicParams = false — any unknown slug returns 404 at build time.
 */

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import {
  getEngineeringSlugs,
  getEngineeringProjectBySlug,
  importEngineeringMDX,
} from "@/lib/content";
import { EngineeringProjectHeader } from "./EngineeringProjectHeader";

export const dynamicParams = false;

export async function generateStaticParams() {
  return getEngineeringSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getEngineeringProjectBySlug(slug);
  if (!project) return {};
  const t = await getTranslations("EngineeringPage");
  return {
    title: `${t("heading")} | ${project.title}`,
    description: `${project.title} — ${project.visibility} engineering project (${project.period.start}–${project.period.end ?? t("ongoing")}).`,
  };
}

export default async function EngineeringProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const project = getEngineeringProjectBySlug(slug);
  if (!project) notFound();

  const [MDXContent, t] = await Promise.all([
    importEngineeringMDX(slug),
    getTranslations("EngineeringPage"),
  ]);

  const headerLabels = {
    ongoing: t("ongoing"),
    periodLabel: t("period_label"),
    roleLabel: t("role_label"),
    clientLabel: t("client_label"),
    tagsLabel: t("tags_label"),
    repositoriesLabel: t("repositories_label"),
    externalLinksLabel: t("external_links_label"),
    liveLabel: t("live_label"),
  };

  return (
    <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
      <nav aria-label={t("back_nav_label")}>
        <a
          href="/engineering"
          className="text-sm text-foreground-secondary hover:text-foreground"
        >
          {t("back")}
        </a>
      </nav>
      <EngineeringProjectHeader project={project} labels={headerLabels} />
      <article className="prose prose-neutral dark:prose-invert mt-10 max-w-none">
        <MDXContent />
      </article>
    </div>
  );
}
