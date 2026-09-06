"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { FilterInput } from "@/components/ui/FilterInput";
import type { TagWithCount } from "@/lib/content/adr";

export type { TagWithCount };

type TagFilterDrawerProps = {
  tags: TagWithCount[];
  activeTags: string[];
  onTagsChange: (tags: string[]) => void;
};

function tagSizeClass(count: number): string {
  if (count >= 5) return "text-tag-w5";
  if (count === 4) return "text-tag-w4";
  if (count === 3) return "text-tag-w3";
  if (count === 2) return "text-tag-w2";
  return "text-tag-w1";
}

type TagGroupProps = {
  heading: string;
  hint?: string;
  tags: TagWithCount[];
  activeTags: string[];
  onToggle: (tag: string) => void;
  drawerSearchQuery: string;
};

function TagGroup({
  heading,
  hint,
  tags,
  activeTags,
  onToggle,
  drawerSearchQuery,
}: TagGroupProps) {
  const q = drawerSearchQuery.trim().toLowerCase();
  const visibleTags = q
    ? tags.filter(({ tag }) => tag.toLowerCase().includes(q))
    : tags;

  if (visibleTags.length === 0) return null;

  return (
    <div className="mb-sm" data-testid="tag-group">
      {/* Group heading — decorative, hidden from AT; the role="group" aria-label carries the accessible name */}
      <div
        className="flex items-center gap-sm py-xs border-t-ghost border-ink-ghost mb-xs"
        aria-hidden="true"
      >
        <span className="opacity-40">&#9642;</span>
        <span className="font-label text-tag-w1 leading-label tracking-wide uppercase text-ink-secondary">
          {heading}
        </span>
        {hint && (
          <span className="font-label text-micro leading-label tracking-label uppercase text-ink-secondary">
            {hint}
          </span>
        )}
      </div>
      <div
        className="flex flex-wrap gap-xs items-baseline"
        role="group"
        aria-label={heading}
      >
        {visibleTags.map(({ tag, count }) => {
          const isSelected = activeTags.includes(tag);
          return (
            <button
              key={tag}
              onClick={() => onToggle(tag)}
              aria-pressed={isSelected}
              className={cn(
                "inline-flex items-baseline gap-xs border-ghost border-ink-ghost",
                "cursor-pointer uppercase tracking-label transition-colors",
                "px-xs py-xs font-label",
                tagSizeClass(count),
                isSelected
                  ? "bg-ink text-ground border-ink"
                  : "text-ink-secondary hover:border-ink hover:text-ink"
              )}
              data-testid={`tag-chip-${tag}`}
            >
              {tag}
              <span
                className={cn(
                  "inline-flex items-center justify-center tabular-nums font-label",
                  "text-badge-sm min-w-badge-sm h-badge-sm py-0 px-badge-pad-sm",
                  isSelected ? "text-ink-ghost" : "text-ground bg-ink-secondary"
                )}
                aria-hidden="true"
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function TagFilterDrawer({
  tags,
  activeTags,
  onTagsChange,
}: TagFilterDrawerProps) {
  const t = useTranslations("TagFilterDrawer");
  const [isOpen, setIsOpen] = useState(false);
  const [drawerSearch, setDrawerSearch] = useState("");

  const highFrequency = tags.filter(({ count }) => count >= 3);
  const multipleRefs = tags.filter(({ count }) => count === 2);
  const singleRefs = tags.filter(({ count }) => count === 1);

  const activeCount = activeTags.length;

  function handleToggleDrawer() {
    if (!isOpen) {
      setDrawerSearch("");
    }
    setIsOpen((prev) => !prev);
  }

  function handleTagToggle(tag: string) {
    if (activeTags.includes(tag)) {
      onTagsChange(activeTags.filter((t) => t !== tag));
    } else {
      onTagsChange([...activeTags, tag]);
    }
  }

  function handleRemoveActiveChip(tag: string) {
    onTagsChange(activeTags.filter((t) => t !== tag));
  }

  function handleNone() {
    onTagsChange([]);
  }

  return (
    <div data-testid="tag-filter-drawer">
      <div className="flex items-center gap-sm flex-wrap">
        {/* TAGS toggle — left edge of the tag zone */}
        <button
          onClick={handleToggleDrawer}
          aria-expanded={isOpen}
          aria-controls="tag-drawer"
          aria-label={isOpen ? t("toggle_close_aria") : t("toggle_open_aria")}
          className={cn(
            "label text-ink-secondary flex items-center gap-xs cursor-pointer",
            "bg-transparent border-none border-b-medium transition-colors",
            "py-xs whitespace-nowrap shrink-0",
            isOpen
              ? "text-ink border-active"
              : "border-transparent hover:text-ink"
          )}
          data-testid="drawer-toggle"
        >
          {t("toggle_label")}
          {activeCount > 0 && (
            <span
              className={cn(
                "inline-flex items-center justify-center bg-active text-ground tabular-nums font-label",
                "text-badge min-w-badge h-badge py-0 px-badge-pad"
              )}
              data-testid="toggle-badge"
              aria-hidden="true"
            >
              {activeCount}
            </span>
          )}
          <span aria-hidden="true">{isOpen ? "▴" : "▾"}</span>
        </button>

        {/* Active chips — visible only when drawer is closed.
            When the drawer is open the chip cloud inside it shows selected state
            directly; rendering removable chips here simultaneously would create
            two places to perform the same deselection. */}
        {!isOpen && (
          <div
            className="flex items-center gap-xs flex-1 flex-wrap min-w-0"
            data-testid="active-chips-zone"
          >
            {activeTags.length === 0 ? (
              <span
                className="font-label text-tag-w2 tracking-label uppercase text-ink-secondary leading-label"
                data-testid="chips-empty-hint"
              >
                {t("chips_empty_hint")}
              </span>
            ) : (
              activeTags.map((tag) => (
                <span
                  key={tag}
                  className={cn(
                    "inline-flex items-center gap-xs bg-ink text-ground",
                    "font-label text-tag-w2 tracking-label uppercase leading-label whitespace-nowrap",
                    "py-chip-pad-y px-chip-pad-x"
                  )}
                  data-testid={`active-chip-${tag}`}
                >
                  {tag}
                  <button
                    onClick={() => handleRemoveActiveChip(tag)}
                    className={cn(
                      "bg-transparent border-none text-ground cursor-pointer",
                      "opacity-55 hover:opacity-100 leading-none p-0 font-label text-tag-w4"
                    )}
                    aria-label={t("chip_remove_aria", { tag })}
                    data-testid={`active-chip-remove-${tag}`}
                  >
                    ×
                  </button>
                </span>
              ))
            )}
          </div>
        )}
      </div>

      {/* Tag drawer — desktop: in page flow; mobile: full-screen fixed overlay */}
      {isOpen && (
        <div
          id="tag-drawer"
          role="region"
          aria-label={t("drawer_region_aria")}
          className={cn(
            "border-b-medium border-ink py-sm pb-md",
            "sm:static sm:bg-transparent",
            "max-sm:fixed max-sm:inset-0 max-sm:z-50 max-sm:overflow-y-auto max-sm:bg-ground max-sm:px-page max-sm:py-xl"
          )}
          data-testid="tag-drawer-panel"
        >
          {/* Drawer header: inner search · view modes · NONE (desktop) · CLOSE (mobile) */}
          <div
            className="flex items-center gap-lg mb-sm flex-wrap"
            data-testid="drawer-header"
          >
            <FilterInput
              value={drawerSearch}
              onChange={setDrawerSearch}
              placeholder={t("tags_search_placeholder")}
              ariaLabel={t("tags_search_aria")}
              startAddon="⌕"
              className="w-filter-input-w-drawer max-sm:w-full"
            />

            {/* View mode tabs — future extensibility slots.
                "By frequency" is the only implemented mode.
                "By category" and "By status" are present-disabled — they signal
                the growth path without adding implementation burden now. */}
            <div
              className="flex gap-sm items-center"
              data-testid="view-mode-tabs"
            >
              <button
                className={cn(
                  "font-label text-micro tracking-label uppercase text-ink-secondary leading-label",
                  "border-b-ghost border-ink-secondary cursor-pointer bg-transparent border-l-0 border-r-0 border-t-0 p-0"
                )}
                aria-current="true"
              >
                {t("view_frequency")}
              </button>
              <span
                className="font-label text-micro text-ink-ghost leading-label"
                aria-hidden="true"
              >
                ·
              </span>
              <button
                className={cn(
                  "font-label text-micro tracking-label uppercase text-ink-ghost leading-label",
                  "cursor-not-allowed bg-transparent border-none p-0 opacity-40"
                )}
                disabled
                title="Planned: group by domain category"
              >
                {t("view_category")}
              </button>
              <span
                className="font-label text-micro text-ink-ghost leading-label"
                aria-hidden="true"
              >
                ·
              </span>
              <button
                className={cn(
                  "font-label text-micro tracking-label uppercase text-ink-ghost leading-label",
                  "cursor-not-allowed bg-transparent border-none p-0 opacity-40"
                )}
                disabled
                title="Planned: filter to tags on accepted / deprecated ADRs"
              >
                {t("view_status")}
              </button>
            </div>

            {/* NONE — tag-scoped clear. Deselects all active tags, does not touch search.
                Hidden when no tags are active. Desktop only; mobile uses CLOSE. */}
            {activeCount > 0 && (
              <button
                onClick={handleNone}
                className={cn(
                  "label text-ink-secondary ml-auto cursor-pointer bg-transparent border-none p-0",
                  "border-b-ghost border-transparent hover:text-active hover:border-active",
                  "transition-colors",
                  "max-sm:hidden"
                )}
                aria-label={t("none_aria")}
                data-testid="none-button"
              >
                {t("none_button")}
              </button>
            )}

            {/* CLOSE — mobile only; replaces NONE in mobile full-screen overlay */}
            <button
              onClick={handleToggleDrawer}
              className={cn(
                "label text-ink-secondary cursor-pointer bg-transparent border-none p-0 ml-auto",
                "hidden max-sm:flex"
              )}
              aria-label={t("toggle_close_aria")}
              data-testid="drawer-close-mobile"
            >
              {t("drawer_close_mobile")}
            </button>
          </div>

          {/* Tag groups */}
          <div data-testid="tag-groups">
            {highFrequency.length > 0 && (
              <TagGroup
                heading={t("group_high")}
                tags={highFrequency}
                activeTags={activeTags}
                onToggle={handleTagToggle}
                drawerSearchQuery={drawerSearch}
              />
            )}

            {multipleRefs.length > 0 && (
              <TagGroup
                heading={t("group_multiple")}
                tags={multipleRefs}
                activeTags={activeTags}
                onToggle={handleTagToggle}
                drawerSearchQuery={drawerSearch}
              />
            )}

            {singleRefs.length > 0 && (
              <TagGroup
                heading={t("group_single")}
                hint={t("group_single_hint")}
                tags={singleRefs}
                activeTags={activeTags}
                onToggle={handleTagToggle}
                drawerSearchQuery={drawerSearch}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
