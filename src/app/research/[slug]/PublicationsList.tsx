/**
 * Re-exports from the canonical location.
 * The publications listing component lives alongside the publications page;
 * the research project detail route imports it from here for convenience.
 */
export {
  PublicationsList,
  type PublicationsListLabels,
} from "../publications/PublicationsList";
