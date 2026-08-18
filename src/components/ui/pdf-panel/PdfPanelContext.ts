import { createContext, useContext } from "react";

export interface PdfPanelContextValue {
  open: (key: string, footer?: string) => void;
  close: () => void;
  isOpen: boolean;
  activeKey: string | null;
  footer: string | undefined;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const PdfPanelContext = createContext<PdfPanelContextValue | null>(null);

export function usePdfPanel(): PdfPanelContextValue {
  const ctx = useContext(PdfPanelContext);
  if (!ctx) {
    throw new Error("usePdfPanel must be used inside PdfPanelProvider");
  }
  return ctx;
}
