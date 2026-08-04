/**
 * /cv — Career timeline
 *
 * Rendering: ISR (on-demand revalidation)
 * Content changes when career changes — rebuild triggered manually.
 */

import { getAllPositions } from "@/lib/content";

export const revalidate = false; // on-demand only

export const metadata = {
  title: "CV",
};

export default function CVPage() {
  const positions = getAllPositions();

  return (
    <main style={{ fontFamily: "sans-serif", maxWidth: 700, margin: "2rem auto", padding: "0 1rem" }}>
      <nav><a href="/">← Home</a></nav>
      <h1>Career Timeline</h1>
      <p>{positions.length} positions</p>

      <ol style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        {positions.map((pos) => (
          <li key={pos.slug} style={{ borderLeft: "3px solid #ccc", paddingLeft: "1rem" }}>
            <p style={{ margin: 0, fontSize: "0.85rem", color: "#666" }}>
              {pos.period.start} – {pos.period.end ?? "present"}
              {" · "}
              <span style={{ textTransform: "uppercase", fontSize: "0.75rem" }}>{pos.type}</span>
            </p>
            <strong>{pos.title}</strong>
            <p style={{ margin: "0.25rem 0 0" }}>{pos.organisation}</p>
            {pos.department && <p style={{ margin: 0, color: "#555" }}>{pos.department}</p>}
            <p style={{ margin: 0, color: "#777", fontSize: "0.85rem" }}>{pos.location}</p>
          </li>
        ))}
      </ol>
    </main>
  );
}
