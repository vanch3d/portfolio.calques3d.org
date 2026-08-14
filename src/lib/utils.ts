import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges Tailwind CSS classes with conflict resolution.
 * Uses clsx for conditional class logic and tailwind-merge to
 * resolve Tailwind utility conflicts (e.g. p-2 vs p-4).
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
