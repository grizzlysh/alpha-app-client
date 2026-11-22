import type { JSX } from "react";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { ClipboardList, Loader2, Printer, ScanBarcode, Tag } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/hooks/useLanguage";
import { useNameFormat } from "@/hooks/useNameFormat";
import { getStockCard } from "@/service/stockService";
import { cn } from "@/utils/cn";
import type { Translations } from "@/configs/i18n";
import {
  type LabelSize,
  type LabelText,
  type PrintKind,
  LABEL_SIZES,
  labelsDocument,
  printDocument,
  stockCardDocument,
} from "./barcodeLabels";

const PREFS_KEY = "barcode-print-prefs";

/** Label size and price switch follow the device (each till has its own printer). */
interface PrintPrefs {
  size: LabelSize;
  showPrice: boolean;
}

function loadPrefs(): PrintPrefs {
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    if (raw) {
      const p = JSON.parse(raw) as Partial<PrintPrefs>;
      if (p.size && LABEL_SIZES.some((s) => s.value === p.size)) return { size: p.size, showPrice: !!p.showPrice };
    }
  } catch {
    // storage unavailable: use defaults
  }
  return { size: "50x30", showPrice: false };
}

function savePrefs(prefs: PrintPrefs): void {
  try {
    localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
  } catch {
    // not remembered; printing still works
  }
}

function labelText(t: Translations): LabelText {
  return {
    batch: t.labelBatch,
    expiry: t.labelExpiry,
    stock: t.labelStock,
    allBatches: t.labelAllBatches,
    stockCard: t.labelStockCard,
    packaging: t.labelPackaging,
    distributor: t.labelDistributor,
    location: t.labelLocation,
    minStock: t.labelMinStock,
    date: t.labelDate,
    document: t.labelDocument,
    fromTo: t.labelFromTo,
    in: t.labelIn,
    out: t.labelOut,
    balance: t.labelBalance,
    initials: t.labelInitials,
    openingBalance: t.labelOpeningBalance,
    printedOn: t.labelPrintedOn,
    page: t.labelPage,
  };
}

export interface BarcodePrintModalProps {
  stockDetailUuid: string;
  /** Which document is selected first. */
  initialKind?: PrintKind;
  onClose: () => void;
}

