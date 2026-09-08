/**
 * Positions content layer
 *
 * Reads and validates position JSON files from src/content/positions/.
 * Server-side only — uses Node.js fs module.
 * Rendering: SSG (positions are stable data, built once)
 */

import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import type { Position, PositionType, ResearchPositionType, EngineeringPositionType } from "@/types/content";

const POSITIONS_DIR = join(process.cwd(), "src/content/positions");

function readPosition(filename: string): Position {
  const raw = readFileSync(join(POSITIONS_DIR, filename), "utf-8");
  return JSON.parse(raw) as Position;
}

/**
 * Returns all positions, sorted chronologically (most recent first).
 */
export function getAllPositions(): Position[] {
  const files = readdirSync(POSITIONS_DIR).filter((f) => f.endsWith(".json"));
  const positions = files.map((f) => readPosition(f));

  return positions.sort((a, b) => {
    const aEnd = a.period.end ?? "9999";
    const bEnd = b.period.end ?? "9999";
    if (bEnd !== aEnd) return bEnd.localeCompare(aEnd);
    return b.period.start.localeCompare(a.period.start);
  });
}

/**
 * Returns a single position by slug, or null if not found.
 */
export function getPositionBySlug(slug: string): Position | null {
  try {
    return readPosition(`${slug}.json`);
  } catch {
    return null;
  }
}

/**
 * Returns a map of slug → Position for O(1) lookup when cross-referencing
 * from project frontmatter.
 */
export function getPositionMap(): Map<string, Position> {
  return new Map(getAllPositions().map((p) => [p.slug, p]));
}

// Typed as Set<PositionType> so .has(p.type) needs no cast at call sites.
// satisfies anchors the literal initialiser to the correct sub-type, preventing
// accidental inclusion of the wrong era's types.
const RESEARCH_POSITION_TYPES = new Set<PositionType>(
  ['academic', 'phd'] satisfies ResearchPositionType[]
);
const ENGINEERING_POSITION_TYPES = new Set<PositionType>(
  ['employment', 'contract', 'freelance', 'voluntary'] satisfies EngineeringPositionType[]
);

/**
 * Returns positions that belong to the research era (type academic | phd),
 * sorted most-recent-first (same order as getAllPositions).
 */
export function getResearchPositions(): Array<Position & { type: ResearchPositionType }> {
  return getAllPositions().filter(
    (p): p is Position & { type: ResearchPositionType } => RESEARCH_POSITION_TYPES.has(p.type)
  );
}

/**
 * Returns positions that belong to the engineering era (type employment | contract | freelance | voluntary),
 * sorted most-recent-first.
 */
export function getEngineeringPositions(): Array<Position & { type: EngineeringPositionType }> {
  return getAllPositions().filter(
    (p): p is Position & { type: EngineeringPositionType } => ENGINEERING_POSITION_TYPES.has(p.type)
  );
}
