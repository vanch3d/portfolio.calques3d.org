import Link from "next/link";

export const metadata = { title: "Content test routes" };

const ROUTES = [
  { href: "/test/cv", label: "CV / Positions", desc: "getAllPositions() — 13 JSON files" },
  { href: "/test/research", label: "Research projects", desc: "getAllResearchProjects() — MDX frontmatter" },
  { href: "/test/publications", label: "Publications", desc: "getAllPublications() — live Zotero API" },
];

export default function TestIndex() {
  return (
    <main style={{ fontFamily: "monospace", maxWidth: 700, margin: "2rem auto", padding: "0 1rem" }}>
      <h1 style={{ fontSize: "1.1rem" }}>Content test routes</h1>
      <p style={{ color: "#888", fontSize: "0.85rem" }}>
        Developer utility — verifies data pipeline end-to-end. Not part of the public site.
      </p>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {ROUTES.map(({ href, label, desc }) => (
          <li key={href} style={{ marginBottom: "0.75rem" }}>
            <Link href={href} style={{ fontWeight: "bold" }}>{label}</Link>
            <span style={{ color: "#888", marginLeft: "0.5rem", fontSize: "0.85rem" }}>— {desc}</span>
          </li>
        ))}
      </ul>
      <p style={{ marginTop: "2rem" }}>
        <Link href="/">← Home</Link>
      </p>
    </main>
  );
}
