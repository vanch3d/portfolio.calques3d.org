import Link from "next/link";
import { getAllResearchProjects } from "@/lib/content";

export const metadata = { title: "Test — Research projects" };

export default function TestResearchPage() {
  const projects = getAllResearchProjects();

  return (
    <main style={{ fontFamily: "monospace", maxWidth: 800, margin: "2rem auto", padding: "0 1rem" }}>
      <p><Link href="/test">← Test routes</Link></p>
      <h1 style={{ fontSize: "1.1rem" }}>Research projects ({projects.length})</h1>

      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
        <thead>
          <tr style={{ textAlign: "left", borderBottom: "1px solid #ccc" }}>
            <th style={{ padding: "4px 8px" }}>Slug</th>
            <th style={{ padding: "4px 8px" }}>Title</th>
            <th style={{ padding: "4px 8px" }}>Period</th>
            <th style={{ padding: "4px 8px" }}>Status</th>
            <th style={{ padding: "4px 8px" }}>Featured</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((p) => (
            <tr key={p.slug} style={{ borderBottom: "1px solid #eee" }}>
              <td style={{ padding: "4px 8px", color: "#888" }}>{p.slug}</td>
              <td style={{ padding: "4px 8px" }}>{p.title}</td>
              <td style={{ padding: "4px 8px", whiteSpace: "nowrap", color: "#888" }}>
                {p.period.start} – {p.period.end ?? "present"}
              </td>
              <td style={{ padding: "4px 8px", color: "#888" }}>{p.status}</td>
              <td style={{ padding: "4px 8px", color: "#888" }}>{p.featured ? "yes" : "–"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
