"use client";

import * as React from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ui";
import { useScrolledNav } from "@/lib/hooks/useScrolledNav";
import { NavLinkItem } from "./NavLinkItem";
import type { NavLink } from "./NavLinkItem";
import { MobileNav } from "./mobile-nav";

export interface NavigationBarProps {
  className?: string;
}

export function NavigationBar({ className }: NavigationBarProps) {
  const t = useTranslations("Navigation");
  const scrolled = useScrolledNav();

  const links: NavLink[] = [
    { href: "/research", label: t("nav_research") },
    { href: "/engineering", label: t("nav_engineering") },
    { href: "/cv", label: t("nav_cv") },
    { href: "/lab", label: t("nav_lab") },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-40 h-(--nav-height)",
        "flex items-center",
        "border-b transition-all duration-300",
        scrolled
          ? "bg-(--glass-bg) backdrop-blur-(--glass-blur) border-(--glass-border) shadow-sm"
          : "bg-transparent border-transparent",
        className
      )}
    >
      <div className="w-full max-w-(--container-max) mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
        <Link
          href="/"
          className="text-sm font-mono font-medium text-text hover:text-accent transition-colors duration-150 shrink-0"
        >
          {t("wordmark")}
        </Link>

        <nav aria-label={t("main_nav_label")} className="hidden md:flex items-center gap-6">
          {links.map((link) => (
            <NavLinkItem key={link.href} href={link.href} label={link.label} />
          ))}
        </nav>

        <DesktopControls links={links} />
      </div>
    </header>
  );
}

function DesktopControls({ links }: { links: NavLink[] }) {
  return (
    <div className="flex items-center gap-2">
      <ThemeToggle />
      <div className="md:hidden">
        <MobileNav links={links} />
      </div>
    </div>
  );
}
