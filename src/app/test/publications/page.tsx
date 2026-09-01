import Link from "next/link";
import { getAllPublications } from "@/lib/api";
import type { Publication } from "@/types/content";

export const metadata = { title: "Test — Publications" };

// Always fetch fresh data — this is a dev test route, not a production page.
// Requires ZOTERO_* env vars available at runtime (Vercel: always true).
export const dynamic = "force-dynamic";

export default async function TestPublicationsPage() {
  let publications: Publication[] = [];
  let error: string | null = null;

  try {
    publications = await getAllPublications();
  } catch (e) {
    error = e instanceof Error ? e.message : String(e);
  }

  return (
    <main style={{ fontFamily: "monospace", maxWidth: 900, margin: "2rem auto", padding: "0 1rem" }}>
      <p><Link href="/test">← Test routes</Link></p>
      <h1 style={{ fontSize: "1.1rem" }}>
        Publications {error ? "(error)" : `(${publications.length})`}
      </h1>

      {error && (
        <pre style={{ color: "red", fontSize: "0.8rem", background: "#fff0f0", padding: "1rem" }}>
          {error}
        </pre>
      )}

      {!error && (
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8rem" }}>
          <thead>
            <tr style={{ textAlign: "left", borderBottom: "1px solid #ccc" }}>
              <th style={{ padding: "4px 8px" }}>Year</th>
              <th style={{ padding: "4px 8px" }}>Type</th>
              <th style={{ padding: "4px 8px" }}>Title</th>
              <th style={{ padding: "4px 8px" }}>Authors</th>
              <th style={{ padding: "4px 8px" }}>Tags</th>
            </tr>
          </thead>
          <tbody>
            {publications.map((pub) => (
              <tr key={pub.key} style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ padding: "4px 8px", color: "#888" }}>{pub.year}</td>
                <td style={{ padding: "4px 8px", color: "#888", whiteSpace: "nowrap" }}>{pub.type}</td>
                <td style={{ padding: "4px 8px" }}>{pub.title}</td>
                <td style={{ padding: "4px 8px", color: "#888" }}>{pub.authors.slice(0, 2).join(", ")}{pub.authors.length > 2 ? " et al." : ""}</td>
                <td style={{ padding: "4px 8px", color: "#888" }}>{pub.tags.join(", ")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
