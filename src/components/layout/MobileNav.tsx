"use client";

import * as React from "react";
import { Drawer } from "@base-ui/react/drawer";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { NavLink } from "./NavigationBar";

// ── Hamburger icon ────────────────────────────────────────────────────────

function HamburgerIcon({ open }: { open: boolean }) {
  return (
    <svg
      aria-hidden="true"
      className="size-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      viewBox="0 0 24 24"
    >
      {open ? (
        // X / close
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
      ) : (
        // Hamburger
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
      )}
    </svg>
  );
}

// ── MobileNav ─────────────────────────────────────────────────────────────

export interface MobileNavProps {
  links: NavLink[];
}

export function MobileNav({ links }: MobileNavProps) {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();

  return (
    <Drawer.Root open={open} onOpenChange={setOpen} swipeDirection="up">
      <Drawer.Trigger
        aria-label={open ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={open}
        aria-controls="mobile-nav-drawer"
        className={cn(
          "inline-flex items-center justify-center",
          "size-9 rounded-md",
          "text-text-muted hover:text-text hover:bg-bg-muted",
          "transition-colors duration-150",
          "focus-visible:outline-none"
        )}
      >
        <HamburgerIcon open={open} />
      </Drawer.Trigger>

      <Drawer.Portal>
        <Drawer.Backdrop
          className={cn(
            "fixed inset-0 z-40",
            "bg-neutral-900/50 backdrop-blur-sm",
            "data-[ending-style]:opacity-0 data-[starting-style]:opacity-0",
            "transition-opacity duration-300"
          )}
        />

        <Drawer.Popup
          id="mobile-nav-drawer"
          aria-labelledby="mobile-nav-title"
          className={cn(
            "fixed inset-x-0 top-0 z-50",
            "flex flex-col",
            "bg-bg border-b border-border shadow-lg",
            "h-auto max-h-[min(80dvh,480px)]",
            "data-[ending-style]:translate-y-[-100%] data-[starting-style]:translate-y-[-100%]",
            "transition-transform duration-300 ease-out"
          )}
        >
          <Drawer.Title id="mobile-nav-title" className="sr-only">
            Navigation menu
          </Drawer.Title>
          {/* Header row */}
          <div className="flex items-center justify-between px-4 h-[var(--nav-height)] shrink-0 border-b border-border-muted">
            <span className="text-sm font-mono font-medium text-text">nvl</span>
            <Drawer.Close
              aria-label="Close navigation menu"
              className={cn(
                "inline-flex items-center justify-center",
                "size-9 rounded-md",
                "text-text-muted hover:text-text hover:bg-bg-muted",
                "transition-colors duration-150",
                "focus-visible:outline-none"
              )}
            >
              <HamburgerIcon open={true} />
            </Drawer.Close>
          </div>

          {/* Nav links — each closes the drawer and navigates via <Link>.
              Drawer.Close with render=<Link> merges close behaviour into the
              anchor element: no useRouter() needed, no programmatic navigation. */}
          <nav
            aria-label="Mobile navigation"
            className="flex flex-col px-4 py-6 gap-1"
          >
            {links.map(({ href, label }) => {
              const isActive = pathname !== null && (pathname === href || pathname.startsWith(href + "/"));
              return (
                <Drawer.Close
                  key={href}
                  render={<Link href={href} />}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "flex items-center w-full px-3 py-3 rounded-md",
                    "text-base font-medium",
                    "transition-colors duration-150",
                    "focus-visible:outline-none",
                    isActive
                      ? "text-accent bg-accent-subtle"
                      : "text-text hover:bg-bg-muted"
                  )}
                >
                  {label}
                </Drawer.Close>
              );
            })}
          </nav>
        </Drawer.Popup>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
