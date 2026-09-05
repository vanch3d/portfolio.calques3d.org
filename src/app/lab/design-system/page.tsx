import { getTranslations } from "next-intl/server";
import { SectionLabel } from "./_components/SectionLabel";
import { NamedRuleCard } from "./_components/NamedRuleCard";
import { ColorPalette } from "./colors/ColorPalette";
import { TypeScale } from "./typography/TypeScale";
import { NavLink } from "@/components/ui/NavLink";

export const dynamic = "force-static";

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
          <NavLink href="/">{tNav("site_name")}</NavLink>
          <span aria-hidden="true" className="font-label text-ink-ghost" style={{ fontSize: "var(--text-label)" }}>/</span>
          <NavLink href="/lab">{tNav("nav_lab")}</NavLink>
          <span aria-hidden="true" className="font-label text-ink-ghost" style={{ fontSize: "var(--text-label)" }}>/</span>
          <span aria-current="page" className="label active-mark">
            {tNav("nav_design_system")}
          </span>
          <div style={{ marginLeft: "auto", display: "flex", gap: "var(--space-lg)" }}>
            <NavLink href="/lab/design-system/colors">{tNav("nav_colors")}</NavLink>
            <NavLink href="/lab/design-system/typography">{tNav("nav_typography")}</NavLink>
          </div>
        </div>
      </nav>

      <header style={{ marginBottom: "var(--space-2xl)" }}>
        <SectionLabel>{tPage("section_label")}</SectionLabel>
        <h1
          className="title-italic text-ink"
          style={{
            fontSize: "var(--text-headline)",
            fontWeight: 400,
            lineHeight: "var(--leading-headline)",
            marginBottom: "var(--space-md)",
          }}
        >
          {tPage("title")}
        </h1>
        <p
          className="font-body text-ink-secondary"
          style={{
            fontSize: "var(--text-body)",
            lineHeight: "var(--leading-body)",
            maxWidth: "var(--measure-body)",
          }}
        >
          {tPage("thesis")}
        </p>
      </header>

      <section aria-labelledby="named-rules-heading">
        <h2
          id="named-rules-heading"
          className="label"
          style={{ marginBottom: "var(--space-lg)" }}
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
            className="label"
            style={{ marginBottom: 0 }}
          >
            {tPage("colors_section_label")}
          </h2>
          <NavLink href="/lab/design-system/colors">{tNav("nav_colors")} →</NavLink>
        </div>
        <p
          className="font-body text-ink-secondary"
          style={{
            fontSize: "var(--text-body)",
            lineHeight: "var(--leading-body)",
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
            className="label"
            style={{ marginBottom: 0 }}
          >
            {tPage("type_section_label")}
          </h2>
          <NavLink href="/lab/design-system/typography">{tPage("full_type_doc_link")}</NavLink>
        </div>
        <p
          className="font-body text-ink-secondary"
          style={{
            fontSize: "var(--text-body)",
            lineHeight: "var(--leading-body)",
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
        <span className="label">{tNav("footer_note")}</span>
        <nav aria-label={tNav("nav_section_links_aria")} style={{ display: "flex", gap: "var(--space-lg)" }}>
          <NavLink href="/lab/design-system/colors">{tNav("nav_colors")}</NavLink>
          <NavLink href="/lab/design-system/typography">{tNav("nav_typography")}</NavLink>
        </nav>
      </footer>
    </div>
  );
}
