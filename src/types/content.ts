// ============================================================
// Content type definitions for all MDX/JSON content sources
//
// NOTE: These types are the authoritative hand-written definitions
// until the json-schema-to-typescript generation pipeline is set up.
// Once configured, this file will be generated from src/schemas/*.schema.json
// and should not be edited manually.
// See: package.json scripts.generate:types
// ============================================================

// ------------------------------------------------------------
// Shared primitives
// ------------------------------------------------------------

export interface Period {
  start: string  // ISO year "YYYY" or month "YYYY-MM"
  end: string | null  // null = ongoing
}

export interface Coordinates {
  lat: number
  lng: number
}

export interface MediaAssets {
  cover?: string       // path relative to /public or absolute URL
  gallery?: string     // Piwigo album name/slug
  slides?: string      // Speakerdeck URL
}

export interface ProjectLinks {
  github?: string[]
  linkedin?: string[]
  external?: string[]
  live?: string        // publicly accessible deployment
}

// ------------------------------------------------------------
// Position
// Represents an employment role, PhD, or contract.
// One position can have many projects.
// ------------------------------------------------------------

export type PositionType =
  | 'employment'
  | 'contract'
  | 'academic'
  | 'freelance'
  | 'phd'
  | 'voluntary'

export interface PositionSite {
  institution: string
  location?: string
  period: Period
}

export interface Position {
  slug: string
  title: string
  organisation: string
  department?: string
  location: string
  coordinates?: Coordinates
  period: Period
  type: PositionType
  tags: string[]
  description?: string
  sites?: PositionSite[]
}

// ------------------------------------------------------------
// Project — base shape shared by research and engineering
// ------------------------------------------------------------

export type ProjectType = 'research' | 'engineering'

export type ProjectStatus = 'completed' | 'ongoing' | 'archived'

/**
 * public      — full detail page, all artefacts available
 * proprietary — detail page exists, narrative visible, no artefacts
 *               (commercial work; design/code belongs to employer)
 * redacted    — card only, no detail page
 */
export type ProjectVisibility = 'public' | 'proprietary' | 'redacted'

export interface ProjectBase {
  slug: string
  title: string
  abbr?: string                // short label for cards/nav
  type: ProjectType
  status: ProjectStatus
  visibility: ProjectVisibility
  featured: boolean            // float to top of section listing
  position: string             // slug ref → Position
  institution?: string         // override if different from position
  location?: string            // override if different from position
  period: Period
  links: ProjectLinks
  media?: MediaAssets
  tags: string[]
  description?: string         // 1–2 sentence summary for card (Level 1) display
  publications?: string        // Zotero tag (lowercase, no nvl. prefix) for this project's papers
}

// ------------------------------------------------------------
// Research project
// Legacy academic R&D work — AIED, learning technologies.
// Content is frozen once designed.
// Rendering: SSG
// ------------------------------------------------------------

export interface ResearchProject extends ProjectBase {
  type: 'research'
  funding?: string             // e.g. "EPSRC", "JISC", "NIHR"
  coordinates?: Coordinates    // inherits from position if omitted
}

// ------------------------------------------------------------
// Engineering project
// Commercial and open-source frontend/UX work.
// Rendering: SSG (public) or omitted (proprietary/redacted)
// ------------------------------------------------------------

export interface EngineeringProject extends ProjectBase {
  type: 'engineering'
  client?: string              // omit or redact for NDA work
  role_title?: string          // specific role if different from position title
  highlights?: string[]        // 3–5 bullet points for card view
  artefacts?: string[]         // Figma links, screenshots, design files
}

export type Project = ResearchProject | EngineeringProject

// ------------------------------------------------------------
// Publication
// Sourced from Zotero API — not stored as local content files.
// This type describes the normalised shape after API transformation.
// Rendering: ISR (on-demand revalidation)
// ------------------------------------------------------------

export type PublicationType =
  | 'conferencePaper'
  | 'journalArticle'
  | 'bookChapter'
  | 'thesis'
  | 'report'
  | 'patent'

export interface Publication {
  key: string                  // Zotero item key
  type: PublicationType
  title: string
  authors: string[]
  year: number
  venue?: string               // conference or journal name
  abstract?: string
  doi?: string
  pdf?: string                 // direct URL if available
  tags: string[]               // includes project slugs for cross-linking
}

// ------------------------------------------------------------
// ADR (Architecture Decision Record)
// Read directly from .docs/adr/ — not copied to src/content.
// Exposed on the site as part of engineering portfolio.
// Rendering: SSG
// ------------------------------------------------------------

export type ADRStatus =
  | 'proposed'
  | 'decided'
  | 'superseded'
  | 'deprecated'

export interface ADR {
  slug: string
  number: number
  title: string
  status: ADRStatus
  date: string                 // ISO date "YYYY-MM-DD"
  tags: string[]
  supersedes?: number[]        // ADR numbers this replaces
  superseded_by?: number       // ADR number that replaces this
}

// ------------------------------------------------------------
// CV / Timeline
// Structured data only — no MDX prose.
// Rendering: ISR (on-demand revalidation)
// ------------------------------------------------------------

export interface SkillGroup {
  id: string
  label: string
  skills: string[]
}

export interface EducationRecord {
  degree: string
  institution: string
  location: string
  period: { start: string; end: string }
  description?: string
}

export interface CVData {
  positions: Position[]
  education: EducationRecord[]
  skills: SkillGroup[]
}
