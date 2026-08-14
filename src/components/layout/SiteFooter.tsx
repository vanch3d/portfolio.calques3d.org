import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface SiteFooterProps {
  className?: string;
}

export function SiteFooter({ className }: SiteFooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer
      className={cn(
        "border-t border-border",
        "py-6 px-4 sm:px-6",
        className
      )}
    >
      <div className="max-w-[var(--container-max)] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-text-muted font-mono">
        <span>© {year} Nicolas Van Labeke</span>
        <Link
          href="https://github.com/vanch3d/portfolio.calques3d.org"
          className="hover:text-accent transition-colors duration-150"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </Link>
      </div>
    </footer>
  );
}
