"use client";

/**
 * SiteNav — fixed top navigation bar, scroll-revealed.
 *
 * Hidden by default (translateY(-100%)), slides in when the `nav-visible` CSS class
 * is added by HomepageScrollHandler at 30% hero scroll progress.
 *
 * Layout (from approved comp homepage-comp-v4b-r2.html):
 *   STIX italic name (aria-hidden, fades in with 0.2s delay) ·
 *   flex spacer rule · nav link list
 *
 * One Red Rule: the contact link ("···") is the single active element — border
 * and text in --color-active.
 *
 * i18n: all strings from HomePage namespace.
 */

import Link from "next/link";
import type { Route } from "next";
import { useTranslations } from "next-intl";

type SiteNavProps = {
  id?: string;
};

export function SiteNav({ id }: SiteNavProps) {
  const t = useTranslations("HomePage");

  return (
    <nav
      id={id}
      aria-label={t("nav_aria_label")}
      className="fixed top-0 left-0 right-0 h-nav bg-ground border-b-medium border-ink-ghost flex items-center px-page gap-lg z-nav nav-hidden"
    >
      <span
        aria-hidden="true"
        className="font-display italic text-body text-ink whitespace-nowrap shrink-0 opacity-0 [.nav-visible_&]:opacity-100 transition-opacity duration-nav-fade delay-nav-name ease-linear"
      >
        {t("name")}
      </span>

      <span
        aria-hidden="true"
        className="flex-1 border-t-ghost border-ink-ghost"
      />

      <ul className="flex items-center gap-dense list-none">
        <li>
          <Link href="/research" className="label text-ink-secondary hover:text-ink transition-colors">
            {t("nav_research")}
          </Link>
        </li>
        <li>
          <Link href="/engineering" className="label text-ink-secondary hover:text-ink transition-colors">
            {t("nav_engineering")}
          </Link>
        </li>
        <li>
          <Link href={"/research/publications" as Route} className="label text-ink-secondary hover:text-ink transition-colors">
            {t("nav_publications")}
          </Link>
        </li>
        <li>
          <Link href="/lab" className="label text-ink-secondary hover:text-ink transition-colors">
            {t("nav_lab")}
          </Link>
        </li>
        <li>
          <Link
            href={"/contact" as Route}
            aria-label={t("nav_contact_aria")}
            className="label text-active border-medium border-active px-sm py-xs hover:text-ink hover:border-ink transition-colors"
          >
            {t("nav_contact")}
          </Link>
        </li>
      </ul>
    </nav>
  );
}
