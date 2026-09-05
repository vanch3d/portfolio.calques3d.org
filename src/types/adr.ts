/**
 * Public-facing type aliases for the ADR and Insight content layer.
 *
 * These re-export the canonical types from src/lib/content/ for use in
 * components that need type annotations without importing from the content layer.
 * The content layer is server-only; these types are safe to import anywhere.
 */

export type { AdrMeta, Adr, AdrStatus } from "@/lib/content/adr";
export type { InsightMeta, Insight } from "@/lib/content/insights";

/**
 * AdrEntry — full ADR record (meta + body), as used in detail pages.
 */
export type AdrEntry = import("@/lib/content/adr").Adr;

/**
 * InsightEntry — full Insight record (meta + body), as used in detail pages.
 */
export type InsightEntry = import("@/lib/content/insights").Insight;
