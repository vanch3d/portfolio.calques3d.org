"use client";

import * as React from "react";
import Link from "next/link";
import { Drawer } from "@base-ui/react/drawer";
import { cn } from "@/lib/utils";

interface MobileNavLinkProps {
  href: string;
  label: string;
  isActive: boolean;
}

export function MobileNavLink({ href, label, isActive }: MobileNavLinkProps) {
  return (
    <Drawer.Close
      render={<Link href={href} />}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "flex items-center w-full px-3 py-3 rounded-md",
        "text-base font-medium",
        "transition-colors duration-150",
        "focus-visible:outline-none",
        isActive ? "text-accent bg-accent-subtle" : "text-text hover:bg-bg-muted"
      )}
    >
      {label}
    </Drawer.Close>
  );
}
