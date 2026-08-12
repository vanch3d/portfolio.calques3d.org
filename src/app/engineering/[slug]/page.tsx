/**
 * /engineering/[slug] — Engineering project detail page
 *
 * Rendering: SSG
 * All routable slugs are known at build time via getEngineeringSlugs(),
 * which excludes redacted projects (no detail page for those).
 * dynamicParams = false — any unknown slug returns 404 at build time.
 *
 * Layout: two-column on lg+ (article left, metadata aside right).
 * On smaller viewports the aside stacks below the article.
 * The aside is sticky on lg+ so metadata stays visible while reading.
 */

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import {
  getEngineeringSlugs,
  getEngineeringProjectBySlug,
  importEngineeringMDX,
} from "@/lib/content";
import { BackLink } from "@/components/layout/BackLink";
import { EngineeringProjectHeader } from "./EngineeringProjectHeader";
import { EngineeringProjectMeta } from "./EngineeringProjectMeta";

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
  };

  const metaLabels = {
    tagsLabel: t("tags_label"),
    repositoriesLabel: t("repositories_label"),
    externalLinksLabel: t("external_links_label"),
    liveLabel: t("live_label"),
  };

  return (
    <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
      <BackLink
        href="/engineering"
        label={t("back")}
        navLabel={t("back_nav_label")}
      />
      <EngineeringProjectHeader project={project} labels={headerLabels} />

      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_280px] lg:gap-12">
        <article className="prose prose-neutral dark:prose-invert max-w-none min-w-0">
          <MDXContent />
        </article>
        <aside
          className="lg:sticky lg:top-8 lg:self-start"
          aria-label={t("meta_section_label")}
        >
          <EngineeringProjectMeta project={project} labels={metaLabels} />
        </aside>
      </div>
    </div>
  );
}
