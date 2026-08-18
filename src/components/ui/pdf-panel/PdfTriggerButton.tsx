"use client";

import { usePdfPanel } from "./PdfPanelContext";

export interface PdfTriggerButtonLabels {
  viewPdf: string;
}

interface PdfTriggerButtonProps {
  pubKey: string;
  footer?: string;
  labels: PdfTriggerButtonLabels;
}

export function PdfTriggerButton({ pubKey, footer, labels }: PdfTriggerButtonProps) {
  const { open } = usePdfPanel();

  return (
    <button
      type="button"
      onClick={() => open(pubKey, footer)}
      className="inline-flex items-center gap-1 font-mono text-xs text-text-muted hover:text-accent transition-colors duration-150"
    >
      <span aria-hidden="true">↗</span>
      {labels.viewPdf}
    </button>
  );
}
