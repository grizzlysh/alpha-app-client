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
