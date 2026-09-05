"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { AdrFilterBar } from "./AdrFilterBar";
import { AdrRegisterTable } from "./AdrRegisterTable";
import type { AdrMeta } from "@/lib/content/adr";

const INITIAL_VISIBLE = 20;

type AdrIndexClientProps = {
  adrs: AdrMeta[];
  tags: string[];
  mostRecentAcceptedNumber: number | null;
};

export function AdrIndexClient({
  adrs,
  tags,
  mostRecentAcceptedNumber,
}: AdrIndexClientProps) {
  const t = useTranslations("LabAdr");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);

  function handleTagToggle(tag: string) {
    setActiveTag((prev) => (prev === tag ? null : tag));
    setVisibleCount(INITIAL_VISIBLE);
  }

  function handleSearchChange(query: string) {
    setSearchQuery(query);
    setVisibleCount(INITIAL_VISIBLE);
  }

  const isFiltering = !!activeTag || !!searchQuery;

  const matchingCount = isFiltering
    ? adrs.filter((adr) => {
        const matchesTag = activeTag ? adr.tags.includes(activeTag) : true;
        const matchesSearch = searchQuery
          ? adr.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            adr.tags.some((tag) =>
              tag.toLowerCase().includes(searchQuery.toLowerCase())
            )
          : true;
        return matchesTag && matchesSearch;
      }).length
    : adrs.length;

  const visibleAdrs = adrs.slice(0, visibleCount);
  const hasMore = !isFiltering && visibleCount < adrs.length;

  return (
    <main data-testid="adr-index-main">
      <AdrFilterBar
        tags={tags}
        activeTag={activeTag}
        searchQuery={searchQuery}
        onTagToggle={handleTagToggle}
        onSearchChange={handleSearchChange}
      />

      {isFiltering && matchingCount === 0 && (
        <p
          role="status"
          className="label"
          style={{ padding: "var(--space-lg) 0" }}
        >
          {t("no_results")}
        </p>
      )}

      <AdrRegisterTable
        adrs={visibleAdrs}
        activeTag={activeTag}
        searchQuery={searchQuery}
        mostRecentAcceptedNumber={mostRecentAcceptedNumber}
      />

      {hasMore && (
        <footer
          style={{
            marginTop: "var(--space-lg)",
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "var(--space-md)",
          }}
        >
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: "50%",
              height: "var(--line-ghost)",
              background: "var(--color-ink-ghost)",
              transform: "translateY(-50%)",
            }}
          />
          <div aria-hidden="true" style={{ position: "absolute", left: 0, display: "flex", gap: "var(--space-2xs)" }}>
            <div style={{ width: "var(--line-medium)", height: "var(--space-sm)", background: "var(--color-ink-ghost)" }} />
            <div style={{ width: "var(--line-medium)", height: "var(--space-sm)", background: "var(--color-ink-ghost)" }} />
          </div>
          <button
            type="button"
            onClick={() => setVisibleCount((c) => c + INITIAL_VISIBLE)}
            aria-label={t("load_more_aria")}
            className="label text-ink-ghost hover:text-ink-secondary"
            style={{
              background: "var(--color-ground)",
              border: "none",
              padding: "0 var(--space-md)",
              position: "relative",
              zIndex: 1,
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            {t("load_more")}
          </button>
          <div aria-hidden="true" style={{ position: "absolute", right: 0, display: "flex", gap: "var(--space-2xs)" }}>
            <div style={{ width: "var(--line-medium)", height: "var(--space-sm)", background: "var(--color-ink-ghost)" }} />
            <div style={{ width: "var(--line-medium)", height: "var(--space-sm)", background: "var(--color-ink-ghost)" }} />
          </div>
        </footer>
      )}
    </main>
  );
}
