import { getTranslations } from "next-intl/server";
import { SectionLabel } from "./_components/SectionLabel";
import { NamedRuleCard } from "./_components/NamedRuleCard";
import { LabLink } from "./_components/LabLink";
import { ColorPalette } from "./colors/ColorPalette";
import { TypeScale } from "./typography/TypeScale";

export default async function DesignSystemPage() {
  const tNav  = await getTranslations("LabNav");
  const tPage = await getTranslations("LabDesignSystem");

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
            {tNav("nav_design_system")}
          </span>
          <div style={{ marginLeft: "auto", display: "flex", gap: "var(--space-lg)" }}>
            <LabLink href="/lab/design-system/colors">{tNav("nav_colors")}</LabLink>
            <LabLink href="/lab/design-system/typography">{tNav("nav_typography")}</LabLink>
          </div>
        </div>
      </nav>

      <header style={{ marginBottom: "var(--space-2xl)" }}>
        <SectionLabel>{tPage("section_label")}</SectionLabel>
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
          {tPage("title")}
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
          {tPage("thesis")}
        </p>
      </header>

      <section aria-labelledby="named-rules-heading">
        <h2
          id="named-rules-heading"
          style={{
            fontFamily: "var(--font-label)",
            fontSize: "var(--text-label)",
            letterSpacing: "var(--tracking-label)",
            textTransform: "uppercase",
            color: "var(--color-ink-secondary)",
            marginBottom: "var(--space-lg)",
          }}
        >
          {tPage("named_rules_heading")}
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "var(--space-md)",
            marginBottom: "var(--space-xs)",
          }}
        >
          <NamedRuleCard variant="one_red" />
          <NamedRuleCard variant="no_decoration" />
          <NamedRuleCard variant="flat_by_construction" />
        </div>
      </section>

      <hr
        aria-hidden="true"
        style={{
          border: "none",
          borderTop: "var(--line-heavy) solid var(--color-ink)",
          margin: "var(--space-2xl) 0 var(--space-xl)",
        }}
      />

      <section aria-labelledby="colors-preview-heading">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            marginBottom: "var(--space-md)",
            flexWrap: "wrap",
            gap: "var(--space-md)",
          }}
        >
          <h2
            id="colors-preview-heading"
            style={{
              fontFamily: "var(--font-label)",
              fontSize: "var(--text-label)",
              letterSpacing: "var(--tracking-label)",
              textTransform: "uppercase",
              color: "var(--color-ink-secondary)",
              marginBottom: 0,
            }}
          >
            {tPage("colors_section_label")}
          </h2>
          <LabLink href="/lab/design-system/colors">{tNav("nav_colors")} →</LabLink>
        </div>
        <p
          style={{
            fontSize: "var(--text-body)",
            lineHeight: "var(--leading-body)",
            color: "var(--color-ink-secondary)",
            maxWidth: "var(--measure-body)",
            marginBottom: "var(--space-lg)",
          }}
        >
          {tPage("colors_intro")}
        </p>
        <ColorPalette />
      </section>

      <hr
        aria-hidden="true"
        style={{
          border: "none",
          borderTop: "var(--line-heavy) solid var(--color-ink)",
          margin: "var(--space-2xl) 0 var(--space-xl)",
        }}
      />

      <section aria-labelledby="type-preview-heading">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            marginBottom: "var(--space-md)",
            flexWrap: "wrap",
            gap: "var(--space-md)",
          }}
        >
          <h2
            id="type-preview-heading"
            style={{
              fontFamily: "var(--font-label)",
              fontSize: "var(--text-label)",
              letterSpacing: "var(--tracking-label)",
              textTransform: "uppercase",
              color: "var(--color-ink-secondary)",
              marginBottom: 0,
            }}
          >
            {tPage("type_section_label")}
          </h2>
          <LabLink href="/lab/design-system/typography">{tPage("full_type_doc_link")}</LabLink>
        </div>
        <p
          style={{
            fontSize: "var(--text-body)",
            lineHeight: "var(--leading-body)",
            color: "var(--color-ink-secondary)",
            maxWidth: "var(--measure-body)",
            marginBottom: "var(--space-lg)",
          }}
        >
          {tPage("type_intro")}
        </p>
        <TypeScale />
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
