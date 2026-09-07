"use client";

import { useHomepageScroll } from "@/lib/hooks/useHomepageScroll";

export function HomepageScrollHandler() {
  useHomepageScroll({ heroId: "hero", navId: "site-nav", nameId: "canvas-name" });
  return null;
}
