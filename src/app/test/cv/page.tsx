import Link from "next/link";
import { getAllPositions } from "@/lib/content";
import type { Position } from "@/types/content";

export const metadata = { title: "Test — CV / Positions" };

function formatPeriod(p: Position["period"]) {
  return p.end ? `${p.start} – ${p.end}` : `${p.start} – present`;
}

export default function TestCvPage() {
  const positions = getAllPositions();

  return (
    <main style={{ fontFamily: "var(--font-label)", maxWidth: 800, margin: "2rem auto", padding: "0 1rem" }}>
      <p><Link href="/test">← Test routes</Link></p>
      <h1 style={{ fontSize: "1.1rem" }}>Positions ({positions.length})</h1>

      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
        <thead>
          <tr style={{ textAlign: "left", borderBottom: "var(--line-medium) solid var(--color-ink-ghost)" }}>
            <th style={{ padding: "4px 8px" }}>Period</th>
            <th style={{ padding: "4px 8px" }}>Title</th>
            <th style={{ padding: "4px 8px" }}>Organisation</th>
            <th style={{ padding: "4px 8px" }}>Type</th>
          </tr>
        </thead>
        <tbody>
          {positions.map((pos) => (
            <tr key={pos.slug} style={{ borderBottom: "var(--line-ghost) solid var(--color-ink-ghost)" }}>
              <td style={{ padding: "4px 8px", whiteSpace: "nowrap", color: "var(--color-ink-secondary)" }}>
                {formatPeriod(pos.period)}
              </td>
              <td style={{ padding: "4px 8px" }}>{pos.title}</td>
              <td style={{ padding: "4px 8px" }}>{pos.organisation}</td>
              <td style={{ padding: "4px 8px", color: "var(--color-ink-secondary)" }}>{pos.type}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
