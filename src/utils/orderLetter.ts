import type { Translations } from "@/configs/i18n";

/**
 * The surat pesanan (order letter) a medicine is ordered on. Each kind has its
 * own letter; a narcotics letter holds one medicine.
 */
export const ORDER_LETTER_KINDS = ["REGULAR", "NARCOTIC", "PSYCHOTROPIC", "PRECURSOR", "CERTAIN_DRUG"] as const;
export type OrderLetterKind = (typeof ORDER_LETTER_KINDS)[number];

/** "Narkotika", "Obat-obat tertentu"… */
export function orderLetterKindLabel(kind: OrderLetterKind, t: Translations): string {
  return {
    REGULAR: t.orderLetterRegular,
    NARCOTIC: t.orderLetterNarcotic,
    PSYCHOTROPIC: t.orderLetterPsychotropic,
    PRECURSOR: t.orderLetterPrecursor,
    CERTAIN_DRUG: t.orderLetterCertainDrug,
  }[kind];
}

/** The printed title: "SURAT PESANAN NARKOTIKA". Always Indonesian (a regulatory document). */
export const ORDER_LETTER_TITLE: Record<OrderLetterKind, string> = {
  REGULAR: "SURAT PESANAN",
  NARCOTIC: "SURAT PESANAN NARKOTIKA",
  PSYCHOTROPIC: "SURAT PESANAN PSIKOTROPIKA",
  PRECURSOR: "SURAT PESANAN PREKURSOR FARMASI",
  CERTAIN_DRUG: "SURAT PESANAN OBAT-OBAT TERTENTU",
};

export const isSpecialOrderLetter = (kind: OrderLetterKind): boolean => kind !== "REGULAR";

/** Copies printed by default: special letters are made in at least three. */
export const DEFAULT_ORDER_LETTER_COPIES: Record<OrderLetterKind, number> = {
  REGULAR: 1,
  NARCOTIC: 3,
  PSYCHOTROPIC: 3,
  PRECURSOR: 3,
  CERTAIN_DRUG: 3,
};

const COPIES_KEY = "po-letter-copies";

export function loadOrderLetterCopies(kind: OrderLetterKind): number {
  try {
    const saved = JSON.parse(localStorage.getItem(COPIES_KEY) ?? "{}") as Partial<Record<OrderLetterKind, number>>;
    const n = saved[kind];
    if (typeof n === "number" && n >= 1 && n <= 10) return n;
  } catch {
    /* storage unavailable */
  }
  return DEFAULT_ORDER_LETTER_COPIES[kind];
}

export function saveOrderLetterCopies(kind: OrderLetterKind, copies: number): void {
  try {
    const saved = JSON.parse(localStorage.getItem(COPIES_KEY) ?? "{}") as Record<string, number>;
    localStorage.setItem(COPIES_KEY, JSON.stringify({ ...saved, [kind]: copies }));
  } catch {
    /* storage unavailable */
  }
}

/** What each copy is for: the first is the original for the distributor, the last the pharmacy's file. */
export function orderLetterCopyLabel(index: number, total: number): string | undefined {
  if (total <= 1) return undefined;
  const sheet = `Lembar ${index + 1}`;
  if (index === 0) return `${sheet} · Asli untuk PBF`;
  if (index === total - 1) return `${sheet} · Arsip apotek`;
  return `${sheet} · Salinan untuk PBF`;
}

/** Precursors and obat-obat tertentu: capped per sale when sold without a prescription. */
export const RESTRICTED_SALE_KINDS: OrderLetterKind[] = ["PRECURSOR", "CERTAIN_DRUG"];
export const RESTRICTED_SALE_LIMIT_KEY = "RESTRICTED_SALE_LIMIT";

/** Medicines whose total pieces in the cart go over the no-prescription limit (0 = no limit). */
export function overRestrictedLimit(
  lines: { medicineUuid?: string; quantityPieces: number; restricted?: boolean }[],
  limit: number
): Set<string> {
  if (limit <= 0) return new Set();
  const totals = new Map<string, number>();
  for (const l of lines) if (l.restricted && l.medicineUuid) totals.set(l.medicineUuid, (totals.get(l.medicineUuid) ?? 0) + l.quantityPieces);
  return new Set([...totals].filter(([, qty]) => qty > limit).map(([uuid]) => uuid));
}

/** Narcotics and psychotropics are kept in the locked cabinet. */
export const LOCKED_CABINET_KINDS: OrderLetterKind[] = ["NARCOTIC", "PSYCHOTROPIC"];

export function needsLockedCabinet(kind: OrderLetterKind | null | undefined): boolean {
  return !!kind && LOCKED_CABINET_KINDS.includes(kind);
}

/** Active ingredients that make a medicine an "obat-obat tertentu" (PerBPOM 10/2019). */
const OOT_INGREDIENTS = ["tramadol", "triheksifenidil", "trihexyphenidyl", "klorpromazin", "chlorpromazine", "amitriptilin", "amitriptyline", "haloperidol", "dekstrometorfan", "dextromethorphan"];

/** Pharmaceutical precursor ingredients. */
const PRECURSOR_INGREDIENTS = ["efedrin", "ephedrine", "pseudoefedrin", "pseudoephedrine", "norefedrin", "norephedrine", "fenilpropanolamin", "phenylpropanolamine", "ergometrin", "ergometrine", "ergotamin", "ergotamine", "metilergometrin", "methylergometrine", "kalium permanganat", "potassium permanganate"];

/** The special order letter its ingredients point to, if any. */
export function suggestOrderLetterKind(ingredientNames: string[]): OrderLetterKind | null {
  const names = ingredientNames.map((n) => n.toLowerCase());
  const has = (list: string[]): boolean => names.some((n) => list.some((x) => n.includes(x)));
  if (has(OOT_INGREDIENTS)) return "CERTAIN_DRUG";
  if (has(PRECURSOR_INGREDIENTS)) return "PRECURSOR";
  return null;
}

/** Narcotics and psychotropics are only dispensed on a prescription. */
export const PRESCRIPTION_ONLY_KINDS: OrderLetterKind[] = ["NARCOTIC", "PSYCHOTROPIC"];
