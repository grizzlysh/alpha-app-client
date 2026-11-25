import type { Translations } from "@/configs/i18n";
import { type LabelFields, type LabelSize, type LabelText, type PrintMode, LABEL_SIZES } from "./barcodeLabels";

const PREFS_KEY = "barcode-print-prefs-v3";

export const LABEL_FIELDS: (keyof LabelFields)[] = ["showStock", "showExpiry", "showPrice"];

/**
 * The same label either way; a label stuck on a pack leaves out the stock,
 * which is out of date as soon as a pack is sold.
 */
const DEFAULT_FIELDS: Record<PrintMode, LabelFields> = {
  "per-pack": { showStock: false, showExpiry: true, showPrice: false },
  "per-batch": { showStock: true, showExpiry: true, showPrice: false },
};

/** Label size and fields follow the device (each till has its own printer). */
export interface PrintPrefs {
  size: LabelSize;
  fields: Record<PrintMode, LabelFields>;
}

export function loadPrefs(): PrintPrefs {
  const fallback: PrintPrefs = { size: "50x30", fields: DEFAULT_FIELDS };
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    if (!raw) return fallback;
    const p = JSON.parse(raw) as Partial<PrintPrefs>;
    return {
      size: p.size && LABEL_SIZES.some((s) => s.value === p.size) ? p.size : fallback.size,
      fields: {
        "per-pack": { ...DEFAULT_FIELDS["per-pack"], ...p.fields?.["per-pack"] },
        "per-batch": { ...DEFAULT_FIELDS["per-batch"], ...p.fields?.["per-batch"] },
      },
    };
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

/** Toggles one field for one print mode. */
export function toggleField(prefs: PrintPrefs, mode: PrintMode, field: keyof LabelFields): PrintPrefs {
  return { ...prefs, fields: { ...prefs.fields, [mode]: { ...prefs.fields[mode], [field]: !prefs.fields[mode][field] } } };
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
