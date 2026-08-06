/**
 * useFeatureFlag — reads a feature flag with localStorage override support.
 *
 * Resolution order (highest priority first):
 *  1. localStorage `feature:<key>` — set by /lab/features
 *  2. NEXT_PUBLIC_FEATURE_<KEY> env var — set at build time
 *  3. defaultEnabled from FEATURE_FLAGS definition
 *
 * Uses useSyncExternalStore so the server snapshot matches the env-var/default
 * value (no hydration mismatch), and the client snapshot picks up localStorage.
 */

"use client";

import { useSyncExternalStore } from "react";
import {
  type FeatureFlagKey,
  FEATURE_STORAGE_PREFIX,
  getServerFlagDefault,
} from "@/lib/features";

function getLocalOverride(key: FeatureFlagKey): boolean | null {
  try {
    const raw = localStorage.getItem(`${FEATURE_STORAGE_PREFIX}${key}`);
    if (raw === "true") return true;
    if (raw === "false") return false;
  } catch {
    // localStorage unavailable (SSR guard, private browsing)
  }
  return null;
}

function subscribe(callback: () => void): () => void {
  window.addEventListener("storage", callback);
  // Custom event for same-tab updates (storage event only fires in other tabs)
  window.addEventListener(`feature-flag-change:${String}`, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(`feature-flag-change:${String}`, callback);
  };
}

export function useFeatureFlag(key: FeatureFlagKey): boolean {
  const serverDefault = getServerFlagDefault(key);

  return useSyncExternalStore(
    (callback) => {
      const handler = (e: Event) => {
        // Only re-render if this flag's key changed
        if (e instanceof StorageEvent && e.key !== `${FEATURE_STORAGE_PREFIX}${key}`) return;
        callback();
      };
      window.addEventListener("storage", handler);
      window.addEventListener(`feature-flag-change`, handler);
      return () => {
        window.removeEventListener("storage", handler);
        window.removeEventListener(`feature-flag-change`, handler);
      };
    },
    // Client snapshot: localStorage override → env default
    () => getLocalOverride(key) ?? serverDefault,
    // Server snapshot: env default (no localStorage on server)
    () => serverDefault,
  );
}

/**
 * Sets a feature flag override in localStorage and dispatches an event
 * so all useFeatureFlag consumers in the same tab update immediately.
 */
export function setFeatureFlag(key: FeatureFlagKey, enabled: boolean): void {
  try {
    localStorage.setItem(`${FEATURE_STORAGE_PREFIX}${key}`, String(enabled));
    window.dispatchEvent(new Event("feature-flag-change"));
  } catch {
    // localStorage unavailable
  }
}

/**
 * Clears a localStorage override, reverting to env/default.
 */
export function resetFeatureFlag(key: FeatureFlagKey): void {
  try {
    localStorage.removeItem(`${FEATURE_STORAGE_PREFIX}${key}`);
    window.dispatchEvent(new Event("feature-flag-change"));
  } catch {
    // localStorage unavailable
  }
}
