import type { Translations } from "@/configs/i18n";
import type { ShiftStatus } from "@/types/shift";

export { formatCurrency } from "@/components/sales/salesUtils";

/** Digits typed into an amount field → number (empty → 0). */
export const parseAmount = (raw: string): number => Number(raw.replace(/[^0-9]/g, "") || 0);

export const shiftStatusLabel = (status: ShiftStatus, t: Translations): string =>
  status === "OPEN" ? t.shiftStatusOpen : t.shiftStatusClosed;

export function differenceLabel(difference: number, t: Translations): string {
  if (Math.abs(difference) < 0.005) return t.shiftDifferenceNone;
  return difference > 0 ? t.shiftDifferenceOver : t.shiftDifferenceShort;
}

/** Tailwind text colour for a cash difference (balanced / over / short). */
export function differenceTone(difference: number): string {
  if (Math.abs(difference) < 0.005) return "text-success";
  return difference > 0 ? "text-warning" : "text-destructive";
}
