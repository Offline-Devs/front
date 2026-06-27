/**
 * @file lib/cn.ts
 * @description Tailwind CSS class merging utility.
 *
 * cn(...inputs) — combines clsx (conditional class joining) with tailwind-merge
 *   (conflict resolution for Tailwind utilities). Components use this helper to
 *   accept safe className overrides without generating broken utility combinations
 *   such as "px-4 px-8" (which would apply the first and override with the second).
 */
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Combines conditional class names and resolves conflicting Tailwind utilities so reusable components can accept safe style overrides.
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
