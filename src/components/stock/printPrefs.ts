import type { Translations } from "@/configs/i18n";
import { type LabelSize, type LabelText, LABEL_SIZES } from "./barcodeLabels";

const PREFS_KEY = "barcode-print-prefs-v4";

/** The label size follows the device (each till has its own printer). */
export interface PrintPrefs {
  size: LabelSize;
}

export function loadPrefs(): PrintPrefs {
  const fallback: PrintPrefs = { size: "50x30" };
  try {
    const raw = localStorage.getItem(PREFS_KEY) ?? localStorage.getItem("barcode-print-prefs-v3");
    if (!raw) return fallback;
    const p = JSON.parse(raw) as Partial<PrintPrefs>;
    return { size: p.size && LABEL_SIZES.some((s) => s.value === p.size) ? p.size : fallback.size };
  } catch {
    return fallback;
  }
}

export function savePrefs(prefs: PrintPrefs): void {
  try {
    localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
  } catch {
    // not remembered; printing still works
  }
}

/** Text printed on labels and cards, in the user's language. */
export function labelText(t: Translations): LabelText {
  return {
    batch: t.labelBatch,
    expiry: t.labelExpiry,
    stock: t.labelStock,
    totalStock: t.labelTotalStock,
    contents: t.labelContents,
    item: t.labelItem,
    box: t.labelBox,
    allBatches: t.labelAllBatches,
    stockCard: t.labelStockCard,
    lockedCabinet: t.lockedCabinet,
    packaging: t.labelPackaging,
    location: t.labelLocation,
    minStock: t.labelMinStock,
    date: t.labelDate,
    notes: t.labelNotes,
    period: t.labelPeriod,
    salesCount: t.labelSalesCount,
    adjustmentsCount: t.labelAdjustmentsCount,
    batchesInStock: t.labelBatchesInStock,
    in: t.labelIn,
    out: t.labelOut,
    balance: t.labelBalance,
    initials: t.labelInitials,
    openingBalance: t.labelOpeningBalance,
    printedOn: t.labelPrintedOn,
    page: t.labelPage,
  };
}

/** Shrink the A4 sheet and A5 card to fit; enlarge small thermal labels to read. */
export function previewZoom(document: "card" | LabelSize): number {
  if (document === "card") return 0.6;
  return document === "a4-64x34" ? 0.5 : 1.4;
}
