"use client";

import * as React from "react";
import { Drawer } from "@base-ui/react/drawer";
import { cn } from "@/lib/utils";
import { MobileNavHeader } from "./MobileNavHeader";
import { MobileNavLink } from "./MobileNavLink";
import type { NavLink } from "../NavLinkItem";

interface MobileNavPopupProps {
  links: NavLink[];
  pathname: string | null;
  closeLabel: string;
  wordmark: string;
  mobileNavLabel: string;
}

export function MobileNavPopup({
  links,
  pathname,
  closeLabel,
  wordmark,
  mobileNavLabel,
}: MobileNavPopupProps) {
  return (
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
        {mobileNavLabel}
      </Drawer.Title>
      <MobileNavHeader wordmark={wordmark} closeLabel={closeLabel} />
      <nav aria-label={mobileNavLabel} className="flex flex-col px-4 py-6 gap-1">
        {links.map(({ href, label }) => (
          <MobileNavLink
            key={href}
            href={href}
            label={label}
            isActive={pathname !== null && (pathname === href || pathname.startsWith(href + "/"))}
          />
        ))}
      </nav>
    </Drawer.Popup>
  );
}
