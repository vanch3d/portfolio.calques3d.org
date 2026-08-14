/**
 * Design System Token Reference
 *
 * TypeScript exports of semantic token names for use in:
 * - Storybook controls and documentation
 * - Token validation scripts
 * - Lab / design explorer components
 *
 * Source of truth: src/app/globals.css
 * DO NOT duplicate raw values here — reference token names only.
 */

/* ============================================================
   COLOUR TOKENS
   ============================================================ */

export const colorTokens = {
  surface: [
    "--color-bg",
    "--color-bg-subtle",
    "--color-bg-muted",
    "--color-bg-elevated",
    "--color-bg-overlay",
  ],
  text: [
    "--color-text",
    "--color-text-muted",
    "--color-text-subtle",
    "--color-text-inverse",
  ],
  border: [
    "--color-border",
    "--color-border-muted",
    "--color-border-strong",
  ],
  accent: [
    "--color-accent",
    "--color-accent-hover",
    "--color-accent-subtle",
    "--color-accent-muted",
    "--color-accent-foreground",
  ],
  state: [
    "--color-success",
    "--color-error",
    "--color-warning",
    "--color-info",
  ],
} as const;

export type ColorToken =
  | (typeof colorTokens.surface)[number]
  | (typeof colorTokens.text)[number]
  | (typeof colorTokens.border)[number]
  | (typeof colorTokens.accent)[number]
  | (typeof colorTokens.state)[number];

/* ============================================================
   SHADOW TOKENS
   ============================================================ */

export const shadowTokens = [
  "--shadow-sm",
  "--shadow-md",
  "--shadow-lg",
  "--shadow-xl",
  "--shadow-glass",
  "--shadow-focus",
] as const;

export type ShadowToken = (typeof shadowTokens)[number];

/* ============================================================
   RADIUS TOKENS
   ============================================================ */

export const radiusTokens = [
  "--radius-sm",
  "--radius-md",
  "--radius-lg",
  "--radius-xl",
  "--radius-2xl",
  "--radius-full",
] as const;

export type RadiusToken = (typeof radiusTokens)[number];

/* ============================================================
   SPACING TOKENS
   ============================================================ */

export const spacingTokens = [
  "--space-1",
  "--space-2",
  "--space-3",
  "--space-4",
  "--space-5",
  "--space-6",
  "--space-8",
  "--space-10",
  "--space-12",
  "--space-16",
  "--space-20",
  "--space-24",
] as const;

export type SpacingToken = (typeof spacingTokens)[number];

/* ============================================================
   LAYOUT TOKENS
   ============================================================ */

export const layoutTokens = [
  "--nav-height",
  "--prose-width",
  "--sidebar-width",
  "--container-max",
] as const;

export type LayoutToken = (typeof layoutTokens)[number];

/* ============================================================
   GLASS TOKENS
   ============================================================ */

export const glassTokens = [
  "--glass-bg",
  "--glass-border",
  "--glass-blur",
] as const;

export type GlassToken = (typeof glassTokens)[number];

/* ============================================================
   ALL TOKENS (flat, for validation scripts)
   ============================================================ */

export const allTokens = [
  ...colorTokens.surface,
  ...colorTokens.text,
  ...colorTokens.border,
  ...colorTokens.accent,
  ...colorTokens.state,
  ...shadowTokens,
  ...radiusTokens,
  ...spacingTokens,
  ...layoutTokens,
  ...glassTokens,
] as const;

export type DesignToken = (typeof allTokens)[number];

/* ============================================================
   ACCENT VARIANTS (for Lab token explorer)
   ============================================================ */

export type AccentVariant = "teal" | "amber";

export const accentVariants: AccentVariant[] = ["teal", "amber"];
