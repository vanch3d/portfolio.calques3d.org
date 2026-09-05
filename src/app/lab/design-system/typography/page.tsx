import { getTranslations } from "next-intl/server";
import { SectionLabel } from "../_components/SectionLabel";
import { TypeScale } from "./TypeScale";
import { NavLink } from "@/components/ui/NavLink";

export const dynamic = "force-static";

export default async function TypographyPage() {
  const tNav  = await getTranslations("LabNav");
  const tType = await getTranslations("LabTypography");

  return (
    <div
      style={{
        maxWidth: "1080px",
        margin: "0 auto",
        padding: "0 var(--page-margin)",
      }}
    >
      <nav
        aria-label={tNav("nav_aria_label")}
        style={{
          paddingTop: "var(--space-lg)",
          paddingBottom: "var(--space-md)",
          borderBottom: "var(--line-ghost) solid var(--color-ink-ghost)",
          marginBottom: "var(--space-xl)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: "var(--space-lg)",
          }}
        >
          <NavLink href="/">{tNav("site_name")}</NavLink>
          <span aria-hidden="true" className="font-label text-ink-ghost" style={{ fontSize: "var(--text-label)" }}>/</span>
          <NavLink href="/lab">{tNav("nav_lab")}</NavLink>
          <span aria-hidden="true" className="font-label text-ink-ghost" style={{ fontSize: "var(--text-label)" }}>/</span>
          <NavLink href="/lab/design-system">{tNav("nav_design_system")}</NavLink>
          <span aria-hidden="true" className="font-label text-ink-ghost" style={{ fontSize: "var(--text-label)" }}>/</span>
          <span aria-current="page" className="label active-mark">
            {tNav("nav_typography")}
          </span>
        </div>
      </nav>

      <header style={{ marginBottom: "var(--space-2xl)" }}>
        <SectionLabel>{tType("page_section_label")}</SectionLabel>
        <h1
          className="title-italic text-ink"
          style={{
            fontSize: "var(--text-headline)",
            fontWeight: 400,
            lineHeight: "var(--leading-headline)",
            marginBottom: "var(--space-md)",
          }}
        >
          {tType("page_title")}
        </h1>
        <p
          className="font-body text-ink-secondary"
          style={{
            fontSize: "var(--text-body)",
            lineHeight: "var(--leading-body)",
            maxWidth: "var(--measure-body)",
          }}
        >
          {tType("page_intro")}
        </p>
      </header>

      <section aria-labelledby="type-specimens-heading">
        <h2
          id="type-specimens-heading"
          className="label"
          style={{ marginBottom: "var(--space-lg)" }}
        >
          {tType("specimens_heading")}
        </h2>
        <TypeScale />
      </section>

      <hr
        aria-hidden="true"
        style={{
          border: "none",
          borderTop: "var(--line-heavy) solid var(--color-ink)",
          margin: "var(--space-2xl) 0 var(--space-xl)",
        }}
      />

      <section aria-labelledby="incline-rule-heading">
        <h2
          id="incline-rule-heading"
          className="label"
          style={{ marginBottom: "var(--space-md)" }}
        >
          {tType("named_rules_heading")}
        </h2>
        <article
          style={{
            border: "var(--line-medium) solid var(--color-ink-ghost)",
            padding: "var(--space-md) var(--space-lg)",
            maxWidth: "var(--measure-body)",
          }}
        >
          <p className="label" style={{ marginBottom: "var(--space-sm)" }}>
            {tType("incline_rule_name")}
          </p>
          <p
            className="font-body text-ink-secondary"
            style={{
              fontSize: "var(--text-body)",
              lineHeight: "var(--leading-body)",
            }}
          >
            {tType("incline_rule_body")}
          </p>

          <div
            data-testid="incline-comparison"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "var(--space-lg)",
              marginTop: "var(--space-lg)",
              paddingTop: "var(--space-md)",
              borderTop: "var(--line-ghost) solid var(--color-ink-ghost)",
            }}
          >
            <div>
              <p className="label" style={{ marginBottom: "var(--space-sm)" }}>
                {tType("incline_comparison_display_label")}
              </p>
              <p
                className="font-display italic text-ink"
                style={{ fontSize: "var(--text-title)", lineHeight: "var(--leading-title)" }}
              >
                {tType("incline_comparison_display_example")}
              </p>
            </div>
            <div>
              <p className="label" style={{ marginBottom: "var(--space-sm)" }}>
                {tType("incline_comparison_body_label")}
              </p>
              <p
                className="font-body italic text-ink"
                style={{ fontSize: "var(--text-title)", lineHeight: "var(--leading-title)" }}
              >
                {tType("incline_comparison_body_example")}
              </p>
            </div>
          </div>
        </article>
      </section>

      <footer
        style={{
          paddingTop: "var(--space-xl)",
          paddingBottom: "var(--space-2xl)",
          borderTop: "var(--line-ghost) solid var(--color-ink-ghost)",
          marginTop: "var(--space-2xl)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          gap: "var(--space-md)",
          flexWrap: "wrap",
        }}
      >
        <span className="label">{tNav("footer_note")}</span>
        <nav aria-label={tNav("nav_section_links_aria")} style={{ display: "flex", gap: "var(--space-lg)" }}>
          <NavLink href="/lab/design-system/colors">{tNav("nav_colors")}</NavLink>
          <NavLink href="/lab/design-system/typography">{tNav("nav_typography")}</NavLink>
        </nav>
      </footer>
    </div>
  );
}
