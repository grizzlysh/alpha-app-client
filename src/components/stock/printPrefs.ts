import type { Translations } from "@/configs/i18n";
import { type LabelFields, type LabelKind, type LabelSize, type LabelText, LABEL_SIZES } from "./barcodeLabels";

const PREFS_KEY = "barcode-print-prefs-v2";

/** The fields each label kind can show (stock only means something for the whole batch). */
export const FIELDS_BY_KIND: Record<LabelKind, (keyof LabelFields)[]> = {
  "batch-label": ["showStock", "showExpiry", "showPrice"],
  "item-label": ["showExpiry", "showContents", "showPrice"],
  "medicine-label": ["showStock", "showPrice"],
};

const DEFAULT_FIELDS: Record<LabelKind, LabelFields> = {
  "batch-label": { showStock: true, showExpiry: true, showContents: false, showPrice: false },
  "item-label": { showStock: false, showExpiry: true, showContents: true, showPrice: false },
  "medicine-label": { showStock: true, showExpiry: false, showContents: false, showPrice: true },
};

/** Label size and fields follow the device (each till has its own printer). */
export interface PrintPrefs {
  size: LabelSize;
  fields: Record<LabelKind, LabelFields>;
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
        "batch-label": { ...DEFAULT_FIELDS["batch-label"], ...p.fields?.["batch-label"], showContents: false },
        "item-label": { ...DEFAULT_FIELDS["item-label"], ...p.fields?.["item-label"], showStock: false },
        "medicine-label": { ...DEFAULT_FIELDS["medicine-label"], ...p.fields?.["medicine-label"], showExpiry: false, showContents: false },
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

/** Toggles one field of one kind. */
export function toggleField(prefs: PrintPrefs, kind: LabelKind, field: keyof LabelFields): PrintPrefs {
  return { ...prefs, fields: { ...prefs.fields, [kind]: { ...prefs.fields[kind], [field]: !prefs.fields[kind][field] } } };
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
