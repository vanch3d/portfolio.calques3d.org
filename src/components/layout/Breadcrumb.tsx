/**
 * Breadcrumb — structured navigation trail for all pages.
 *
 * Replaces the simpler BackLink. Used on both listing pages (Home / Engineering)
 * and detail pages (Home / Engineering / HiveMQ Edge), giving every page a
 * consistent navigation element above the h1 so that h1 always sits at the
 * same vertical position regardless of page depth.
 *
 * Semantics:
 *   - <nav aria-label={navLabel}> — distinguishable navigation landmark
 *   - <ol> — ordered list (breadcrumb order is meaningful)
 *   - aria-current="page" on the last item — marks the current page
 *   - aria-hidden on separators — visual decoration, not content
 *
 * i18n: caller resolves all labels and passes them as plain strings.
 * navLabel typically comes from Navigation.breadcrumb_nav_label.
 * Item labels come from the page's own namespace or from Navigation
 * (section names like "Research", "Engineering" are already there).
 */

export interface BreadcrumbItem {
  label: string;
  href?: string; // omit for the current page item
}

export function Breadcrumb({
  items,
  navLabel,
}: {
  items: BreadcrumbItem[];
  navLabel: string;
}) {
  return (
    <nav aria-label={navLabel}>
      <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-sm">
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-1.5">
            {index > 0 && (
              <span
                aria-hidden="true"
                className="select-none text-foreground-secondary"
              >
                /
              </span>
            )}
            {item.href ? (
              <a
                href={item.href}
                className="text-accent-hover hover:underline"
              >
                {item.label}
              </a>
            ) : (
              <span aria-current="page" className="text-foreground">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
