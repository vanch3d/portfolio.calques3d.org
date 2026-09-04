"use client";

import { useTranslations } from "next-intl";

export type ColorToken =
  | "color-ground"
  | "color-ink"
  | "color-ink-secondary"
  | "color-ink-ghost"
  | "color-active";

type ColorSwatchKey =
  | "ground"
  | "ink"
  | "ink_secondary"
  | "ink_ghost"
  | "active";

const TOKEN_TO_KEY: Record<ColorToken, ColorSwatchKey> = {
  "color-ground":        "ground",
  "color-ink":           "ink",
  "color-ink-secondary": "ink_secondary",
  "color-ink-ghost":     "ink_ghost",
  "color-active":        "active",
};

type ColorSwatchProps = {
  token: ColorToken;
};

export function ColorSwatch({ token }: ColorSwatchProps) {
  const t = useTranslations("LabColors");
  const key = TOKEN_TO_KEY[token];

  const name      = t(`color_${key}_name`);
  const cssToken  = t(`color_${key}_token`);
  const hex       = t(`color_${key}_hex`);
  const usage     = t(`color_${key}_usage`);
  const swatchAria = t(`color_${key}_swatch_aria`);

  return (
    <div
      data-testid={`color-swatch-${token}`}
      style={{
        display: "grid",
        gridTemplateColumns: "120px 1fr",
        gap: "var(--space-lg)",
        alignItems: "start",
      }}
    >
      <div
        role="img"
        aria-label={swatchAria}
        data-token={token}
        style={{
          width: "120px",
          height: "72px",
          flexShrink: 0,
          border: "var(--line-ghost) solid var(--color-ink-ghost)",
          backgroundColor: `var(--${token})`,
        }}
      />
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-xs)" }}>
        <p
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "var(--text-title)",
            fontWeight: 500,
            lineHeight: 1.2,
            color: "var(--color-ink)",
          }}
        >
          {name}
        </p>
        <div style={{ display: "flex", gap: "var(--space-md)", flexWrap: "wrap" }}>
          <span
            style={{
              fontFamily: "var(--font-label)",
              fontSize: "var(--text-label)",
              letterSpacing: "0.06em",
              color: "var(--color-ink-secondary)",
            }}
          >
            {cssToken}
          </span>
          <span
            className="tabular"
            style={{
              fontFamily: "var(--font-label)",
              fontSize: "var(--text-label)",
              letterSpacing: "0.06em",
              color: "var(--color-ink-secondary)",
            }}
          >
            {hex}
          </span>
        </div>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.875rem",
            lineHeight: 1.55,
            color: "var(--color-ink-secondary)",
            maxWidth: "52ch",
          }}
        >
          {usage}
        </p>
      </div>
    </div>
  );
}
