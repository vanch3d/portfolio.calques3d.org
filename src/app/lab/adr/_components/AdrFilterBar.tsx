"use client";

import { useTranslations } from "next-intl";
import { Field } from "@base-ui/react/field";
import { Input } from "@base-ui/react/input";
import { LabButton } from "@/components/ui/LabButton";

type AdrFilterBarProps = {
  tags: string[];
  activeTag: string | null;
  searchQuery: string;
  onTagToggle: (tag: string) => void;
  onSearchChange: (query: string) => void;
};

export function AdrFilterBar({
  tags,
  activeTag,
  searchQuery,
  onTagToggle,
  onSearchChange,
}: AdrFilterBarProps) {
  const t = useTranslations("LabAdr");

  return (
    <div
      data-testid="adr-filter-bar"
      role="search"
      aria-label={t("filter_aria")}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "var(--space-md)",
        paddingBottom: "var(--space-md)",
        borderBottom: "var(--line-ghost) solid var(--color-ink-ghost)",
        flexWrap: "wrap",
      }}
    >
      <Field.Root>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            border: "var(--line-ghost) solid var(--color-ink-ghost)",
            padding: "var(--space-xs) var(--space-sm)",
            gap: "var(--space-sm)",
          }}
        >
          {/* Search icon — not label text, so .label utility does not apply */}
          <Field.Label
            aria-hidden="true"
            className="font-label text-ink-ghost"
          >
            ⌕
          </Field.Label>
          <Input
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={t("filter_placeholder")}
            aria-label={t("filter_placeholder")}
            className="label text-ink"
            style={{
              background: "transparent",
              border: "none",
              outline: "none",
              width: "14rem",
            }}
          />
        </div>
      </Field.Root>

      <div
        role="group"
        aria-label={t("filter_by_tag_aria")}
        style={{
          display: "flex",
          gap: "var(--space-xs)",
          flexWrap: "wrap",
          flex: 1,
          justifyContent: "flex-end",
        }}
      >
        {tags.map((tag) => {
          const isActive = activeTag === tag;
          return (
            <LabButton
              key={tag}
              pressed={isActive}
              onClick={() => onTagToggle(tag)}
              data-testid={`tag-chip-${tag}`}
              aria-label={tag}
            >
              {tag}
            </LabButton>
          );
        })}
      </div>
    </div>
  );
}
