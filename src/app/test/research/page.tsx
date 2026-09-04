import Link from "next/link";
import { getAllResearchProjects } from "@/lib/content";

export const metadata = { title: "Test — Research projects" };

export default function TestResearchPage() {
  const projects = getAllResearchProjects();

  return (
    <main style={{ fontFamily: "var(--font-label)", maxWidth: 800, margin: "2rem auto", padding: "0 1rem" }}>
      <p><Link href="/test">← Test routes</Link></p>
      <h1 style={{ fontSize: "1.1rem" }}>Research projects ({projects.length})</h1>

      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
        <thead>
          <tr style={{ textAlign: "left", borderBottom: "var(--line-medium) solid var(--color-ink-ghost)" }}>
            <th style={{ padding: "4px 8px" }}>Slug</th>
            <th style={{ padding: "4px 8px" }}>Title</th>
            <th style={{ padding: "4px 8px" }}>Period</th>
            <th style={{ padding: "4px 8px" }}>Status</th>
            <th style={{ padding: "4px 8px" }}>Featured</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((p) => (
            <tr key={p.slug} style={{ borderBottom: "var(--line-ghost) solid var(--color-ink-ghost)" }}>
              <td style={{ padding: "4px 8px", color: "var(--color-ink-secondary)" }}>{p.slug}</td>
              <td style={{ padding: "4px 8px" }}>{p.title}</td>
              <td style={{ padding: "4px 8px", whiteSpace: "nowrap", color: "var(--color-ink-secondary)" }}>
                {p.period.start} – {p.period.end ?? "present"}
              </td>
              <td style={{ padding: "4px 8px", color: "var(--color-ink-secondary)" }}>{p.status}</td>
              <td style={{ padding: "4px 8px", color: "var(--color-ink-secondary)" }}>{p.featured ? "yes" : "–"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
