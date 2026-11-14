/**
 * Feature flag registry — typed keys, code defaults, build-time env override.
 *
 * Override a flag by setting NEXT_PUBLIC_FLAG_<NAME>=true|false (also 1|0|on|off)
 * before `next build`/`next dev`. Each env var is read through a literal
 * `process.env.NEXT_PUBLIC_…` access because Next only inlines literal reads
 * into client bundles; do not replace `readEnv` with a dynamic lookup.
 *
 * Usable from Server and Client Components alike. Decisions: ADR 028.
 */

type FlagDefinition = {
  /** Value used when the env var is unset or unparseable. */
  default: boolean
  description: string
}

export const FLAGS = {
  chapterRail: {
    default: true,
    description:
      'Sticky chapter rail on case-study chapter pages (off: plain "Chapter n of N" label).',
  },
} as const satisfies Record<string, FlagDefinition>

export type FlagKey = keyof typeof FLAGS

function readEnv(key: FlagKey): string | undefined {
  switch (key) {
    case 'chapterRail':
      return process.env.NEXT_PUBLIC_FLAG_CHAPTER_RAIL
  }
}

/** Parses an env string to a boolean; undefined for anything unrecognised. */
export function parseFlagValue(raw: string | undefined): boolean | undefined {
  if (raw === undefined) return undefined
  const value = raw.trim().toLowerCase()
  if (['true', '1', 'on', 'yes'].includes(value)) return true
  if (['false', '0', 'off', 'no'].includes(value)) return false
  return undefined
}

export function isFlagEnabled(key: FlagKey): boolean {
  return parseFlagValue(readEnv(key)) ?? FLAGS[key].default
}
