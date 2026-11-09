import type { Allergy, AllergySeverity } from "@/types/medicalRecord";

// Colour is reserved for allergy severity only; everything else stays neutral
// so the one thing that matters clinically stands out.
export const SEVERITY_DOT: Record<AllergySeverity, string> = {
  MILD: "bg-amber-400",
  MODERATE: "bg-orange-500",
  SEVERE: "bg-destructive",
};

export const SEVERITY_TEXT: Record<AllergySeverity, string> = {
  MILD: "text-amber-700 dark:text-amber-400",
  MODERATE: "text-orange-700 dark:text-orange-400",
  SEVERE: "text-destructive",
};

const SEVERITY_ORDER: Record<AllergySeverity, number> = { SEVERE: 0, MODERATE: 1, MILD: 2 };

export function sortBySeverity(list: Allergy[]): Allergy[] {
  return [...list].sort((a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity]);
}
