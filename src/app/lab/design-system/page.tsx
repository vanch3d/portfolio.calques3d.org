import { getTranslations } from "next-intl/server";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { NavLink } from "@/components/ui/NavLink";
import { NamedRuleCard } from "./_components/NamedRuleCard";

export const metadata = {
  title: "Design System",
};

// Static colour strip data — class names must be literal for Tailwind's scanner.
const COLOR_STRIP = [
  { bg: "bg-ground",        hex: "#f8f4ed", name: "Ground" },
  { bg: "bg-ink",           hex: "#2a2a2a", name: "Ink" },
  { bg: "bg-ink-secondary", hex: "#6b6b6b", name: "Secondary" },
  { bg: "bg-ink-ghost",     hex: "#c8c4bc", name: "Ghost" },
  { bg: "bg-active",        hex: "#c0392b", name: "Active" },
] as const;

export default async function DesignSystemPage() {
  const t = await getTranslations("LabDesignSystem");
  const tRules = await getTranslations("NamedRuleCard");
  const tNav = await getTranslations("LabNav");

  return (
    <main className="page-wrap py-xl">

      {/* ── Page header ─────────────────────────────────────────── */}
      <header className="mb-2xl">
        <SectionLabel className="mb-sm">{t("section_label")}</SectionLabel>
        <h1 className="font-display italic text-headline leading-headline text-ink mb-md">
          {t("title")}
        </h1>
        <p className="font-body text-body leading-body text-ink-secondary max-w-prose">
          {t("thesis")}
        </p>
      </header>

      {/* ── Named rules ─────────────────────────────────────────── */}
      <section aria-labelledby="named-rules-heading">
        <SectionLabel as="h2" id="named-rules-heading" className="mb-lg">
          {t("named_rules_heading")}
        </SectionLabel>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-md">
          <NamedRuleCard
            name={tRules("one_red_name")}
            statement={tRules("one_red_statement")}
            rationale={tRules("one_red_rationale")}
          />
          <NamedRuleCard
            name={tRules("no_decoration_name")}
            statement={tRules("no_decoration_statement")}
            rationale={tRules("no_decoration_rationale")}
          />
          <NamedRuleCard
            name={tRules("flat_by_construction_name")}
            statement={tRules("flat_by_construction_statement")}
            rationale={tRules("flat_by_construction_rationale")}
          />
        </div>
      </section>

      {/* ── Section divider ─────────────────────────────────────── */}
      <hr className="border-none border-t-heavy border-ink my-2xl" aria-hidden="true" />

      {/* ── Colours preview ─────────────────────────────────────── */}
      <section aria-labelledby="colors-heading" className="mb-2xl">
        <SectionLabel as="h2" id="colors-heading" className="mb-md">
          {t("colors_section_label")}
        </SectionLabel>
        <p className="font-body text-body leading-body text-ink-secondary max-w-prose mb-lg">
          {t("colors_intro")}
        </p>

        {/* Compact colour strip — static class names for Tailwind scanner */}
        <div className="flex gap-md flex-wrap items-end mb-md" aria-hidden="true">
          {COLOR_STRIP.map(({ bg, hex, name }) => (
            <div key={name} className="flex flex-col gap-xs">
              <div className={`w-swatch-strip-w h-swatch-strip-h border-ghost border-ink-ghost ${bg}`} />
              <span className="label">{name}</span>
              <span className="label text-ink-ghost">{hex}</span>
            </div>
          ))}
        </div>

        <NavLink href="/lab/design-system/colors" className="mt-sm inline-block">
          {t("full_colors_doc_link")}
        </NavLink>
      </section>

      {/* ── Typography preview ──────────────────────────────────── */}
      <section aria-labelledby="type-heading">
        <SectionLabel as="h2" id="type-heading" className="mb-md">
          {t("type_section_label")}
        </SectionLabel>
        <p className="font-body text-body leading-body text-ink-secondary max-w-prose mb-lg">
          {t("type_intro")}
        </p>

        {/* Compact type ramp — static classes required */}
        <div className="flex flex-col border-t-ghost border-ink-ghost">
          <div className="grid grid-cols-[80px_1fr] gap-lg items-baseline py-md border-b-ghost border-ink-ghost">
            <span className="label text-ink-ghost">{t("type_role_display")}</span>
            <span className="font-display italic text-display leading-display text-ink">{t("type_specimen_display")}</span>
          </div>
          <div className="grid grid-cols-[80px_1fr] gap-lg items-baseline py-md border-b-ghost border-ink-ghost">
            <span className="label text-ink-ghost">{t("type_role_headline")}</span>
            <span className="font-display italic text-headline leading-headline text-ink">{t("type_specimen_headline")}</span>
          </div>
          <div className="grid grid-cols-[80px_1fr] gap-lg items-baseline py-md border-b-ghost border-ink-ghost">
            <span className="label text-ink-ghost">{t("type_role_title")}</span>
            <span className="font-body font-medium text-title leading-title text-ink">{t("type_specimen_title")}</span>
          </div>
          <div className="grid grid-cols-[80px_1fr] gap-lg items-baseline py-md border-b-ghost border-ink-ghost">
            <span className="label text-ink-ghost">{t("type_role_body")}</span>
            <span className="font-body text-body leading-body text-ink">{t("type_specimen_body")}</span>
          </div>
          <div className="grid grid-cols-[80px_1fr] gap-lg items-baseline py-md border-b-ghost border-ink-ghost">
            <span className="label text-ink-ghost">{t("type_role_label")}</span>
            <span className="label">{t("type_specimen_label")}</span>
          </div>
        </div>

        <NavLink href="/lab/design-system/typography" className="mt-md inline-block">
          {t("full_type_doc_link")}
        </NavLink>
      </section>

      {/* ── Section divider ─────────────────────────────────────── */}
      <hr className="border-none border-t-ghost border-ink-ghost my-2xl" aria-hidden="true" />

      {/* ── Atoms preview ───────────────────────────────────────── */}
      <section aria-labelledby="atoms-heading" className="mb-2xl">
        <SectionLabel as="h2" id="atoms-heading" className="mb-md">
          {t("atoms_section_label")}
        </SectionLabel>
        <p className="font-body text-body leading-body text-ink-secondary max-w-prose mb-lg">
          {t("atoms_preview_intro")}
        </p>

        {/* Compact atom strip — one specimen row per atom */}
        <div className="flex flex-col border-t-ghost border-ink-ghost mb-md">
          <div className="py-md border-b-ghost border-ink-ghost grid grid-cols-[100px_1fr] gap-lg items-baseline">
            <span className="label text-ink-ghost">NavLink</span>
            <nav aria-label="NavLink preview" className="flex items-baseline gap-lg">
              <NavLink href="/">Nicolas Van Labeke</NavLink>
              <span className="label text-ink-ghost" aria-hidden="true">/</span>
              <NavLink href="/lab">Lab</NavLink>
              <span className="label text-ink-ghost" aria-hidden="true">/</span>
              <span className="label active-mark">Design System</span>
            </nav>
          </div>
          <div className="py-md border-b-ghost border-ink-ghost grid grid-cols-[100px_1fr] gap-lg items-baseline">
            <span className="label text-ink-ghost">SectionLabel</span>
            <div className="flex items-baseline gap-lg">
              <SectionLabel>Colors</SectionLabel>
              <SectionLabel active>Lab</SectionLabel>
              <SectionLabel as="h3">Typography</SectionLabel>
            </div>
          </div>
          <div className="py-md border-b-ghost border-ink-ghost grid grid-cols-[100px_1fr] gap-lg items-start">
            <span className="label text-ink-ghost">NamedRuleCard</span>
            <NamedRuleCard
              name={tRules("one_red_name")}
              statement={tRules("one_red_statement")}
            />
          </div>
        </div>

        <NavLink href="/lab/design-system/atoms">{t("full_atoms_doc_link")}</NavLink>
      </section>

      {/* ── Section divider ─────────────────────────────────────── */}
      <hr className="border-none border-t-ghost border-ink-ghost my-2xl" aria-hidden="true" />

      {/* ── Molecules preview ───────────────────────────────────── */}
      <section aria-labelledby="molecules-heading" className="mb-2xl">
        <SectionLabel as="h2" id="molecules-heading" className="mb-md">
          {t("molecules_section_label")}
        </SectionLabel>
        <p className="font-body text-body leading-body text-ink-secondary max-w-prose mb-lg">
          {t("molecules_preview_intro")}
        </p>

        <div className="flex flex-col border-t-ghost border-ink-ghost mb-md">
          <div className="py-md border-b-ghost border-ink-ghost grid grid-cols-[140px_1fr] gap-lg items-baseline">
            <span className="label text-ink-ghost">TagFilterDrawer</span>
            <span className="font-body text-caption leading-body text-ink-secondary">
              {t("tag_filter_drawer_desc")}
            </span>
          </div>
        </div>

        <NavLink href="/lab/design-system/molecules">{t("full_molecules_doc_link")}</NavLink>
      </section>

      {/* ── Footer ──────────────────────────────────────────────── */}
      <footer className="mt-2xl pt-xl border-t-ghost border-ink-ghost flex justify-between items-baseline flex-wrap gap-md">
        <span className="label text-ink-ghost">{tNav("footer_note")}</span>
        <nav aria-label="Design system sections" className="flex gap-lg">
          <NavLink href="/lab/design-system/colors">{tNav("nav_colors")}</NavLink>
          <NavLink href="/lab/design-system/typography">{tNav("nav_typography")}</NavLink>
          <NavLink href="/lab/design-system/atoms">{tNav("nav_atoms")}</NavLink>
          <NavLink href="/lab/design-system/molecules">{tNav("nav_molecules")}</NavLink>
        </nav>
      </footer>

    </main>
  );
}
