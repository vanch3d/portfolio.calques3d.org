"use client";

import * as React from "react";
import { Drawer } from "@base-ui/react/drawer";
import { cn } from "@/lib/utils";
import { CloseIcon } from "@/components/ui/icons";

interface MobileNavHeaderProps {
  wordmark: string;
  closeLabel: string;
}

export function MobileNavHeader({ wordmark, closeLabel }: MobileNavHeaderProps) {
  return (
    <div className="flex items-center justify-between px-4 h-(--nav-height) shrink-0 border-b border-border-muted">
      <span className="text-sm font-mono font-medium text-text">{wordmark}</span>
      <Drawer.Close
        aria-label={closeLabel}
        className={cn(
          "inline-flex items-center justify-center",
          "size-9 rounded-md",
          "text-text-muted hover:text-text hover:bg-bg-muted",
          "transition-colors duration-150",
          "focus-visible:outline-none"
        )}
      >
        <CloseIcon className="size-5" />
      </Drawer.Close>
    </div>
  );
}
