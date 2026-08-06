/**
 * Navigation active-link resolution.
 *
 * Determines which nav link is "active" for a given pathname using a
 * longest-prefix-match strategy: the link whose href is the most specific
 * (longest) match for the current pathname wins.
 *
 * This correctly handles cases where one nav link is a sub-path of another:
 *   navLinks: ["/research", "/research/publications"]
 *   pathname:  "/research/publications"
 *   → "/research/publications" wins (longer match), "/research" is NOT active
 *
 * A link matches if:
 *   - exact: pathname === href
 *   - prefix: pathname starts with href + "/" (avoids /research matching /research-extra)
 *   - root only: "/" matches only "/"
 */
export function activeNavHref(
  pathname: string,
  links: readonly { href: string }[],
): string | undefined {
  const matches = links.filter(({ href }) =>
    href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(href + "/"),
  );
  return matches.sort((a, b) => b.href.length - a.href.length)[0]?.href;
}
