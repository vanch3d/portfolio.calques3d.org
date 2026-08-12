/**
 * BackLink — standard page-navigation back link for detail pages.
 *
 * Renders a <nav> landmark (required by WCAG for navigation regions)
 * with a single anchor. The nav aria-label distinguishes it from the
 * site-wide header navigation so screen readers can identify it.
 *
 * Usage: any detail page that needs a "← Section" back link.
 * i18n: caller resolves translations and passes plain strings.
 */

export function BackLink({
  href,
  label,
  navLabel,
}: {
  href: string;
  label: string;
  navLabel: string;
}) {
  return (
    <nav aria-label={navLabel}>
      <a
        href={href}
        className="text-sm text-foreground-secondary hover:text-foreground"
      >
        {label}
      </a>
    </nav>
  );
}
