"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import type { AdrMeta, TagWithCount } from "@/lib/content/adr";
import { AdrFilterBar } from "./AdrFilterBar";
import { AdrRegisterTable } from "./AdrRegisterTable";
import { TagFilterDrawer } from "@/components/ui/TagFilterDrawer";

const PAGE_SIZE = 20;

type AdrIndexClientProps = {
  adrs: AdrMeta[];
  tags: TagWithCount[];
  mostRecentAcceptedNumber: number | null;
};

/**
 * AdrIndexClient — Client Component orchestrator for the ADR register.
 *
 * Owns all interactive state:
 *   - searchQuery: filters by title (case-insensitive substring)
 *   - activeTags: filters by tag membership (OR logic — any matching tag)
 *   - visibleCount: load-more pagination, starts at PAGE_SIZE
 *
 * Filtering resets pagination automatically (resetKey is derived in useMemo
 * so the visible slice is always coherent).
 *
 * Passes filtered + sliced adrs down to AdrRegisterTable.
 * Passes filter state + handlers down to AdrFilterBar.
 * TagFilterDrawer renders between AdrFilterBar and AdrRegisterTable.
 */
export function AdrIndexClient({
  adrs,
  tags,
  mostRecentAcceptedNumber,
}: AdrIndexClientProps) {
  const t = useTranslations("LabAdr");

  const [searchQuery, setSearchQuery] = useState("");
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const containerRef = useRef<HTMLDivElement>(null);

  // Signal to E2E tests that React has hydrated and event handlers are attached.
  // data-testid="client-ready" is set client-side only (useEffect does not run
  // during SSR), making it a reliable Cypress hydration sentinel.
  useEffect(() => {
    containerRef.current?.setAttribute("data-testid", "client-ready");
  }, []);

  const filteredAdrs = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return adrs.filter((adr) => {
      const matchesSearch = q === "" || adr.title.toLowerCase().includes(q);
      const matchesTags =
        activeTags.length === 0 ||
        activeTags.some((tag) => adr.tags.includes(tag));
      return matchesSearch && matchesTags;
    });
  }, [adrs, searchQuery, activeTags]);

  const visibleAdrs = useMemo(
    () => filteredAdrs.slice(0, visibleCount),
    [filteredAdrs, visibleCount]
  );

  const hasMore = visibleCount < filteredAdrs.length;
  const hasClearable = searchQuery !== "" || activeTags.length > 0;

  function handleSearchChange(q: string) {
    setSearchQuery(q);
    setVisibleCount(PAGE_SIZE);
  }

  function handleTagsChange(newTags: string[]) {
    setActiveTags(newTags);
    setVisibleCount(PAGE_SIZE);
  }

  function handleLoadMore() {
    setVisibleCount((prev) => prev + PAGE_SIZE);
  }

  function handleClear() {
    setSearchQuery("");
    setActiveTags([]);
    setVisibleCount(PAGE_SIZE);
  }

  return (
    <div ref={containerRef}>
      {/* Visually hidden live region — announces filtered count to screen readers */}
      <span className="sr-only" aria-live="polite" aria-atomic="true">
        {t("filter_count_live", { count: filteredAdrs.length, total: adrs.length })}
      </span>

      <AdrFilterBar
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        hasClearable={hasClearable}
        onClear={handleClear}
      />

      <TagFilterDrawer
        tags={tags}
        activeTags={activeTags}
        onTagsChange={handleTagsChange}
      />

      <AdrRegisterTable
        adrs={visibleAdrs}
        mostRecentAcceptedNumber={mostRecentAcceptedNumber}
      />

      <div className="relative flex items-center justify-center mt-lg py-sm">
        <div
          className="absolute inset-x-0 top-1/2 border-t-ghost border-ink-ghost"
          aria-hidden="true"
        />

        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center gap-xs"
          aria-hidden="true"
        >
          <div className="border-l-medium border-ink-ghost h-sm" />
          <div className="border-l-medium border-ink-ghost h-sm" />
        </div>

        <div
          className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-xs"
          aria-hidden="true"
        >
          <div className="border-l-medium border-ink-ghost h-sm" />
          <div className="border-l-medium border-ink-ghost h-sm" />
        </div>

        <div className="relative z-10 bg-ground px-lg">
          {hasMore ? (
            <button
              onClick={handleLoadMore}
              className="label text-ink-ghost hover:text-ink-secondary transition-colors"
              aria-label={t("load_more_aria")}
            >
              {t("load_more")}
            </button>
          ) : (
            <span className="label text-ink-secondary" aria-hidden="true">
              {filteredAdrs.length} / {adrs.length}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
