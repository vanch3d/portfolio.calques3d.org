"use client";

import { useTranslations } from "next-intl";

export type SpecimenRole = "display" | "headline" | "title" | "body" | "label";

const SPECIMEN_STYLES: Record<
  SpecimenRole,
  { className: string; style: React.CSSProperties }
> = {
  display: {
    className: "font-display font-normal italic text-ink",
    style: {
      fontSize: "var(--text-display)",
      lineHeight: "var(--leading-display)",
    },
  },
  headline: {
    className: "font-display font-normal italic text-ink",
    style: {
      fontSize: "var(--text-headline)",
      lineHeight: "var(--leading-headline)",
    },
  },
  title: {
    className: "font-body font-medium text-ink",
    style: {
      fontSize: "var(--text-title)",
      lineHeight: 1.35,
    },
  },
  body: {
    className: "font-body font-normal text-ink",
    style: {
      fontSize: "var(--text-body)",
      lineHeight: "var(--leading-body)",
      maxWidth: "var(--measure-body)",
    },
  },
  label: {
    className: "label",
    style: {},
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
  const { className: specimenClassName, style: specimenStyle } = SPECIMEN_STYLES[role];

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
          className="label"
          style={{ marginBottom: "var(--space-sm)" }}
        >
          {roleLabel}
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.2em" }}>
          {specs.map((spec) => (
            <span
              key={spec}
              className="font-label uppercase text-ink-secondary tabular"
              style={{ fontSize: "0.625rem", letterSpacing: "0.08em" }}
            >
              {spec}
            </span>
          ))}
        </div>
      </div>
      <div>
        <p
          data-testid={`specimen-${role}`}
          className={specimenClassName}
          style={specimenStyle}
        >
          {specimenText}
        </p>
        <p
          className="font-body text-ink-secondary"
          style={{
            fontSize: "0.8125rem",
            lineHeight: 1.55,
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
