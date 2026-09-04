import Link from "next/link";
import { getTranslations } from "next-intl/server";

export default async function LabPage() {
  const t = await getTranslations("LabNav");

  return (
    <div
      style={{
        maxWidth: "1080px",
        margin: "0 auto",
        padding: "0 var(--page-margin)",
      }}
    >
      <nav
        aria-label={t("nav_aria_label")}
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
          <Link
            href="/"
            style={{
              fontFamily: "var(--font-label)",
              fontSize: "var(--text-label)",
              letterSpacing: "var(--tracking-label)",
              textTransform: "uppercase",
              color: "var(--color-ink-secondary)",
              textDecoration: "none",
            }}
          >
            {t("site_name")}
          </Link>
          <span
            aria-hidden="true"
            style={{
              color: "var(--color-ink-ghost)",
              fontFamily: "var(--font-label)",
              fontSize: "var(--text-label)",
            }}
          >
            /
          </span>
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
            {t("nav_lab")}
          </span>
        </div>
      </nav>

      <header style={{ marginBottom: "var(--space-2xl)" }}>
        <p
          style={{
            fontFamily: "var(--font-label)",
            fontSize: "var(--text-label)",
            letterSpacing: "var(--tracking-label)",
            textTransform: "uppercase",
            color: "var(--color-ink-secondary)",
            marginBottom: "var(--space-sm)",
          }}
        >
          {t("nav_lab")}
        </p>
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
          {t("index_title")}
        </h1>
      </header>

      <nav aria-label={t("nav_section_links_aria")}>
        <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
          <li>
            <Link
              href="/lab/design-system"
              style={{
                fontFamily: "var(--font-label)",
                fontSize: "var(--text-label)",
                letterSpacing: "var(--tracking-label)",
                textTransform: "uppercase",
                color: "var(--color-ink-secondary)",
                textDecoration: "none",
              }}
            >
              {t("nav_design_system")}
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
