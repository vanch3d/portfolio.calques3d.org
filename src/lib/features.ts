/**
 * Feature flag definitions.
 *
 * Each flag has:
 *  - key:         localStorage / env var identifier
 *  - label:       human-readable name (shown in /lab/features)
 *  - description: what it controls
 *  - defaultEnabled: baseline state (can be overridden by env var or localStorage)
 *
 * Runtime overrides (via /lab/features) are stored in localStorage under
 * `feature:<key>` and take precedence over everything else.
 *
 * Build-time overrides: NEXT_PUBLIC_FEATURE_<KEY_UPPERCASE>=true|false
 */

export interface FeatureFlagDefinition {
  key: string;
  label: string;
  description: string;
  defaultEnabled: boolean;
}

export const FEATURE_FLAGS = [
  {
    key: "pdf-viewer",
    label: "PDF Viewer",
    description:
      "Enables an in-page PDF viewer on publication cards (react-pdf, client-side). " +
      "When disabled, only the download link is shown.",
    defaultEnabled: true, // viewer is the primary UX on publication detail pages
  },
] as const satisfies readonly FeatureFlagDefinition[];

export type FeatureFlagKey = (typeof FEATURE_FLAGS)[number]["key"];

/**
 * Resolves the build-time default for a flag, applying NEXT_PUBLIC_FEATURE_*
 * env var overrides. Server-safe — does not read localStorage.
 */
export function getServerFlagDefault(key: FeatureFlagKey): boolean {
  const envKey = `NEXT_PUBLIC_FEATURE_${key.toUpperCase().replace(/-/g, "_")}`;
  const envVal = process.env[envKey];
  if (envVal === "true") return true;
  if (envVal === "false") return false;
  return FEATURE_FLAGS.find((f) => f.key === key)?.defaultEnabled ?? false;
}

export const FEATURE_STORAGE_PREFIX = "feature:";
