import Link from "next/link";
import { getTranslations } from "next-intl/server";

export default async function Home() {
  const t = await getTranslations("HomePage");

  const NAV_LINKS = [
    { href: "/research", label: t("nav_research_label"), description: t("nav_research_desc") },
    { href: "/research/safesea", label: t("nav_safesea_label"), description: t("nav_safesea_desc") },
    { href: "/cv", label: t("nav_cv_label"), description: t("nav_cv_desc") },
  ];

  return (
    <div style={{ fontFamily: "sans-serif", maxWidth: 600, margin: "2rem auto", padding: "0 1rem" }}>
      <h1>{t("heading")}</h1>
      <p>{t("tagline")}</p>

      <hr />

      <nav>
        <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {NAV_LINKS.map(({ href, label, description }) => (
            <li key={href}>
              <Link href={href} style={{ fontWeight: "bold" }}>{label}</Link>
              <span style={{ marginLeft: "0.5rem" }}>— {description}</span>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
