import Link from "next/link";
import { getAllCaseStudies } from "@/lib/content";

export const metadata = { title: "Test — Case studies" };

export default function TestCaseStudiesPage() {
  const caseStudies = getAllCaseStudies();

  return (
    <main style={{ fontFamily: "monospace", maxWidth: 900, margin: "2rem auto", padding: "0 1rem" }}>
      <p><Link href="/test">← Test routes</Link></p>
      <h1 style={{ fontSize: "1.1rem" }}>Case studies ({caseStudies.length})</h1>

      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
        <thead>
          <tr style={{ textAlign: "left", borderBottom: "1px solid #ccc" }}>
            <th style={{ padding: "4px 8px" }}>Project</th>
            <th style={{ padding: "4px 8px" }}>Slug</th>
            <th style={{ padding: "4px 8px" }}>Title</th>
            <th style={{ padding: "4px 8px" }}>Status</th>
            <th style={{ padding: "4px 8px" }}>Featured</th>
            <th style={{ padding: "4px 8px" }}>Render</th>
          </tr>
        </thead>
        <tbody>
          {caseStudies.map((cs) => (
            <tr key={`${cs.project}--${cs.slug}`} style={{ borderBottom: "1px solid #eee" }}>
              <td style={{ padding: "4px 8px", color: "#888" }}>{cs.project}</td>
              <td style={{ padding: "4px 8px", color: "#888" }}>{cs.slug}</td>
              <td style={{ padding: "4px 8px" }}>{cs.title}</td>
              <td style={{ padding: "4px 8px", color: "#888" }}>{cs.status}</td>
              <td style={{ padding: "4px 8px", color: "#888" }}>{cs.featured ? "yes" : "–"}</td>
              <td style={{ padding: "4px 8px" }}>
                <Link href={`/test/case-studies/${cs.project}/${cs.slug}`}>view →</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
