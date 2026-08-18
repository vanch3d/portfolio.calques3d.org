"use client";

import * as React from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import type { Route } from "next";
import { cn } from "@/lib/utils";

export interface SiteFooterProps {
  className?: string;
}

export function SiteFooter({ className }: SiteFooterProps) {
  const t = useTranslations("Navigation");
  const year = new Date().getFullYear();

  return (
    <footer
      className={cn(
        "border-t border-border",
        "py-6 px-4 sm:px-6",
        className
      )}
    >
      <div className="max-w-(--container-max) mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-text-muted font-mono">
        <span>{t("footer_copyright", { year })}</span>
        <div className="flex items-center gap-4">
          <Link
            href={"/lab" as Route}
            className="hover:text-accent transition-colors duration-150"
          >
            {t("footer_lab")}
          </Link>
          <Link
            href="https://github.com/vanch3d/portfolio.calques3d.org"
            className="hover:text-accent transition-colors duration-150"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t("footer_github")}
          </Link>
        </div>
      </div>
    </footer>
  );
}
