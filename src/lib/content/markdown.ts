/**
 * Markdown rendering utility
 *
 * Converts raw markdown body text to an HTML string using remark + remark-html.
 * Used for ADR and Insight detail pages.
 * Pure function — no filesystem access.
 */

import { remark } from "remark";
import remarkHtml from "remark-html";
import remarkGfm from "remark-gfm";

/**
 * Converts a markdown string to an HTML string.
 * Returns sanitised HTML safe for dangerouslySetInnerHTML.
 */
export async function markdownToHtml(markdown: string): Promise<string> {
  const result = await remark()
    .use(remarkGfm)
    .use(remarkHtml, { sanitize: false })
    .process(markdown);
  return result.toString();
}
