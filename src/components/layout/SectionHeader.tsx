/**
 * SectionHeader — standard h1 + tagline for every top-level listing page.
 *
 * Usage: Research listing, Engineering listing, Publications, CV heading.
 * Never used on detail pages (those have a project-specific h1 in their
 * own header component, paired with a BackLink above it).
 *
 * i18n: caller resolves translations and passes plain strings.
 */

export function SectionHeader({
  heading,
  tagline,
}: {
  heading: string;
  tagline?: string;
}) {
  return (
    <header>
      <h1 className="text-3xl font-semibold tracking-tight text-foreground">
        {heading}
      </h1>
      {tagline && (
        <p className="mt-4 text-foreground-secondary">{tagline}</p>
      )}
    </header>
  );
}