/** Print a batch label, the medicine's shelf label or the batch's stock card. */
export function BarcodePrintModal({ stockDetailUuid, initialKind = "batch-label", onClose }: BarcodePrintModalProps): JSX.Element {
  const { t, language } = useLanguage();
  const fmt = useNameFormat();
  const locale = language === "id" ? "id-ID" : "en-GB";
  const [kind, setKind] = useState<PrintKind>(initialKind);
  const [prefs, setPrefs] = useState<PrintPrefs>(loadPrefs);
  const [copies, setCopies] = useState<string>("");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["stock-card", stockDetailUuid],
    queryFn: () => getStockCard(stockDetailUuid),
  });
  const card = data?.data;

  // Default number of batch labels: one per box of the batch's current stock.
  const defaultCopies = card && kind === "batch-label" ? Math.max(1, Math.ceil(card.batch.quantityPieces / Math.max(card.batch.quantityPerBox, 1))) : 1;
  const copiesValue = copies === "" ? defaultCopies : Math.max(1, Math.min(500, Number(copies) || 1));
  const missingMedicineCode = kind === "medicine-label" && card && !card.medicine.barcode;

  const text = useMemo(() => labelText(t), [t]);
  const formatName = (name: string): string => fmt(name);

  function documentHtml(forPreview: boolean): string | null {
    if (!card || missingMedicineCode) return null;
    if (kind === "stock-card") return stockCardDocument(card, text, { locale, formatName });
    return labelsDocument(kind, card, text, {
      size: prefs.size,
      copies: forPreview ? Math.min(copiesValue, prefs.size === "a4-64x34" ? 24 : 1) : copiesValue,
      showPrice: prefs.showPrice,
      locale,
      formatName,
    });
  }

  const preview = documentHtml(true);
  // Shrink the A4 sheet and A5 card to fit; enlarge small thermal labels to read.
  const previewZoom = kind === "stock-card" ? 0.6 : prefs.size === "a4-64x34" ? 0.5 : 1.5;

  function updatePrefs(next: Partial<PrintPrefs>): void {
    const merged = { ...prefs, ...next };
    setPrefs(merged);
    savePrefs(merged);
  }

  function handlePrint(): void {
    const html = documentHtml(false);
    if (!html || !card) return;
    const title = `${kind === "stock-card" ? t.printStockCard : t.printTitle} · ${card.medicine.name} · ${card.batch.batchNumber}`;
    if (!printDocument(title, html)) toast.error(t.printPopupBlocked);
  }

  const kinds: { value: PrintKind; label: string; hint: string; icon: JSX.Element }[] = [
    { value: "batch-label", label: t.printBatchLabel, hint: t.printBatchLabelHint, icon: <ScanBarcode className="h-4 w-4" /> },
    { value: "medicine-label", label: t.printMedicineLabel, hint: t.printMedicineLabelHint, icon: <Tag className="h-4 w-4" /> },
    { value: "stock-card", label: t.printStockCard, hint: t.printStockCardHint, icon: <ClipboardList className="h-4 w-4" /> },
  ];
  const sizeLabel: Record<LabelSize, string> = {
    "50x30": t.printSizeThermal5030,
    "38x25": t.printSizeThermal3825,
    "a4-64x34": t.printSizeA4,
  };

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Printer className="h-5 w-5 text-primary" />
            {t.printTitle}
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex h-48 items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : isError || !card ? (
          <p className="py-10 text-center text-sm text-muted-foreground">{t.unexpectedError}</p>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-[minmax(0,17rem)_minmax(0,1fr)]">
            {/* Options */}
            <div className="space-y-4">
              <div className="space-y-1.5" role="radiogroup" aria-label={t.printTitle}>
                {kinds.map((k) => (
                  <button
                    key={k.value}
                    type="button"
                    role="radio"
                    aria-checked={kind === k.value}
                    onClick={() => {
                      setKind(k.value);
                      setCopies("");
                    }}
                    className={cn(
                      "flex w-full items-start gap-3 rounded-xl border px-3 py-2.5 text-left transition-colors",
                      kind === k.value ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50"
                    )}
                  >
                    <span className={cn("mt-0.5", kind === k.value ? "text-primary" : "text-muted-foreground")}>{k.icon}</span>
                    <span className="min-w-0">
                      <span className="block text-sm font-medium text-foreground">{k.label}</span>
                      <span className="block text-xs text-muted-foreground">{k.hint}</span>
                    </span>
                  </button>
                ))}
              </div>

              {kind !== "stock-card" && (
                <>
                  <div className="space-y-1.5">
                    <Label htmlFor="print-size">{t.printSize}</Label>
                    <select
                      id="print-size"
                      value={prefs.size}
                      onChange={(e) => updatePrefs({ size: e.target.value as LabelSize })}
                      className="h-10 w-full rounded-xl border border-input bg-card px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                    >
                      {LABEL_SIZES.map((s) => (
                        <option key={s.value} value={s.value}>{sizeLabel[s.value]}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="print-copies">{t.printCopies}</Label>
                    <Input
                      id="print-copies"
                      type="number"
                      inputMode="numeric"
                      min={1}
                      max={500}
                      value={copies === "" ? String(defaultCopies) : copies}
                      onChange={(e) => setCopies(e.target.value)}
                      className="w-28 rounded-xl"
                    />
                  </div>
                  <label className="flex items-center gap-2 text-sm text-foreground">
                    <input
                      type="checkbox"
                      checked={prefs.showPrice}
                      onChange={(e) => updatePrefs({ showPrice: e.target.checked })}
                      className="h-4 w-4 accent-[hsl(var(--primary))]"
                    />
                    {t.printShowPrice}
                  </label>
                </>
              )}
            </div>

            {/* Preview: the exact HTML that is printed */}
            <div className="min-w-0 space-y-2">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{t.printPreview}</p>
              <div className="flex min-h-[14rem] items-center justify-center overflow-auto rounded-xl border border-border bg-muted/40 p-4">
                {missingMedicineCode ? (
                  <p className="max-w-xs text-center text-sm text-muted-foreground">{t.printNoMedicineBarcode}</p>
                ) : (
                  <iframe
                    title={t.printPreview}
                    sandbox=""
                    srcDoc={`<!doctype html><html><head><meta charset="utf-8"><style>html,body{background:#e9e9e9;margin:0}.pv{zoom:${previewZoom};padding:10px;display:flex;flex-wrap:wrap;gap:8px;justify-content:${kind === "stock-card" || prefs.size === "a4-64x34" ? "flex-start" : "center"}}.label{box-shadow:0 1px 4px rgba(0,0,0,.25)}.sheet,.card{background:#fff;padding:6mm 7mm;box-shadow:0 1px 4px rgba(0,0,0,.25)}</style></head><body><div class="pv">${preview ?? ""}</div></body></html>`}
                    className={cn(
                      "w-full rounded-lg bg-white",
                      kind === "stock-card" ? "h-[26rem]" : prefs.size === "a4-64x34" ? "h-[22rem]" : "h-[9rem]"
                    )}
                  />
                )}
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end gap-2">
          <Button variant="outline" className="rounded-xl" onClick={onClose}>
            {t.cancel}
          </Button>
          <Button className="gap-2 rounded-xl" disabled={!card || !!missingMedicineCode} onClick={handlePrint}>
            <Printer className="h-4 w-4" />
            {t.printButton}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
