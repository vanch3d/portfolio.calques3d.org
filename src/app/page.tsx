import Link from "next/link";
import { getTranslations } from "next-intl/server";

export default async function Home() {
  const t = await getTranslations("HomePage");

  const TEST_LINKS = [
    { href: "/test/cv", label: "CV / Positions" },
    { href: "/test/research", label: "Research projects" },
    { href: "/test/publications", label: "Publications (Zotero)" },
  ] as const;

  return (
    <main style={{ fontFamily: "sans-serif", maxWidth: 600, margin: "2rem auto", padding: "0 1rem" }}>
      <h1>{t("heading")}</h1>
      <p>{t("tagline")}</p>

      <hr />

      <h2 style={{ fontSize: "1rem", color: "#666" }}>Content test routes</h2>
      <nav>
        <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {TEST_LINKS.map(({ href, label }) => (
            <li key={href}>
              <Link href={href} style={{ fontWeight: "bold" }}>{label}</Link>
            </li>
          ))}
        </ul>
      </nav>
    </main>
  );
}
