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
            rationale="A second red on the same surface means the first was wrong. Its rarity is the point: it marks the foreground construction element, nothing else."
          />
          <NamedRuleCard
            name={tRules("no_decoration_name")}
            statement={tRules("no_decoration_statement")}
            rationale="Every mark on the drawing earns its place or is removed. This is not minimalism — it is maximum information, zero noise."
          />
          <NamedRuleCard
            name={tRules("flat_by_construction_name")}
            statement={tRules("flat_by_construction_statement")}
            rationale="A shadow here would be a smudge on the drawing. Depth is achieved through graphite weight hierarchy: heavy (1.5px), medium (1px), ghost (0.5px)."
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
              <div className={`w-[72px] h-[48px] border-ghost border-ink-ghost ${bg}`} />
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
            <span className="label text-ink-ghost">Display</span>
            <span className="font-display italic text-display leading-display text-ink">Dr Nicolas Van Labeke</span>
          </div>
          <div className="grid grid-cols-[80px_1fr] gap-lg items-baseline py-md border-b-ghost border-ink-ghost">
            <span className="label text-ink-ghost">Headline</span>
            <span className="font-display italic text-headline leading-headline text-ink">The Construction on Tracing Paper</span>
          </div>
          <div className="grid grid-cols-[80px_1fr] gap-lg items-baseline py-md border-b-ghost border-ink-ghost">
            <span className="label text-ink-ghost">Title</span>
            <span className="font-body font-medium text-title leading-title text-ink">25 years of precise practice</span>
          </div>
          <div className="grid grid-cols-[80px_1fr] gap-lg items-baseline py-md border-b-ghost border-ink-ghost">
            <span className="label text-ink-ghost">Body</span>
            <span className="font-body text-body leading-body text-ink">AI in Education · Human-Computer Interaction · Frontend engineering</span>
          </div>
          <div className="grid grid-cols-[80px_1fr] gap-lg items-baseline py-md border-b-ghost border-ink-ghost">
            <span className="label text-ink-ghost">Label</span>
            <span className="label">Era I · Research · 1995–2017</span>
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
              name="The One Red Rule"
              statement="The compass-arc red appears exactly once per surface."
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
              Collapsible frequency-sorted tag browser with chip display, drawer search, and tier grouping.
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
