import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { NavLink } from "@/components/ui/NavLink";

export default async function LabIndexPage() {
  const t = await getTranslations("LabNav");

  return (
    <main className="min-h-screen bg-ground text-ink">
      {/* ── Nav ─────────────────────────────────────────────────── */}
      <header className="page-wrap">
        <nav
          aria-label="Breadcrumb"
          className="flex items-baseline gap-lg py-lg border-b-ghost border-ink-ghost"
        >
          <NavLink href="/">{t("site_name")}</NavLink>
          <span className="label text-ink-ghost" aria-hidden="true">/</span>
          {/* The One Red Rule: active breadcrumb segment */}
          <span className="label active-mark" aria-current="page">
            {t("nav_lab")}
          </span>
        </nav>
      </header>

      {/* ── Content ─────────────────────────────────────────────── */}
      <div className="page-wrap py-xl">
        <SectionLabel className="mb-sm">Lab</SectionLabel>
        <h1 className="font-display italic text-headline leading-headline text-ink mb-2xl max-w-prose">
          {t("index_title")}
        </h1>

        {/* Route list */}
        <nav aria-label={t("nav_section_links_aria")}>
          <ul className="list-none p-0 m-0 border-t-heavy border-ink">

            {/* Design System */}
            <li className="border-b-ghost border-ink-ghost">
              <Link
                href="/lab/design-system"
                className="group flex items-baseline justify-between py-md no-underline hover:text-active transition-colors"
              >
                <div className="flex flex-col gap-xs">
                  <span className="font-body font-medium text-title leading-title text-ink group-hover:text-active transition-colors">
                    {t("nav_design_system")}
                  </span>
                  <span className="label">
                    {t("nav_design_system_subtitle")}
                  </span>
                </div>
                <span className="label text-ink-ghost group-hover:text-active transition-colors ml-lg">→</span>
              </Link>

              {/* Sub-routes */}
              <div className="flex gap-lg pb-md pl-md">
                <NavLink href="/lab/design-system/colors" className="text-ink-ghost">
                  {t("nav_colors")}
                </NavLink>
                <NavLink href="/lab/design-system/typography" className="text-ink-ghost">
                  {t("nav_typography")}
                </NavLink>
              </div>
            </li>

            {/* ADR */}
            <li className="border-b-ghost border-ink-ghost">
              <Link
                href="/lab/adr"
                className="group flex items-baseline justify-between py-md no-underline hover:text-active transition-colors"
              >
                <div className="flex flex-col gap-xs">
                  <span className="font-body font-medium text-title leading-title text-ink group-hover:text-active transition-colors">
                    {t("nav_adr")}
                  </span>
                  <span className="label">
                    {t("nav_adr_subtitle")}
                  </span>
                </div>
                <span className="label text-ink-ghost group-hover:text-active transition-colors ml-lg">→</span>
              </Link>
            </li>

          </ul>
        </nav>
      </div>
    </main>
  );
}
