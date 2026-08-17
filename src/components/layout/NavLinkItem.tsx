"use client";

import * as React from "react";
import Link from "next/link";
import type { Route } from "next";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export interface NavLink {
  href: Route;
  label: string;
}

export function NavLinkItem({ href, label }: NavLink) {
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
