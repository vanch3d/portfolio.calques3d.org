/**
 * /cv — Career timeline
 *
 * Rendering: dynamic (next-intl uses headers() internally, which opts the page
 * out of static generation — `revalidate = false` would conflict and cause a
 * 404 in production). Caching is handled by Vercel's CDN on the edge.
 * Content changes trigger a manual redeploy.
 */

import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getAllPositions } from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("CVPage");
  return {
    title: t("heading"),
    description: t("description"),
  };
}

export default async function CVPage() {
  const t = await getTranslations("CVPage");
  const positions = getAllPositions();

  return (
    <div style={{ fontFamily: "sans-serif", maxWidth: 700, margin: "2rem auto", padding: "0 1rem" }}>
      <nav aria-label={t("back_nav_label")}><a href="/">{t("back")}</a></nav>
      <h1>{t("heading")}</h1>
      <p>{t("positions_count", { count: positions.length })}</p>

      <ol style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        {positions.map((pos) => (
          <li key={pos.slug} style={{ borderLeft: "3px solid #ccc", paddingLeft: "1rem" }}>
            <p style={{ margin: 0, fontSize: "0.85rem" }}>
              {pos.period.start} – {pos.period.end ?? t("ongoing")}
              {" · "}
              <span style={{ textTransform: "uppercase", fontSize: "0.75rem" }}>{pos.type}</span>
            </p>
            <strong>{pos.title}</strong>
            <p style={{ margin: "0.25rem 0 0" }}>{pos.organisation}</p>
            {pos.department && <p style={{ margin: 0 }}>{pos.department}</p>}
            <p style={{ margin: 0, fontSize: "0.85rem" }}>{pos.location}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
