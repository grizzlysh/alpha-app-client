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
