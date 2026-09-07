import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

type NavLinkProps = {
  href: ComponentProps<typeof Link>["href"];
  className?: string;
  children: React.ReactNode;
};

/**
 * NavLink — inline navigation link atom.
 *
 * Bakes in the full nav-link style contract:
 *   - label class (Space Mono, uppercase, ink-secondary)
 *   - nav-link utility (always-visible ghost underline, darkens on hover)
 *   - hover:text-ink (text colour shift on hover)
 *   - transition-colors (smooth colour + underline colour animation)
 *
 * Use for: breadcrumbs, section nav, standalone "→" navigation links.
 * Do NOT use for block/tile links — those are styled directly with flex layouts.
 */
export function NavLink({ href, className, children }: NavLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "label nav-link text-ink-secondary hover:text-ink transition-colors",
        className
      )}
    >
      {children}
    </Link>
  );
}
