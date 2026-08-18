"use client";

import * as React from "react";
import { Drawer } from "@base-ui/react/drawer";
import { cn } from "@/lib/utils";
import { usePdfPanel } from "./PdfPanelContext";

export interface PdfPanelLabels {
  close: string;
  loading: string;
  iframeTitle: string;
}

// ─── Header ──────────────────────────────────────────────────────────────────

function PdfPanelHeader({ labels }: { labels: PdfPanelLabels }) {
  const { close } = usePdfPanel();
  return (
    <div className="flex items-center justify-end px-4 h-12 border-b border-border shrink-0">
      <Drawer.Title className="sr-only">{labels.iframeTitle}</Drawer.Title>
      <button
        type="button"
        onClick={close}
        aria-label={labels.close}
        className="rounded p-1.5 text-text-muted hover:text-text hover:bg-surface-raised transition-colors duration-150"
      >
        <svg
          aria-hidden="true"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        >
          <path d="M3 3l10 10M13 3L3 13" />
        </svg>
      </button>
    </div>
  );
}

// ─── Body ─────────────────────────────────────────────────────────────────────

function PdfPanelBody({ labels }: { labels: PdfPanelLabels }) {
  const { activeKey, isLoading, setIsLoading } = usePdfPanel();
  const loadTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  // Safety-net timeout: iframe onLoad is unreliable in some browsers for PDFs.
  React.useEffect(() => {
    if (isLoading) {
      loadTimeoutRef.current = setTimeout(() => setIsLoading(false), 2000);
    } else {
      if (loadTimeoutRef.current) clearTimeout(loadTimeoutRef.current);
    }
    return () => {
      if (loadTimeoutRef.current) clearTimeout(loadTimeoutRef.current);
    };
  }, [isLoading, setIsLoading]);

  return (
    <div className="relative flex-1 overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-bg/80">
          <span className="animate-pulse text-sm text-text-muted">{labels.loading}</span>
        </div>
      )}
      {activeKey && (
        <iframe
          key={activeKey}
          src={`/publications/${activeKey}/pdf`}
          title={labels.iframeTitle}
          className="w-full h-full border-0"
          onLoad={() => setIsLoading(false)}
        />
      )}
    </div>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function PdfPanelFooter() {
  const { footer } = usePdfPanel();
  if (!footer) return null;
  return (
    <div className="shrink-0 border-t border-border px-4 py-2 text-xs text-text-muted truncate">
      {footer}
    </div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export function PdfPanel({ labels }: { labels: PdfPanelLabels }) {
  const { isOpen, close } = usePdfPanel();

  return (
    <Drawer.Root
      open={isOpen}
      onOpenChange={(open) => { if (!open) close(); }}
      modal={false}
      swipeDirection="down"
    >
      <Drawer.Portal>
        <Drawer.Viewport className="fixed inset-0 z-50 pointer-events-none">
          <Drawer.Popup
            className={cn(
              // Base — full-screen on mobile, slides up from bottom
              "fixed inset-0 flex flex-col pointer-events-auto",
              "bg-bg",
              "data-[starting-style]:translate-y-full data-[ending-style]:translate-y-full",
              // md+ — right panel at 50% width, full height, slides from right
              "md:inset-y-0 md:left-auto md:right-0 md:w-1/2",
              "md:border-l md:border-border md:shadow-xl",
              "md:data-[starting-style]:translate-x-full md:data-[ending-style]:translate-x-full",
              "md:data-[starting-style]:translate-y-0 md:data-[ending-style]:translate-y-0",
              "transition-transform duration-300 ease-out"
            )}
          >
            <PdfPanelHeader labels={labels} />
            <PdfPanelBody labels={labels} />
            <PdfPanelFooter />
          </Drawer.Popup>
        </Drawer.Viewport>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
