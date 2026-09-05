import { getTranslations } from "next-intl/server";
import { SectionLabel } from "../_components/SectionLabel";
import { ColorPalette } from "./ColorPalette";
import { NavLink } from "@/components/ui/NavLink";

export const dynamic = "force-static";

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
          <NavLink href="/">{tNav("site_name")}</NavLink>
          <span aria-hidden="true" className="font-label text-ink-ghost" style={{ fontSize: "var(--text-label)" }}>/</span>
          <NavLink href="/lab">{tNav("nav_lab")}</NavLink>
          <span aria-hidden="true" className="font-label text-ink-ghost" style={{ fontSize: "var(--text-label)" }}>/</span>
          <NavLink href="/lab/design-system">{tNav("nav_design_system")}</NavLink>
          <span aria-hidden="true" className="font-label text-ink-ghost" style={{ fontSize: "var(--text-label)" }}>/</span>
          <span aria-current="page" className="label active-mark">
            {tNav("nav_colors")}
          </span>
        </div>
      </nav>

      <header style={{ marginBottom: "var(--space-2xl)" }}>
        <SectionLabel>{tColors("page_section_label")}</SectionLabel>
        <h1
          className="title-italic text-ink"
          style={{
            fontSize: "var(--text-headline)",
            fontWeight: 400,
            lineHeight: "var(--leading-headline)",
            marginBottom: "var(--space-md)",
          }}
        >
          {tColors("page_title")}
        </h1>
        <p
          className="font-body text-ink-secondary"
          style={{
            fontSize: "var(--text-body)",
            lineHeight: "var(--leading-body)",
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
        <span className="label">{tNav("footer_note")}</span>
        <nav aria-label={tNav("nav_section_links_aria")} style={{ display: "flex", gap: "var(--space-lg)" }}>
          <NavLink href="/lab/design-system/colors">{tNav("nav_colors")}</NavLink>
          <NavLink href="/lab/design-system/typography">{tNav("nav_typography")}</NavLink>
        </nav>
      </footer>
    </div>
  );
}
