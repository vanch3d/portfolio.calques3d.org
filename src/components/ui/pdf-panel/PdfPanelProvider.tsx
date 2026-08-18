"use client";

import * as React from "react";
import { PdfPanelContext } from "./PdfPanelContext";
import { PdfPanel } from "./PdfPanel";
import type { PdfPanelLabels } from "./PdfPanel";

interface PdfPanelProviderProps {
  labels: PdfPanelLabels;
  children: React.ReactNode;
}

export function PdfPanelProvider({ labels, children }: PdfPanelProviderProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [activeKey, setActiveKey] = React.useState<string | null>(null);
  const [footer, setFooter] = React.useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = React.useState(false);

  // Delay clearing activeKey until after the close animation (300ms) so the
  // iframe does not flash to blank while the panel is sliding out.
  const closeTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const open = React.useCallback((key: string, newFooter?: string) => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    if (!isOpen) {
      setIsOpen(true);
      setActiveKey(key);
      setFooter(newFooter);
      setIsLoading(true);
    } else if (key !== activeKey) {
      setActiveKey(key);
      setFooter(newFooter);
      setIsLoading(true);
    }
    // key === activeKey: no-op
  }, [isOpen, activeKey]);

  const close = React.useCallback(() => {
    setIsOpen(false);
    closeTimerRef.current = setTimeout(() => {
      setActiveKey(null);
      setFooter(undefined);
    }, 300);
  }, []);

  React.useEffect(() => {
    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, []);

  const value = React.useMemo(
    () => ({ open, close, isOpen, activeKey, footer, isLoading, setIsLoading }),
    [open, close, isOpen, activeKey, footer, isLoading]
  );

  return (
    <PdfPanelContext value={value}>
      {children}
      <PdfPanel labels={labels} />
    </PdfPanelContext>
  );
}
