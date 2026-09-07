/**
 * IdentityBlock — name, era label, and positioning sentence.
 *
 * Absolutely positioned over the CareerArc, anchored upper-left (V4b R2).
 * The clamp top offset is a genuinely dynamic/computed value — legitimately
 * in style={} per project conventions.
 *
 * The h1 element carries id="canvas-name" so HomepageScrollHandler can target
 * it to fade opacity 1→0 as the user scrolls into the below-fold section.
 * The transition is defined here in className; JS sets style.opacity directly.
 *
 * Token classes used:
 *   left-page                       — page margin from spacing tokens
 *   max-w-identity-max-width        — 52ch column cap from spacing tokens
 *   text-positioning                — fluid font size from typography tokens
 *   leading-caption                 — 1.55 leading from typography tokens
 *   max-w-identity-text-max-width   — 46ch text column cap from spacing tokens
 */

import { getTranslations } from "next-intl/server";

export async function IdentityBlock() {
  const t = await getTranslations("HomePage");

  return (
    <div
      id="canvas-identity"
      className="absolute z-10 left-page max-w-identity-max-width"
      style={{ top: "clamp(6rem, 14vh, 8rem)" }}
    >
      <p className="label flex items-center gap-md mb-sm">
        <span
          className="inline-block w-lg border-t-medium border-ink-secondary"
          aria-hidden="true"
        />
        {t("title")}
      </p>

      <h1
        id="canvas-name"
        className="font-display italic text-display leading-display text-ink mb-md transition-opacity duration-[350ms] ease-linear"
      >
        {t("name")}
      </h1>

      <p className="font-body text-positioning leading-caption text-ink-secondary max-w-identity-text-max-width">
        {t("positioning")}
      </p>
    </div>
  );
}
