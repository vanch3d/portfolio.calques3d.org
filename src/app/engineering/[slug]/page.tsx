/**
 * /engineering/[slug] — Engineering project detail page
 *
 * Rendering: SSG
 * All slugs are known at build time from src/content/engineering/*.mdx.
 * dynamicParams = false prevents runtime 404 attempts.
 *
 * Visibility tiers:
 *   public      — full detail: CaseStudyHeader + MDX body + metadata sidebar
 *   proprietary — CaseStudyHeader + proprietary notice + metadata sidebar
 *   redacted    — notFound() (card only, no detail page)
 */

import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import {
  getEngineeringSlugs,
  getEngineeringProjectBySlug,
  importEngineeringMDX,
} from "@/lib/content";
import {
  Breadcrumb,
  type BreadcrumbItem,
  Tag,
  GlassPanel,
  CaseStudyHeader,
} from "@/components/ui";
import { joinParts, formatPeriod } from "@/lib/format";

export const dynamicParams = false;

export async function generateStaticParams() {
  return getEngineeringSlugs()
    .filter((slug) => {
      const project = getEngineeringProjectBySlug(slug);
      return project?.visibility !== "redacted";
    })
    .map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getEngineeringProjectBySlug(slug);
  if (!project || project.visibility === "redacted") return {};
  return {
    title: project.title,
    description: project.description,
  };
}

export default async function EngineeringProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const project = getEngineeringProjectBySlug(slug);
  if (!project || project.visibility === "redacted") notFound();

  const [MDXContent, t] = await Promise.all([
    importEngineeringMDX(slug),
    getTranslations("EngineeringPage"),
  ]);

  const VISIBILITY_LABEL: Record<"public" | "proprietary" | "redacted", string> = {
    public: t("visibility_public"),
    proprietary: t("visibility_proprietary"),
    redacted: t("visibility_redacted"),
  };

  const headerLabels = {
    ongoing: t("ongoing"),
    visibilityLabel: VISIBILITY_LABEL[project.visibility],
  };

  const breadcrumbItems: BreadcrumbItem[] = [
    { label: t("breadcrumb_home"), href: "/" },
    { label: t("breadcrumb_engineering"), href: "/engineering" },
    { label: project.title },
  ];

  const periodStr = formatPeriod(
    project.period.start.slice(0, 7),
    project.period.end?.slice(0, 7),
    t("ongoing")
  );

  const isPublic = project.visibility === "public";

  return (
    <div>
      <div className="container-page pt-6">
        <Breadcrumb items={breadcrumbItems} />
      </div>

      <CaseStudyHeader project={project} labels={headerLabels} />

      <div className="container-page py-10">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_280px] lg:items-start">
          <div className="min-w-0">
            {isPublic ? (
              <article className="prose prose-width">
                <MDXContent />
              </article>
            ) : (
              <GlassPanel variant="notice">
                <h2 className="text-base font-semibold text-text">
                  {t("notice_proprietary_heading")}
                </h2>
                <p className="mt-2 text-sm text-text-muted">
                  {t("notice_proprietary_body")}
                </p>
              </GlassPanel>
            )}
          </div>

          <aside>
            <GlassPanel className="lg:sticky lg:top-24">
              <dl className="space-y-4 text-sm">
                <div>
                  <dt className="font-mono text-xs uppercase tracking-widest text-text-muted">
                    {t("period_label")}
                  </dt>
                  <dd className="mt-1 font-mono tabular-nums text-text">{periodStr}</dd>
                </div>

                {project.role_title && (
                  <div>
                    <dt className="font-mono text-xs uppercase tracking-widest text-text-muted">
                      {t("role_label")}
                    </dt>
                    <dd className="mt-1 text-text">{project.role_title}</dd>
                  </div>
                )}

                {project.client && isPublic && (
                  <div>
                    <dt className="font-mono text-xs uppercase tracking-widest text-text-muted">
                      {t("client_label")}
                    </dt>
                    <dd className="mt-1 text-text">{project.client}</dd>
                  </div>
                )}
              </dl>

              {project.tags.length > 0 && (
                <div className="mt-5">
                  <p className="font-mono text-xs uppercase tracking-widest text-text-muted">
                    {t("topics_label")}
                  </p>
                  <ul
                    className="mt-2 flex flex-wrap gap-1"
                    aria-label={t("topics_label")}
                  >
                    {project.tags.map((tag) => (
                      <li key={tag}>
                        <Tag variant="mono">{tag}</Tag>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {project.links.github && project.links.github.length > 0 && (
                <div className="mt-5">
                  <p className="font-mono text-xs uppercase tracking-widest text-text-muted">
                    {t("repositories_label")}
                  </p>
                  <ul className="mt-2 space-y-1">
                    {project.links.github.map((repo) => (
                      <li key={repo}>
                        <a
                          href={`https://github.com/${repo}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="break-all text-sm text-accent hover:underline"
                        >
                          {joinParts(["github.com", repo], "/")}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {project.links.external && project.links.external.length > 0 && (
                <div className="mt-5">
                  <p className="font-mono text-xs uppercase tracking-widest text-text-muted">
                    {t("external_links_label")}
                  </p>
                  <ul className="mt-2 space-y-1">
                    {project.links.external.map((url) => (
                      <li key={url}>
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="break-all text-sm text-accent hover:underline"
                        >
                          {url.replace(/^https?:\/\//, "")}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </GlassPanel>
          </aside>
        </div>
      </div>
    </div>
  );
}
