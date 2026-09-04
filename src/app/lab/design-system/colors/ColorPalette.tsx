"use client";

import { useTranslations } from "next-intl";
import { ColorSwatch, type ColorToken } from "./ColorSwatch";

const NEUTRAL_TOKENS: ColorToken[] = [
  "color-ground",
  "color-ink",
  "color-ink-secondary",
  "color-ink-ghost",
];

const ACCENT_TOKENS: ColorToken[] = ["color-active"];

export function ColorPalette() {
  const t = useTranslations("LabColors");

  return (
    <div data-testid="color-palette">
      <section aria-labelledby="neutral-group-heading">
        <p
          id="neutral-group-heading"
          style={{
            fontFamily: "var(--font-label)",
            fontSize: "var(--text-label)",
            letterSpacing: "var(--tracking-label)",
            textTransform: "uppercase",
            color: "var(--color-ink-secondary)",
            marginBottom: "var(--space-md)",
            paddingBottom: "var(--space-xs)",
            borderBottom: "var(--line-ghost) solid var(--color-ink-ghost)",
          }}
        >
          {t("group_neutral")}
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-xl)" }}>
          {NEUTRAL_TOKENS.map((token, index) => (
            <div key={token}>
              <ColorSwatch token={token} />
              {index < NEUTRAL_TOKENS.length - 1 && (
                <hr
                  aria-hidden="true"
                  style={{
                    border: "none",
                    borderTop: "var(--line-ghost) solid var(--color-ink-ghost)",
                    marginTop: "var(--space-xl)",
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </section>

      <hr
        aria-hidden="true"
        style={{
          border: "none",
          borderTop: "var(--line-heavy) solid var(--color-ink)",
          margin: "var(--space-2xl) 0 var(--space-xl)",
        }}
      />

      <section aria-labelledby="accent-group-heading">
        <p
          id="accent-group-heading"
          style={{
            fontFamily: "var(--font-label)",
            fontSize: "var(--text-label)",
            letterSpacing: "var(--tracking-label)",
            textTransform: "uppercase",
            color: "var(--color-ink-secondary)",
            marginBottom: "var(--space-md)",
            paddingBottom: "var(--space-xs)",
            borderBottom: "var(--line-ghost) solid var(--color-ink-ghost)",
          }}
        >
          {t("group_accent")}
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-xl)" }}>
          {ACCENT_TOKENS.map((token) => (
            <ColorSwatch key={token} token={token} />
          ))}
          <article
            data-testid="one-red-rule-card"
            style={{
              border: "var(--line-medium) solid var(--color-ink-ghost)",
              borderLeft: "var(--line-heavy) solid var(--color-active)",
              padding: "var(--space-md) var(--space-lg)",
              maxWidth: "var(--measure-body)",
            }}
          >
            <p className="label" style={{ marginBottom: "var(--space-sm)" }}>
              {t("color_active_named_rule")}
            </p>
            <p
              className="font-body text-ink-secondary"
              style={{
                fontSize: "var(--text-body)",
                lineHeight: "var(--leading-body)",
              }}
            >
              {t("color_active_named_rule_body")}
            </p>
          </article>
        </div>
      </section>
    </div>
  );
}
