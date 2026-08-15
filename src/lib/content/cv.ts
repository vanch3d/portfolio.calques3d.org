/**
 * CV content layer
 *
 * Reads skills and education JSON from src/content/cv/.
 * Server-side only — uses Node.js fs module.
 * Rendering: ISR (changes with career)
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { SkillGroup, EducationRecord } from "@/types/content";

const CV_DIR = join(process.cwd(), "src/content/cv");

export function getSkills(): SkillGroup[] {
  const raw = readFileSync(join(CV_DIR, "skills.json"), "utf-8");
  return JSON.parse(raw) as SkillGroup[];
}

export function getEducation(): EducationRecord[] {
  const raw = readFileSync(join(CV_DIR, "education.json"), "utf-8");
  return JSON.parse(raw) as EducationRecord[];
}
