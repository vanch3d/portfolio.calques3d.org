/**
 * ObfuscatedEmail
 *
 * Renders an email address obfuscated against naive scraper harvesting.
 *
 * Technique: the address is stored reversed in the HTML source and visually
 * corrected with CSS `direction: rtl` + `unicode-bidi: bidi-override`.
 * Scrapers reading raw HTML see a meaningless reversed string; browsers render
 * it correctly. `aria-label` ensures screen readers announce the real address.
 *
 * Limitation: the `mailto:` href is still present in plain text in the source.
 * This is acceptable for a first pass — see the component tests for context.
 * A follow-up can replace the href with a click-time assembly approach if needed.
 *
 * Server Component — no "use client" required.
 */

export interface ObfuscatedEmailProps {
  email: string;
  label?: string;
  className?: string;
}

export function ObfuscatedEmail({
  email,
  label,
  className,
}: ObfuscatedEmailProps) {
  const reversed = email.split("").reverse().join("");

  return (
    <a
      href={`mailto:${email}`}
      aria-label={label ?? email}
      className={className}
      style={{ unicodeBidi: "bidi-override", direction: "rtl" }}
    >
      {reversed}
    </a>
  );
}
