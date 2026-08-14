"use client";

import * as React from "react";
import { Drawer } from "@base-ui/react/drawer";
import { cn } from "@/lib/utils";
import { MenuIcon, CloseIcon } from "@/components/ui/icons";

interface MobileNavTriggerProps {
  open: boolean;
  label: string;
}

export function MobileNavTrigger({ open, label }: MobileNavTriggerProps) {
  return (
    <Drawer.Trigger
      aria-label={label}
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
      {open ? <CloseIcon className="size-5" /> : <MenuIcon className="size-5" />}
    </Drawer.Trigger>
  );
}
