"use client";

import { Dialog } from "@base-ui/react/dialog";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function Modal({
  trigger,
  title,
  closeLabel,
  children,
}: {
  trigger: ReactNode;
  title: string;
  closeLabel: string;
  children: ReactNode;
}) {
  return (
    <Dialog.Root>
      <Dialog.Trigger className="cursor-pointer">
        {trigger}
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop
          className={cn(
            "fixed inset-0 z-50 bg-bg/80 backdrop-blur-sm",
            "data-[ending-style]:opacity-0 data-[starting-style]:opacity-0",
            "transition-opacity duration-200"
          )}
        />
        <Dialog.Popup
          className={cn(
            "fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2",
            "max-h-[90dvh] max-w-[90dvw] overflow-auto",
            "rounded-lg border border-border bg-surface shadow-xl",
            "data-[ending-style]:scale-95 data-[ending-style]:opacity-0",
            "data-[starting-style]:scale-95 data-[starting-style]:opacity-0",
            "transition-all duration-200"
          )}
        >
          <Dialog.Title className="sr-only">{title}</Dialog.Title>
          <Dialog.Close
            aria-label={closeLabel}
            className={cn(
              "absolute right-3 top-3 rounded p-1",
              "text-text-muted hover:text-text",
              "focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
            )}
          >
            ✕
          </Dialog.Close>
          {children}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
