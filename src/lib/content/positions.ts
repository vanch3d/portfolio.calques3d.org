/**
 * Positions content layer
 *
 * Reads and validates position JSON files from src/content/positions/.
 * Server-side only — uses Node.js fs module.
 * Rendering: SSG (positions are stable data, built once)
 */

import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import type { Position } from "@/types/content";

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
