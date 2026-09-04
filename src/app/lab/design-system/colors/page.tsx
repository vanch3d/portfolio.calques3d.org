import { getTranslations } from "next-intl/server";
import { SectionLabel } from "../_components/SectionLabel";
import { LabLink } from "../_components/LabLink";
import { ColorPalette } from "./ColorPalette";

export default async function ColorsPage() {
  const tNav    = await getTranslations("LabNav");
  const tColors = await getTranslations("LabColors");

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
            {tNav("nav_colors")}
          </span>
        </div>
      </nav>

      <header style={{ marginBottom: "var(--space-2xl)" }}>
        <SectionLabel>{tColors("page_section_label")}</SectionLabel>
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
          {tColors("page_title")}
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
          {tColors("page_intro")}
        </p>
      </header>

      <ColorPalette />

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
