"use client";

import { useEffect, useRef, useState } from "react";

export interface PdfPanelLabels {
  view: string;
  close: string;
}

export interface PdfPanelProps {
  filename: string;
  labels: PdfPanelLabels;
}

export function PdfPanel({ filename, labels }: PdfPanelProps) {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const proxyUrl = `/api/pdf-proxy?file=${encodeURIComponent(filename)}`;

  // Drive the native <dialog> from React state
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open) {
      dialog.showModal();
      closeRef.current?.focus();
    } else if (dialog.open) {
      dialog.close();
    }
  }, [open]);

  // Sync React state when dialog is dismissed natively (e.g. Escape key)
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const sync = () => setOpen(false);
    dialog.addEventListener("close", sync);
    return () => dialog.removeEventListener("close", sync);
  }, []);

  // Manual Escape listener — supplements native <dialog> Escape so the
  // handler fires reliably in all environments (including Cypress CT).
  useEffect(() => {
    if (!open) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [open]);

  return (
    <>
      {/* Mobile: open PDF in a new browser tab */}
      <a
        href={proxyUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${labels.view} — opens in new tab`}
        className="md:hidden mt-2 inline-block font-mono text-xs text-text-muted hover:text-accent transition-colors duration-150"
      >
        ↗ {labels.view}
      </a>

      {/* Desktop: open slide-over panel */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`${labels.view} — opens viewer panel`}
        className="hidden md:inline-block mt-2 font-mono text-xs text-text-muted hover:text-accent transition-colors duration-150"
      >
        ↗ {labels.view}
      </button>

      {/*
        Native <dialog> — showModal() provides browser-native focus trap and
        Escape-key dismissal. Clicks on the ::backdrop pseudo-element propagate
        as clicks on the <dialog> element itself; we detect them via e.target.
      */}
      {/*
        Do NOT add display utilities (flex, block, etc.) directly to <dialog> —
        they override the browser's UA display:none for closed dialogs. Layout
        is handled by the inner wrapper div instead.
      */}
      <dialog
        ref={dialogRef}
        aria-label={labels.view}
        className="fixed inset-y-0 right-0 m-0 h-full w-1/2 border-l border-border bg-surface p-0 shadow-xl"
        onClick={(e) => {
          if (e.target === dialogRef.current) setOpen(false);
        }}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-end border-b border-border px-4 py-3">
            <button
              ref={closeRef}
              type="button"
              onClick={() => setOpen(false)}
              className="font-mono text-xs text-text hover:text-accent transition-colors duration-150"
              aria-label={labels.close}
            >
              ✕ {labels.close}
            </button>
          </div>
          <iframe
            src={open ? proxyUrl : undefined}
            title={labels.view}
            className="w-full flex-1"
          />
        </div>
      </dialog>
    </>
  );
}
