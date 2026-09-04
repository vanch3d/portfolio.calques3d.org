"use client";

import { useTranslations } from "next-intl";

type RuleVariant = "one_red" | "no_decoration" | "flat_by_construction";

type NamedRuleCardProps = {
  variant: RuleVariant;
};

export function NamedRuleCard({ variant }: NamedRuleCardProps) {
  const t = useTranslations("NamedRuleCard");

  const content: Record<RuleVariant, { name: string; statement: string }> = {
    one_red: {
      name: t("one_red_name"),
      statement: t("one_red_statement"),
    },
    no_decoration: {
      name: t("no_decoration_name"),
      statement: t("no_decoration_statement"),
    },
    flat_by_construction: {
      name: t("flat_by_construction_name"),
      statement: t("flat_by_construction_statement"),
    },
  };

  const { name, statement } = content[variant];

  return (
    <article
      data-testid={`rule-card-${variant}`}
      style={{
        border: "var(--line-medium) solid var(--color-ink-ghost)",
        padding: "var(--space-md) var(--space-lg)",
      }}
    >
      <p className="label" style={{ marginBottom: "var(--space-sm)" }}>
        {name}
      </p>
      <p
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "var(--text-body)",
          fontWeight: 500,
          lineHeight: 1.45,
          color: "var(--color-ink)",
        }}
      >
        {statement}
      </p>
    </article>
  );
}
