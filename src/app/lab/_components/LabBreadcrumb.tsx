import { getTranslations } from "next-intl/server";
import { NavLink } from "@/components/ui/NavLink";

type BreadcrumbSegment = {
  label: string;
  href: string;
};

type LabBreadcrumbProps = {
  /** Intermediate segments between "Lab" and the current page. Empty for direct lab children. */
  extra?: BreadcrumbSegment[];
  /** Current page label — displayed without a link, aria-current="page". */
  current: string;
};

const Separator = () => (
  <li
    aria-hidden="true"
    className="label text-ink-ghost"
    style={{ margin: "0 var(--space-sm)" }}
  >
    /
  </li>
);

export async function LabBreadcrumb({ extra = [], current }: LabBreadcrumbProps) {
  const t = await getTranslations("LabNav");

  return (
    <nav
      aria-label={t("nav_aria_label")}
      style={{
        paddingBottom: "var(--space-sm)",
        borderBottom: "var(--line-ghost) solid var(--color-ink-ghost)",
        marginBottom: "var(--space-xl)",
      }}
    >
      <ol
        style={{
          listStyle: "none",
          padding: 0,
          margin: 0,
          display: "flex",
          alignItems: "baseline",
        }}
      >
        <li>
          <NavLink href="/">{t("site_name")}</NavLink>
        </li>
        <Separator />
        <li>
          <NavLink href="/lab">{t("nav_lab")}</NavLink>
        </li>
        {extra.map((seg) => (
          <>
            <Separator />
            <li key={seg.href}>
              <NavLink href={seg.href}>{seg.label}</NavLink>
            </li>
          </>
        ))}
        <Separator />
        <li>
          <span aria-current="page" className="label text-ink">
            {current}
          </span>
        </li>
      </ol>
    </nav>
  );
}
