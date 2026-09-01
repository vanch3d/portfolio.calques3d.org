/**
 * UI formatting utilities — shared across components.
 *
 * Pure string functions, no React dependency.
 * Safe to import in both Server Components and CT specs.
 */

export const DOT = " · ";
export const DASH = " – ";

/**
 * Joins non-empty parts with a separator, silently dropping null, undefined,
 * and empty string values. Defaults to DOT separator.
 */
export function joinParts(
  parts: (string | null | undefined)[],
  sep: string = DOT
): string {
  return parts.filter((p): p is string => Boolean(p)).join(sep);
}

/**
 * Formats a date range as "start – end" or "start – ongoingLabel" when end
 * is absent. The caller is responsible for slicing to the desired precision
 * (e.g. YYYY-MM vs YYYY) before passing.
 */
export function formatPeriod(
  start: string,
  end: string | null | undefined,
  ongoingLabel: string
): string {
  return `${start}${DASH}${end ?? ongoingLabel}`;
}
