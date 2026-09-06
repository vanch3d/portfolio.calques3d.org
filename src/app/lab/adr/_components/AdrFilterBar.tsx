"use client";

import { useTranslations } from "next-intl";
import { FilterInput } from "@/components/ui/FilterInput";

type AdrFilterBarProps = {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  hasClearable: boolean;
  onClear: () => void;
};

export function AdrFilterBar({
  searchQuery,
  onSearchChange,
  hasClearable,
  onClear,
}: AdrFilterBarProps) {
  const t = useTranslations("LabAdr");

  return (
    <div
      role="search"
      aria-label={t("filter_aria")}
      className="flex items-center gap-md pb-sm border-b-medium border-ink"
    >
      <FilterInput
        value={searchQuery}
        onChange={onSearchChange}
        placeholder={t("filter_placeholder")}
        ariaLabel={t("filter_placeholder")}
        startAddon="⌕"
        className="shrink-0 w-[14rem]"
      />

      {hasClearable && (
        <button
          onClick={onClear}
          className="label text-ink-secondary hover:text-active transition-colors shrink-0 ml-auto"
          aria-label={t("clear_filters_aria")}
        >
          {t("clear_filters")}
        </button>
      )}
    </div>
  );
}
