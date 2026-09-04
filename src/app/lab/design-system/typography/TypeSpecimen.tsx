"use client";

import { useTranslations } from "next-intl";

export type SpecimenRole = "display" | "headline" | "title" | "body" | "label";

const SPECIMEN_STYLES: Record<SpecimenRole, React.CSSProperties> = {
  display: {
    fontFamily: "var(--font-display)",
    fontSize: "var(--text-display)",
    fontWeight: 400,
    fontStyle: "italic",
    lineHeight: "var(--leading-display)",
    color: "var(--color-ink)",
  },
  headline: {
    fontFamily: "var(--font-display)",
    fontSize: "var(--text-headline)",
    fontWeight: 400,
    fontStyle: "italic",
    lineHeight: "var(--leading-headline)",
    color: "var(--color-ink)",
  },
  title: {
    fontFamily: "var(--font-body)",
    fontSize: "var(--text-title)",
    fontWeight: 500,
    lineHeight: 1.35,
    color: "var(--color-ink)",
  },
  body: {
    fontFamily: "var(--font-body)",
    fontSize: "var(--text-body)",
    fontWeight: 400,
    lineHeight: "var(--leading-body)",
    color: "var(--color-ink)",
    maxWidth: "var(--measure-body)",
  },
  label: {
    fontFamily: "var(--font-label)",
    fontSize: "var(--text-label)",
    fontWeight: 400,
    letterSpacing: "var(--tracking-label)",
    textTransform: "uppercase",
    color: "var(--color-ink-secondary)",
    fontVariantNumeric: "tabular-nums",
  },
};

const SPECS_BY_ROLE: Record<
  SpecimenRole,
  (t: ReturnType<typeof useTranslations<"LabTypography">>) => string[]
> = {
  display: (t) => [
    t("spec_stix"),
    t("spec_italic"),
    t("spec_display_size"),
    t("spec_leading_display"),
  ],
  headline: (t) => [
    t("spec_stix"),
    t("spec_italic"),
    t("spec_headline_size"),
    t("spec_leading_headline"),
  ],
  title: (t) => [
    t("spec_spectral"),
    t("spec_medium_500"),
    t("spec_title_size"),
    t("spec_leading_title"),
  ],
  body: (t) => [
    t("spec_spectral"),
    t("spec_regular"),
    t("spec_body_size"),
    t("spec_leading_body"),
    t("spec_measure"),
  ],
  label: (t) => [
    t("spec_departure"),
    t("spec_regular"),
    t("spec_label_size"),
    t("spec_tracking"),
    t("spec_uppercase"),
  ],
};

type TypeSpecimenProps = {
  role: SpecimenRole;
};

export function TypeSpecimen({ role }: TypeSpecimenProps) {
  const t = useTranslations("LabTypography");

  const roleLabel  = t(`role_${role}`);
  const specimenText = t(`specimen_${role}`);
  const rationale  = t(`rationale_${role}`);
  const specs      = SPECS_BY_ROLE[role](t);
  const style      = SPECIMEN_STYLES[role];

  return (
    <li
      data-testid={`type-specimen-${role}`}
      style={{
        display: "grid",
        gridTemplateColumns: "180px 1fr",
        gap: "var(--space-lg)",
        padding: "var(--space-lg) 0",
        borderTop: "var(--line-ghost) solid var(--color-ink-ghost)",
        alignItems: "start",
        listStyle: "none",
      }}
    >
      <div style={{ paddingTop: "0.2em" }}>
        <p
          style={{
            fontFamily: "var(--font-label)",
            fontSize: "var(--text-label)",
            letterSpacing: "var(--tracking-label)",
            textTransform: "uppercase",
            color: "var(--color-ink-secondary)",
            marginBottom: "var(--space-sm)",
          }}
        >
          {roleLabel}
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.2em" }}>
          {specs.map((spec) => (
            <span
              key={spec}
              style={{
                fontFamily: "var(--font-label)",
                fontSize: "0.625rem",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--color-ink-secondary)",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {spec}
            </span>
          ))}
        </div>
      </div>
      <div>
        <p data-testid={`specimen-${role}`} style={style}>
          {specimenText}
        </p>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.8125rem",
            lineHeight: 1.55,
            color: "var(--color-ink-secondary)",
            marginTop: "var(--space-sm)",
            maxWidth: "52ch",
          }}
        >
          {rationale}
        </p>
      </div>
    </li>
  );
}
