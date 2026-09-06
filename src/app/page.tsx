import { getTranslations } from "next-intl/server";
import { CareerArc } from "./_components/CareerArc";
import { IdentityBlock } from "./_components/IdentityBlock";
import { EraBlock } from "./_components/EraBlock";

export const dynamic = "force-static";

export default async function HomePage() {
  const t = await getTranslations("HomePage");

  return (
    <>
      {/* ── Hero: full-viewport arc construction ─────────────────────── */}
      <section
        className="relative w-full h-screen overflow-hidden"
        aria-label={t("arc_label")}
      >
        <CareerArc
          arcLabel={t("arc_label").toUpperCase() + " · 31 YEARS"}
          timelineStart={t("timeline_start")}
          timelineTransition={t("timeline_transition")}
          timelineEnd={t("timeline_end")}
        />

        <IdentityBlock />

        {/* Scroll prompt — decorative, hidden from screen readers */}
        <p
          className="absolute label text-ink-ghost bottom-scroll-prompt-bottom right-page vertical-rl"
          aria-hidden="true"
        >
          {t("scroll_prompt")}
        </p>
      </section>

      {/* ── Below-fold: era blocks ────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-lg border-t-ghost border-ink-ghost px-page py-section-pad-block">
        <EraBlock
          label={t("era_research_label")}
          span={t("era_research_span")}
          name={t("era_research_name")}
          summary={t("era_research_summary")}
          linkHref="/research"
          linkLabel={t("nav_research")}
        />
        <EraBlock
          label={t("era_engineering_label")}
          span={t("era_engineering_span")}
          name={t("era_engineering_name")}
          summary={t("era_engineering_summary")}
          linkHref="/engineering"
          linkLabel={t("nav_engineering")}
        />
      </div>
    </>
  );
}
