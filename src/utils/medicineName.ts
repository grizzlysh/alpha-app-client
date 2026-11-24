/**
 * Structured medicine names, the same rules as the server: base name, the
 * ingredients' strength, the shape and a variant, in the pharmacy's format.
 * Used for the live preview while typing; the server builds the stored name.
 */

export const MEDICINE_NAME_FORMATS = ["NAME_STRENGTH_SHAPE", "NAME_SHAPE_STRENGTH", "NAME_STRENGTH"] as const;
export type MedicineNameFormat = (typeof MEDICINE_NAME_FORMATS)[number];

export const isMedicineNameFormat = (v: unknown): v is MedicineNameFormat =>
  typeof v === "string" && (MEDICINE_NAME_FORMATS as readonly string[]).includes(v);

/** "10mg" → "10 mg", "250mg / 5ml" → "250 mg/5 ml". */
export function normalizeStrength(s: string): string {
  return s
    .trim()
    .replace(/\s+/g, " ")
    .replace(/(\d)\s*([a-zA-Zµ%])/g, "$1 $2")
    .replace(/\s*\/\s*/g, "/");
}

const AMOUNT = /^(\d+(?:[.,]\d+)?) (\S.*)$/;

/** One strength as is; several with the same unit as "500/50 mg"; otherwise joined with " + ". */
export function combinedStrength(strengths: (string | null | undefined)[]): string {
  const list = strengths.filter((s): s is string => !!s?.trim()).map(normalizeStrength);
  if (list.length <= 1) return list[0] ?? "";
  const parts = list.map((s) => AMOUNT.exec(s));
  const unit = parts[0]?.[2];
  if (parts.every((p) => p && p[2] === unit)) return `${parts.map((p) => p![1]).join("/")} ${unit}`;
  return list.join(" + ");
}

export interface MedicineNameParts {
  baseName: string;
  strengths: (string | null | undefined)[];
  shape: string;
  variant?: string | null;
}

export function buildMedicineName(format: MedicineNameFormat, p: MedicineNameParts): string {
  const strength = combinedStrength(p.strengths);
  const order: Record<MedicineNameFormat, string[]> = {
    NAME_STRENGTH_SHAPE: [p.baseName, strength, p.shape],
    NAME_SHAPE_STRENGTH: [p.baseName, p.shape, strength],
    NAME_STRENGTH: [p.baseName, strength],
  };
  return [...order[format], p.variant ?? ""]
    .map((x) => x.trim())
    .filter(Boolean)
    .join(" ")
    .replace(/\s+/g, " ");
}
