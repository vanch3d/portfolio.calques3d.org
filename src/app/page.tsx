import Link from "next/link";

const NAV_LINKS = [
  { href: "/research", label: "Research", description: "Academic R&D projects (1996–2017)" },
  { href: "/research/safesea", label: "Research: SAFeSEA", description: "Example project detail + Zotero publications" },
  { href: "/cv", label: "CV / Timeline", description: "Career positions and timeline" },
];

export default function Home() {
  return (
    <main style={{ fontFamily: "sans-serif", maxWidth: 600, margin: "2rem auto", padding: "0 1rem" }}>
      <h1>Nicolas Van Labeke</h1>
      <p>Portfolio — development scaffold. No design applied yet.</p>

      <hr />

      <nav>
        <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {NAV_LINKS.map(({ href, label, description }) => (
            <li key={href}>
              <Link href={href} style={{ fontWeight: "bold" }}>{label}</Link>
              <span style={{ marginLeft: "0.5rem", color: "#666" }}>— {description}</span>
            </li>
          ))}
        </ul>
      </nav>
    </main>
  );
}
