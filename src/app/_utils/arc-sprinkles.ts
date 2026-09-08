/**
 * Arc sprinkle utilities
 *
 * Builds ArcSprinkleContent from project metadata for the CareerArc SVG
 * annotation slots. The SVG geometry for each slot is a static design
 * constant in CareerArc.tsx; only the display text is produced here.
 *
 * pickSprinkle selects a candidate project for a slot by filtering on
 * idealYear (the year the slot visually annotates on the arc). Featured
 * projects are preferred; within a tier, one is chosen at random, so
 * successive builds may surface different projects from the same era.
 */

import type { ResearchProject, EngineeringProject } from "@/types/content";
import { formatPeriod, extractYear } from "@/lib/period";
import type { ArcSprinkleContent } from "@/app/_components/CareerArc";

type Project = ResearchProject | EngineeringProject;

/**
 * Converts a project's metadata into arc sprinkle display content.
 * Title: abbr (or full title) · formatted period.
 * Subtitle: first three tags joined by " · ".
 */
export function buildSprinkle(project: Project, present: string): ArcSprinkleContent {
  return {
    title: `${project.abbr ?? project.title} · ${formatPeriod(project.period.start, project.period.end, present)}`,
    subtitle: project.tags.slice(0, 3).join(" · "),
  };
}

/**
 * Selects a project for an arc annotation slot and returns its sprinkle content.
 *
 * A candidate is any project whose period contains idealYear:
 *   extractYear(period.start) ≤ idealYear ≤ extractYear(period.end ?? "9999")
 *
 * Selection: featured candidates are preferred; within each tier, one is
 * chosen at random so builds may highlight different projects from the same era.
 *
 * Returns null when no project overlaps idealYear.
 */
export function pickSprinkle(
  projects: Project[],
  idealYear: string,
  present: string,
): ArcSprinkleContent | null {
  const candidates = projects.filter((p) => {
    const start = extractYear(p.period.start);
    const end = p.period.end ? extractYear(p.period.end) : "9999";
    return start <= idealYear && idealYear <= end;
  });

  if (candidates.length === 0) return null;

  const featured = candidates.filter((p) => p.featured);
  const pool = featured.length > 0 ? featured : candidates;
  const picked = pool[Math.floor(Math.random() * pool.length)];

  return buildSprinkle(picked, present);
}
