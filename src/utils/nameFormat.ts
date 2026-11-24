import { toDoctorName, toTitleCase } from "@/utils/stringHelpers";

/** Per-pharmacy display preference for names (business parameter NAME_DISPLAY_CASE). */
export type NameCase = "UPPER" | "TITLE" | "LOWER" | "AS_TYPED";

export const NAME_CASES: NameCase[] = ["UPPER", "TITLE", "LOWER", "AS_TYPED"];

export const isNameCase = (v: unknown): v is NameCase => NAME_CASES.includes(v as NameCase);

/**
 * Formats a stored name (medicine, distributor, patient, doctor, classification…)
 * the way this pharmacy wants it shown and printed. Codes, labels and headers
 * are not names and must not go through this.
 */
export function formatName(
  name: string | null | undefined,
  mode: NameCase,
  opts: { doctor?: boolean } = {}
): string {
  if (!name) return "";
  switch (mode) {
    case "UPPER":
      return name.toUpperCase();
    case "LOWER":
      return name.toLowerCase();
    case "TITLE":
      return opts.doctor ? toDoctorName(name) : toTitleCase(name);
    default:
      return name;
  }
}
