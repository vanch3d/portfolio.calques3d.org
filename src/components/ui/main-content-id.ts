/**
 * The id of every page's <main> element — the SkipNav target.
 * Lives in its own module (not in SkipNav.tsx) so Server Components can import
 * the string value; a constant exported from a 'use client' file reaches them
 * as an opaque client reference.
 */
export const MAIN_CONTENT_ID = 'main-content'
