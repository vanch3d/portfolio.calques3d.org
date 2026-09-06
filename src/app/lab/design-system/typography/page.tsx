import { getTranslations } from "next-intl/server";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { TypeSpecimen } from "../_components/TypeSpecimen";
import { NamedRuleCard } from "../_components/NamedRuleCard";

export const metadata = {
  title: "Typography",
};

export default async function TypographyPage() {
  const t = await getTranslations("LabTypography");

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

      {/* ── Type specimens ──────────────────────────────────────── */}
      <section aria-labelledby="specimens-heading" className="mb-2xl">
        <SectionLabel as="h2" id="specimens-heading" className="mb-lg">
          {t("specimens_heading")}
        </SectionLabel>

        <div className="flex flex-col">
          <TypeSpecimen
            role={t("role_display")}
            variant="display"
            specimenText={t("specimen_display")}
            specs={[
              t("spec_stix"),
              t("spec_italic"),
              t("spec_display_size"),
              t("spec_leading_display"),
            ]}
            rationale={t("rationale_display")}
          />
          <TypeSpecimen
            role={t("role_headline")}
            variant="headline"
            specimenText={t("specimen_headline")}
            specs={[
              t("spec_stix"),
              t("spec_italic"),
              t("spec_headline_size"),
              t("spec_leading_headline"),
            ]}
            rationale={t("rationale_headline")}
          />
          <TypeSpecimen
            role={t("role_title")}
            variant="title"
            specimenText={t("specimen_title")}
            specs={[
              t("spec_spectral"),
              t("spec_medium_500"),
              t("spec_title_size"),
            ]}
            rationale={t("rationale_title")}
          />
          <TypeSpecimen
            role={t("role_body")}
            variant="body"
            specimenText={t("specimen_body")}
            specs={[
              t("spec_spectral"),
              t("spec_regular"),
              t("spec_body_size"),
              t("spec_leading_body"),
              t("spec_measure"),
            ]}
            rationale={t("rationale_body")}
          />
          <TypeSpecimen
            role={t("role_label")}
            variant="label"
            specimenText={t("specimen_label")}
            specs={[
              t("spec_departure"),
              t("spec_regular"),
              t("spec_label_size"),
              t("spec_tracking"),
              t("spec_uppercase"),
            ]}
            rationale={t("rationale_label")}
          />
        </div>
      </section>

      {/* ── Named rule ──────────────────────────────────────────── */}
      <section aria-labelledby="type-rules-heading">
        <SectionLabel as="h2" id="type-rules-heading" className="mb-lg">
          {t("named_rules_heading")}
        </SectionLabel>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-md mb-xl">
          <NamedRuleCard
            name={t("incline_rule_name")}
            statement={t("incline_rule_body")}
          />
        </div>

        {/* Incline comparison */}
        <div className="flex flex-col border-t-ghost border-ink-ghost">
          <div className="grid grid-cols-[180px_1fr] gap-lg items-baseline py-md border-b-ghost border-ink-ghost">
            <span className="label text-ink-ghost">{t("incline_comparison_display_label")}</span>
            <span className="font-display italic text-headline leading-headline text-ink">
              {t("incline_comparison_display_example")}
            </span>
          </div>
          <div className="grid grid-cols-[180px_1fr] gap-lg items-baseline py-md border-b-ghost border-ink-ghost">
            <span className="label text-ink-ghost">{t("incline_comparison_body_label")}</span>
            <span className="font-body italic text-title leading-title text-ink">
              {t("incline_comparison_body_example")}
            </span>
          </div>
        </div>
      </section>

    </main>
  );
}
