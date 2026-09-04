import { getTranslations } from "next-intl/server";
import { SectionLabel } from "../_components/SectionLabel";
import { LabLink } from "../_components/LabLink";
import { TypeScale } from "./TypeScale";

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
          <LabLink href="/">{tNav("site_name")}</LabLink>
          <span aria-hidden="true" style={{ color: "var(--color-ink-ghost)", fontFamily: "var(--font-label)", fontSize: "var(--text-label)" }}>/</span>
          <LabLink href="/lab">{tNav("nav_lab")}</LabLink>
          <span aria-hidden="true" style={{ color: "var(--color-ink-ghost)", fontFamily: "var(--font-label)", fontSize: "var(--text-label)" }}>/</span>
          <LabLink href="/lab/design-system">{tNav("nav_design_system")}</LabLink>
          <span aria-hidden="true" style={{ color: "var(--color-ink-ghost)", fontFamily: "var(--font-label)", fontSize: "var(--text-label)" }}>/</span>
          <span
            aria-current="page"
            style={{
              fontFamily: "var(--font-label)",
              fontSize: "var(--text-label)",
              letterSpacing: "var(--tracking-label)",
              textTransform: "uppercase",
              color: "var(--color-active)",
            }}
          >
            {tNav("nav_typography")}
          </span>
        </div>
      </nav>

      <header style={{ marginBottom: "var(--space-2xl)" }}>
        <SectionLabel>{tType("page_section_label")}</SectionLabel>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "var(--text-headline)",
            fontWeight: 400,
            fontStyle: "italic",
            lineHeight: "var(--leading-headline)",
            color: "var(--color-ink)",
            marginBottom: "var(--space-md)",
          }}
        >
          {tType("page_title")}
        </h1>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "var(--text-body)",
            lineHeight: "var(--leading-body)",
            color: "var(--color-ink-secondary)",
            maxWidth: "var(--measure-body)",
          }}
        >
          {tType("page_intro")}
        </p>
      </header>

      <section aria-labelledby="type-specimens-heading">
        <h2
          id="type-specimens-heading"
          style={{
            fontFamily: "var(--font-label)",
            fontSize: "var(--text-label)",
            letterSpacing: "var(--tracking-label)",
            textTransform: "uppercase",
            color: "var(--color-ink-secondary)",
            marginBottom: "var(--space-lg)",
          }}
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
          style={{
            fontFamily: "var(--font-label)",
            fontSize: "var(--text-label)",
            letterSpacing: "var(--tracking-label)",
            textTransform: "uppercase",
            color: "var(--color-ink-secondary)",
            marginBottom: "var(--space-md)",
          }}
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
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "var(--text-body)",
              lineHeight: "var(--leading-body)",
              color: "var(--color-ink-secondary)",
            }}
          >
            {tType("incline_rule_body")}
          </p>
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
        <span
          style={{
            fontFamily: "var(--font-label)",
            fontSize: "var(--text-label)",
            letterSpacing: "var(--tracking-label)",
            textTransform: "uppercase",
            color: "var(--color-ink-secondary)",
          }}
        >
          {tNav("footer_note")}
        </span>
        <nav aria-label={tNav("nav_section_links_aria")} style={{ display: "flex", gap: "var(--space-lg)" }}>
          <LabLink href="/lab/design-system/colors">{tNav("nav_colors")}</LabLink>
          <LabLink href="/lab/design-system/typography">{tNav("nav_typography")}</LabLink>
        </nav>
      </footer>
    </div>
  );
}
