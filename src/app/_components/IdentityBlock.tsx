/**
 * IdentityBlock — name, era label, and positioning sentence.
 *
 * Absolutely positioned over the CareerArc, anchored bottom-left.
 * The era label carries a leading ruled line (decorative span, aria-hidden).
 *
 * Token classes used:
 *   bottom-identity-bottom      — fluid clamp from spacing tokens
 *   left-page                   — page margin from spacing tokens
 *   max-w-identity-max-width    — 52ch column cap from spacing tokens
 *   text-positioning            — fluid font size from typography tokens
 *   leading-caption             — 1.55 leading from typography tokens
 *   max-w-identity-text-max-width — 46ch text column cap from spacing tokens
 */

import { getTranslations } from "next-intl/server";

export async function IdentityBlock() {
  const t = await getTranslations("HomePage");

  return (
    <div className="absolute z-10 bottom-identity-bottom left-page max-w-identity-max-width">
      {/* Era label with leading rule */}
      <p className="label flex items-center gap-md mb-sm">
        <span className="inline-block w-lg border-t-medium border-ink-secondary" aria-hidden="true" />
        {t("title")}
      </p>

      {/* Display name — two lines, non-breaking space holds "Van Labeke" together */}
      <h1 className="font-display italic text-display leading-display text-ink mb-md">
          {t("name")}

      </h1>

      {/* Positioning sentence */}
      <p className="font-body text-positioning leading-caption text-ink-secondary max-w-identity-text-max-width">
        {t("positioning")}
      </p>
    </div>
  );
}
