/**
 * Content layer — public API
 * Re-exports all content readers for use in Server Components and pages.
 */

export {
  getAllPositions,
  getPositionBySlug,
  getPositionMap,
} from "./positions";

export {
  getAllResearchProjects,
  getResearchProjectBySlug,
  getResearchSlugs,
  importResearchMDX,
} from "./research";

export {
  getAllEngineeringProjects,
  getEngineeringProjectBySlug,
  getEngineeringSlugs,
  importEngineeringMDX,
} from "./engineering";
