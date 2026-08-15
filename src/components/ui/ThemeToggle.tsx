"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { IconButton } from "./IconButton";
import { SunIcon, MoonIcon } from "@/components/ui/icons";
import { useTheme, useIsMounted, setTheme } from "@/lib/hooks/useTheme";

export interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const t = useTranslations("Navigation");
  const mode = useTheme();
  const isMounted = useIsMounted();

  return (
    <IconButton
      aria-label={mode === "dark" ? t("switch_to_light") : t("switch_to_dark")}
      variant="ghost"
      size="md"
      className={className}
      onClick={() => setTheme(mode === "dark" ? "light" : "dark")}
    >
      {isMounted ? (
        mode === "dark" ? <SunIcon className="size-[1.125em]" /> : <MoonIcon className="size-[1.125em]" />
      ) : (
        <span aria-hidden="true" className="size-[1.125em] block" />
      )}
    </IconButton>
  );
}
