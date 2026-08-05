"use client";

/**
 * SiteHeader
 *
 * Primary navigation shell. Desktop: horizontal nav links + dark mode toggle.
 * Mobile: hamburger button → accessible full-screen overlay (Radix Dialog).
 *
 * Labels are resolved by the parent Server Component (layout.tsx) and passed
 * as a typed prop — keeps this component synchronous for Cypress CT.
 * See ADR 006 (i18n), ADR 007 (accessibility).
 */

import Link from "next/link";
import { usePathname } from "next/navigation";
import * as Dialog from "@radix-ui/react-dialog";
import { useTheme } from "./ThemeProvider";

export interface SiteHeaderLabels {
  research: string;
  engineering: string;
  publications: string;
  cv: string;
  lab: string;
  openMenu: string;
  closeMenu: string;
  toggleTheme: string;
  siteName: string;
}

const navLinks = [
  { key: "research" as const, href: "/research" },
  { key: "engineering" as const, href: "/engineering" },
  { key: "publications" as const, href: "/research/publications" },
  { key: "cv" as const, href: "/cv" },
  { key: "lab" as const, href: "/lab" },
] satisfies { key: keyof Omit<SiteHeaderLabels, "openMenu" | "closeMenu" | "toggleTheme" | "siteName">; href: string }[];

export function SiteHeader({ labels }: { labels: SiteHeaderLabels }) {
  const pathname = usePathname();
  const { resolvedMode, setColorMode, colorMode } = useTheme();

  function toggleTheme() {
    if (colorMode === "system") {
      setColorMode(resolvedMode === "dark" ? "light" : "dark");
    } else {
      setColorMode("system");
    }
  }

  const isActive = (href: string) =>
    pathname ? (href === "/" ? pathname === "/" : pathname.startsWith(href)) : false;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-surface/90 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-screen-xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Wordmark */}
        <Link
          href="/"
          className="text-sm font-semibold tracking-tight text-foreground hover:text-accent-hover transition-colors"
        >
          {labels.siteName}
        </Link>

        {/* Desktop nav */}
        <nav aria-label="Primary navigation" className="hidden md:flex items-center gap-1">
          {navLinks.map(({ key, href }) => (
            <Link
              key={key}
              href={href}
              aria-current={isActive(href) ? "page" : undefined}
              className={[
                "relative px-3 py-1.5 text-sm transition-colors rounded-sm",
                "hover:text-foreground focus-visible:text-foreground",
                isActive(href)
                  ? "text-foreground font-medium after:absolute after:inset-x-3 after:bottom-0 after:h-0.5 after:rounded-full after:bg-accent"
                  : "text-foreground-secondary",
              ].join(" ")}
            >
              {labels[key]}
            </Link>
          ))}

          {/* Dark mode toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={labels.toggleTheme}
            className="ml-2 flex h-8 w-8 items-center justify-center rounded-sm text-foreground-secondary hover:text-foreground hover:bg-surface-raised transition-colors"
          >
            {resolvedMode === "dark" ? <SunIcon /> : <MoonIcon />}
          </button>
        </nav>

        {/* Mobile: hamburger + dialog */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={labels.toggleTheme}
            className="flex h-8 w-8 items-center justify-center rounded-sm text-foreground-secondary hover:text-foreground transition-colors"
          >
            {resolvedMode === "dark" ? <SunIcon /> : <MoonIcon />}
          </button>

          <Dialog.Root>
            <Dialog.Trigger asChild>
              <button
                type="button"
                aria-label={labels.openMenu}
                className="flex h-8 w-8 items-center justify-center rounded-sm text-foreground-secondary hover:text-foreground transition-colors"
              >
                <HamburgerIcon />
              </button>
            </Dialog.Trigger>

            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
              <Dialog.Content
                aria-describedby={undefined}
                className="fixed inset-y-0 right-0 z-50 w-full max-w-xs bg-surface shadow-xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right"
              >
                <div className="flex h-14 items-center justify-between border-b border-border px-4">
                  <Dialog.Title className="text-sm font-semibold text-foreground">
                    {labels.siteName}
                  </Dialog.Title>
                  <Dialog.Close asChild>
                    <button
                      type="button"
                      aria-label={labels.closeMenu}
                      className="flex h-8 w-8 items-center justify-center rounded-sm text-foreground-secondary hover:text-foreground transition-colors"
                    >
                      <CloseIcon />
                    </button>
                  </Dialog.Close>
                </div>

                <nav aria-label="Mobile navigation" className="flex flex-col gap-1 p-4">
                  {navLinks.map(({ key, href }) => (
                    <Dialog.Close asChild key={key}>
                      <Link
                        href={href}
                        aria-current={isActive(href) ? "page" : undefined}
                        className={[
                          "rounded-sm px-3 py-2 text-sm transition-colors",
                          isActive(href)
                            ? "bg-accent-subtle text-foreground font-medium border-l-2 border-accent"
                            : "text-foreground-secondary hover:text-foreground hover:bg-surface-raised",
                        ].join(" ")}
                      >
                        {labels[key]}
                      </Link>
                    </Dialog.Close>
                  ))}
                </nav>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      </div>
    </header>
  );
}

/* ─── Icons (inline SVG — no icon library dependency) ───────────────────── */

function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  );
}

function HamburgerIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="4" y1="6" x2="20" y2="6" />
      <line x1="4" y1="12" x2="20" y2="12" />
      <line x1="4" y1="18" x2="20" y2="18" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}
