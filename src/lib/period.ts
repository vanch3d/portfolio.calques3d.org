/**
 * Period utilities
 *
 * Pure functions for working with period date strings used across content types.
 * Period dates follow ISO conventions: "YYYY" (year only) or "YYYY-MM" (month precision).
 */

/**
 * Extracts the 4-digit year from a period date string.
 * Accepts "YYYY", "YYYY-MM", or "YYYY-MM-DD".
 *
 * @throws {Error} if the string does not start with a 4-digit year
 */
export function extractYear(dateString: string): string {
  const year = dateString.substring(0, 4)
  if (!/^\d{4}$/.test(year)) {
    throw new Error(`Invalid period date string: "${dateString}"`)
  }
  return year
}

/**
 * Formats a period as "YYYY–YYYY" or "YYYY–{presentLabel}".
 *
 * @param start       - period start string ("YYYY" or "YYYY-MM")
 * @param end         - period end string, or null for ongoing
 * @param presentLabel - localised label for an ongoing period, e.g. "present"
 */
export function formatPeriod(start: string, end: string | null, presentLabel: string): string {
  return `${extractYear(start)}–${end ? extractYear(end) : presentLabel}`
}
