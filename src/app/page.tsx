/**
 * / — Home page
 *
 * Rendering: dynamic (next-intl uses headers() internally).
 * Caching handled by Vercel CDN.
 */

import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getAllPositions, getResearchProjectBySlug } from "@/lib/content";
import { HeroSection, type HeroSectionLabels } from "./HeroSection";
import { DualNarrative, type DualNarrativeLabels } from "./DualNarrative";
import { FeaturedWork, type FeaturedWorkLabels } from "./FeaturedWork";
import { CurrentlyBanner, type CurrentlyBannerLabels } from "./CurrentlyBanner";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Metadata");
  return {
    title: t("site_title"),
    description: t("site_description"),
  };
}

export default async function Home() {
  const t = await getTranslations("HomePage");

  const positions = getAllPositions();
  const currentPosition = positions[0];

  // Featured research: SAFeSEA is the only project with a detail page today.
  // Phase C will introduce a proper "featured" flag query.
  const featuredResearch = getResearchProjectBySlug("safesea")!;

  const heroLabels: HeroSectionLabels = {
    heading: t("heading"),
    role: t("role"),
    thesis: t("thesis"),
    heroNavLabel: t("hero_nav_label"),
    ctaResearch: t("cta_research"),
    ctaEngineering: t("cta_engineering"),
    ctaCV: t("cta_cv"),
  };

  const narrativeLabels: DualNarrativeLabels = {
    sectionLabel: t("narrative_section_label"),
    researchEraLabel: t("narrative_research_era"),
    researchEraPeriod: t("narrative_research_period"),
    researchEraBody: t("narrative_research_body"),
    engineeringEraLabel: t("narrative_engineering_era"),
    engineeringEraPeriod: t("narrative_engineering_period"),
    engineeringEraBody: t("narrative_engineering_body"),
  };

  const featuredLabels: FeaturedWorkLabels = {
    heading: t("featured_heading"),
    sectionLabel: t("featured_section_label"),
    researchLabel: t("featured_research_label"),
    engineeringLabel: t("featured_engineering_label"),
    engineeringTitle: t("featured_engineering_title"),
    engineeringPeriod: t("featured_engineering_period"),
    engineeringBody: t("featured_engineering_body"),
    engineeringLink: t("featured_engineering_link"),
    publicationLabel: t("featured_publication_label"),
    publicationBody: t("featured_publication_body"),
    ongoing: t("featured_ongoing"),
  };

  const currentlyLabels: CurrentlyBannerLabels = {
    sectionLabel: t("currently_section_label"),
    prefix: t("currently_prefix"),
    body: t("currently_body"),
    linkLabel: t("currently_link_label"),
  };

  return (
    <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
      <HeroSection labels={heroLabels} />
      <DualNarrative labels={narrativeLabels} />
      <FeaturedWork featuredResearch={featuredResearch} labels={featuredLabels} />
      <CurrentlyBanner position={currentPosition} labels={currentlyLabels} />
    </div>
  );
}
