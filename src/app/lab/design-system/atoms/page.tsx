import { getTranslations } from "next-intl/server";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { NavLink } from "@/components/ui/NavLink";
import { NamedRuleCard } from "../_components/NamedRuleCard";
import { FilterInputDemo } from "./_components/FilterInputDemo";

export const metadata = {
  title: "Atoms · Design System",
};

export default async function AtomsPage() {
  const t = await getTranslations("LabAtoms");
  const tRules = await getTranslations("NamedRuleCard");

  return (
    <main className="page-wrap py-xl">

      {/* ── Page header ─────────────────────────────────────────── */}
      <header className="mb-2xl">
        <SectionLabel className="mb-sm">{t("page_section_label")}</SectionLabel>
        <h1 className="font-display italic text-headline leading-headline text-ink mb-md">
          {t("page_title")}
        </h1>
        <p className="font-body text-body leading-body text-ink-secondary max-w-prose">
          {t("page_intro")}
        </p>
      </header>

      {/* ── NavLink ─────────────────────────────────────────────── */}
      <section aria-labelledby="atom-nav-link-heading" className="mb-2xl">
        <SectionLabel as="h2" id="atom-nav-link-heading" className="mb-md">
          {t("nav_link_heading")}
        </SectionLabel>
        <p className="font-body text-body leading-body text-ink-secondary max-w-prose mb-lg">
          {t("nav_link_intro")}
        </p>

        {/* Specimens */}
        <div className="flex flex-col border-t-ghost border-ink-ghost mb-lg">

          {/* Breadcrumb */}
          <div className="py-md border-b-ghost border-ink-ghost">
            <span className="label text-ink-ghost block mb-sm">{t("nav_link_specimen_breadcrumb")}</span>
            <nav aria-label="NavLink breadcrumb specimen" className="flex items-baseline gap-lg">
              <NavLink href="/">Nicolas Van Labeke</NavLink>
              <span className="label text-ink-ghost" aria-hidden="true">/</span>
              <NavLink href="/lab">Lab</NavLink>
              <span className="label text-ink-ghost" aria-hidden="true">/</span>
              <span className="label active-mark" aria-current="page">Design System</span>
            </nav>
          </div>

          {/* Section nav */}
          <div className="py-md border-b-ghost border-ink-ghost">
            <span className="label text-ink-ghost block mb-sm">{t("nav_link_specimen_section")}</span>
            <nav aria-label="NavLink section nav specimen" className="flex items-baseline gap-lg">
              <NavLink href="/lab/design-system/colors">Colors</NavLink>
              <NavLink href="/lab/design-system/typography">Typography</NavLink>
              <NavLink href="/lab/design-system/atoms">Atoms</NavLink>
            </nav>
          </div>

          {/* Standalone */}
          <div className="py-md border-b-ghost border-ink-ghost">
            <span className="label text-ink-ghost block mb-sm">{t("nav_link_specimen_standalone")}</span>
            <NavLink href="/lab/design-system">{t("nav_link_standalone_example")}</NavLink>
          </div>

        </div>

        {/* State annotations */}
        <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-md">
          {[
            { state: "Rest",    desc: t("state_rest") },
            { state: "Hover",   desc: t("state_hover") },
            { state: "Focus",   desc: t("state_focus") },
            { state: "Current", desc: t("state_current") },
          ].map(({ state, desc }) => (
            <div key={state} className="border-l-heavy border-ink-ghost pl-md py-xs">
              <p className="label mb-xs">{state}</p>
              <p className="font-body text-caption leading-body text-ink-secondary">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <hr className="border-none border-t-ghost border-ink-ghost my-2xl" aria-hidden="true" />

      {/* ── SectionLabel ────────────────────────────────────────── */}
      <section aria-labelledby="atom-section-label-heading" className="mb-2xl">
        <SectionLabel as="h2" id="atom-section-label-heading" className="mb-md">
          {t("section_label_heading")}
        </SectionLabel>
        <p className="font-body text-body leading-body text-ink-secondary max-w-prose mb-lg">
          {t("section_label_intro")}
        </p>

        {/* Specimens */}
        <div className="flex flex-col border-t-ghost border-ink-ghost">
          <div className="py-md border-b-ghost border-ink-ghost grid grid-cols-[120px_1fr] gap-lg items-baseline">
            <span className="label text-ink-ghost">Default</span>
            <SectionLabel>Design System</SectionLabel>
          </div>
          <div className="py-md border-b-ghost border-ink-ghost grid grid-cols-[120px_1fr] gap-lg items-baseline">
            <span className="label text-ink-ghost">active</span>
            <SectionLabel active>Lab</SectionLabel>
          </div>
          <div className="py-md border-b-ghost border-ink-ghost grid grid-cols-[120px_1fr] gap-lg items-baseline">
            <span className="label text-ink-ghost">as=&quot;h2&quot;</span>
            <SectionLabel as="h2">Named Rules</SectionLabel>
          </div>
          <div className="py-md border-b-ghost border-ink-ghost grid grid-cols-[120px_1fr] gap-lg items-baseline">
            <span className="label text-ink-ghost">as=&quot;span&quot;</span>
            <SectionLabel as="span">Era I · Research</SectionLabel>
          </div>
        </div>
      </section>

      <hr className="border-none border-t-ghost border-ink-ghost my-2xl" aria-hidden="true" />

      {/* ── FilterInput ─────────────────────────────────────────── */}
      <section aria-labelledby="atom-filter-input-heading" className="mb-2xl">
        <SectionLabel as="h2" id="atom-filter-input-heading" className="mb-md">
          {t("filter_input_heading")}
        </SectionLabel>
        <p className="font-body text-body leading-body text-ink-secondary max-w-prose mb-lg">
          {t("filter_input_intro")}
        </p>

        {/* Specimens */}
        <div className="flex flex-col border-t-ghost border-ink-ghost mb-lg">

          <div className="py-md border-b-ghost border-ink-ghost">
            <span className="label text-ink-ghost block mb-sm">{t("filter_input_specimen_default")}</span>
            <div className="max-w-xs">
              <FilterInputDemo
                placeholder="SEARCH..."
                ariaLabel="Filter records — default specimen"
              />
            </div>
          </div>

          <div className="py-md border-b-ghost border-ink-ghost">
            <span className="label text-ink-ghost block mb-sm">{t("filter_input_specimen_icon")}</span>
            <div className="max-w-xs">
              <FilterInputDemo
                placeholder="SEARCH..."
                ariaLabel="Filter records — icon prefix specimen"
                startAddon="⌕"
              />
            </div>
          </div>

          <div className="py-md border-b-ghost border-ink-ghost">
            <span className="label text-ink-ghost block mb-sm">{t("filter_input_specimen_filled")}</span>
            <div className="max-w-xs">
              <FilterInputDemo
                placeholder="SEARCH..."
                ariaLabel="Filter records — filled specimen"
                startAddon="⌕"
                initialValue="accessibility"
              />
            </div>
          </div>

        </div>

        {/* State annotations */}
        <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-md">
          {[
            { state: "Rest",   desc: t("state_filter_rest") },
            { state: "Focus",  desc: t("state_filter_focus") },
            { state: "Filled", desc: t("state_filter_filled") },
          ].map(({ state, desc }) => (
            <div key={state} className="border-l-heavy border-ink-ghost pl-md py-xs">
              <p className="label mb-xs">{state}</p>
              <p className="font-body text-caption leading-body text-ink-secondary">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <hr className="border-none border-t-ghost border-ink-ghost my-2xl" aria-hidden="true" />

      {/* ── NamedRuleCard ────────────────────────────────────────── */}
      <section aria-labelledby="atom-named-rule-card-heading">
        <SectionLabel as="h2" id="atom-named-rule-card-heading" className="mb-md">
          {t("named_rule_card_heading")}
        </SectionLabel>
        <p className="font-body text-body leading-body text-ink-secondary max-w-prose mb-lg">
          {t("named_rule_card_intro")}
        </p>

        {/* With rationale */}
        <span className="label text-ink-ghost block mb-sm">{t("example_with_rationale")}</span>
        <NamedRuleCard
          name={tRules("one_red_name")}
          statement={tRules("one_red_statement")}
          rationale="A second red on the same surface means the first was wrong. Its rarity is the point: it marks the foreground construction element, nothing else."
          className="mb-lg max-w-prose"
        />

        {/* Without rationale */}
        <span className="label text-ink-ghost block mb-sm">{t("example_without_rationale")}</span>
        <NamedRuleCard
          name={tRules("flat_by_construction_name")}
          statement={tRules("flat_by_construction_statement")}
          className="mb-lg max-w-prose"
        />

        {/* In grid */}
        <span className="label text-ink-ghost block mb-sm">{t("example_in_grid")}</span>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-md">
          <NamedRuleCard
            name={tRules("one_red_name")}
            statement={tRules("one_red_statement")}
          />
          <NamedRuleCard
            name={tRules("no_decoration_name")}
            statement={tRules("no_decoration_statement")}
          />
          <NamedRuleCard
            name={tRules("flat_by_construction_name")}
            statement={tRules("flat_by_construction_statement")}
          />
        </div>
      </section>

    </main>
  );
}
