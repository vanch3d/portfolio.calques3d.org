"use client";

import * as React from "react";
import { useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ui";
import { MobileNav } from "./MobileNav";

// ── Scroll sentinel store ──────────────────────────────────────────────────
// Observes the sentinel element (zero-height div at top of page) via
// IntersectionObserver. When the sentinel leaves the viewport the nav is
// "scrolled" and gets the glass effect. No scroll event listeners.

type ScrolledStore = {
  subscribe: (callback: () => void) => () => void;
  getSnapshot: () => boolean;
  getServerSnapshot: () => boolean;
};

function createScrolledStore(sentinelId: string): ScrolledStore {
  let scrolled = false;
  const listeners = new Set<() => void>();

  if (typeof window !== "undefined") {
    const sentinel = document.getElementById(sentinelId);
    if (sentinel) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          scrolled = !entry.isIntersecting;
          listeners.forEach((l) => l());
        },
        { threshold: 0 }
      );
      observer.observe(sentinel);
    }
  }

  return {
    subscribe: (callback) => {
      listeners.add(callback);
      return () => listeners.delete(callback);
    },
    getSnapshot: () => scrolled,
    getServerSnapshot: () => false,
  };
}

// Created once at module level — survives re-renders.
const scrolledStore = createScrolledStore("nav-sentinel");

// ── Nav links ──────────────────────────────────────────────────────────────

export interface NavLink {
  href: string;
  label: string;
}

export const NAV_LINKS: NavLink[] = [
  { href: "/research", label: "Research" },
  { href: "/engineering", label: "Engineering" },
  { href: "/cv", label: "CV" },
  { href: "/lab", label: "Lab" },
];

// ── NavLink item ──────────────────────────────────────────────────────────

function NavLinkItem({ href, label }: NavLink) {
  const pathname = usePathname();
  const isActive = pathname !== null && (pathname === href || pathname.startsWith(href + "/"));

  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "text-sm font-medium transition-colors duration-150",
        "hover:text-accent focus-visible:text-accent",
        isActive ? "text-accent" : "text-text-muted"
      )}
    >
      {label}
    </Link>
  );
}

// ── NavigationBar ─────────────────────────────────────────────────────────

export interface NavigationBarProps {
  className?: string;
}

export function NavigationBar({ className }: NavigationBarProps) {
  const scrolled = useSyncExternalStore(
    scrolledStore.subscribe,
    scrolledStore.getSnapshot,
    scrolledStore.getServerSnapshot
  );

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-40 h-[var(--nav-height)]",
        "flex items-center",
        "border-b transition-all duration-300",
        scrolled
          ? "bg-[var(--glass-bg)] backdrop-blur-[var(--glass-blur)] border-[var(--glass-border)] shadow-sm"
          : "bg-transparent border-transparent",
        className
      )}
    >
      <div className="w-full max-w-[var(--container-max)] mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* Wordmark / home link */}
        <Link
          href="/"
          className="text-sm font-mono font-medium text-text hover:text-accent transition-colors duration-150 shrink-0"
        >
          nvl
        </Link>

        {/* Desktop nav */}
        <nav aria-label="Main navigation" className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <NavLinkItem key={link.href} {...link} />
          ))}
        </nav>

        {/* Right controls */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {/* Mobile hamburger — visible below md */}
          <div className="md:hidden">
            <MobileNav links={NAV_LINKS} />
          </div>
        </div>
      </div>
    </header>
  );
}
