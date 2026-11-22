import type { JSX } from "react";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Boxes, Loader2, Printer, ScanBarcode, Tag } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/hooks/useLanguage";
import { useNameFormat } from "@/hooks/useNameFormat";
import { getBatchLabel } from "@/service/stockService";
import { cn } from "@/utils/cn";
import { type LabelKind, boxCount, labelsDocument, printDocument } from "./barcodeLabels";
import { LabelSettings } from "./LabelSettings";
import { PrintPreview } from "./PrintPreview";
import { type PrintPrefs, labelText, loadPrefs, previewZoom, savePrefs } from "./printPrefs";

export interface BarcodePrintModalProps {
  stockDetailUuid: string;
  /** Which label is selected first. */
  initialKind?: LabelKind;
  onClose: () => void;
}

/** Print a batch label, item labels or the medicine's shelf label for one batch. */
export function BarcodePrintModal({ stockDetailUuid, initialKind = "batch-label", onClose }: BarcodePrintModalProps): JSX.Element {
  const { t, language } = useLanguage();
  const fmt = useNameFormat();
  const locale = language === "id" ? "id-ID" : "en-GB";
  const [kind, setKind] = useState<LabelKind>(initialKind);
  const [prefs, setPrefs] = useState<PrintPrefs>(loadPrefs);
  const [copies, setCopies] = useState("");
  const [startNumber, setStartNumber] = useState("1");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["batch-label", stockDetailUuid],
    queryFn: () => getBatchLabel(stockDetailUuid),
  });
  const label = data?.data;

  // Item labels default to one per box in stock; the others to a single label.
  const defaultCopies = kind === "item-label" && label ? boxCount(label.batch.quantityPieces, label.batch.quantityPerBox) : 1;
  const copiesValue = copies === "" ? defaultCopies : Math.max(1, Math.min(500, Number(copies) || 1));
  const missingMedicineCode = kind === "medicine-label" && label && !label.medicine.barcode;
  const text = useMemo(() => labelText(t), [t]);

  function documentHtml(forPreview: boolean): string | null {
    if (!label || missingMedicineCode) return null;
    const perPage = prefs.size === "a4-64x34" ? 24 : kind === "item-label" ? 3 : 1;
    return labelsDocument(
      [{ kind, data: label, copies: copiesValue, startNumber: Math.max(1, Number(startNumber) || 1), fields: prefs.fields[kind] }],
      text,
      { size: prefs.size, locale, formatName: fmt },
      forPreview ? perPage : undefined
    );
  }

  function updatePrefs(next: PrintPrefs): void {
    setPrefs(next);
    savePrefs(next);
  }

  function handlePrint(): void {
    const html = documentHtml(false);
    if (!html || !label) return;
    if (!printDocument(`${t.printTitle} · ${label.medicine.name} · ${label.batch.batchNumber}`, html)) toast.error(t.printPopupBlocked);
  }

  const preview = documentHtml(true);
  const kinds: { value: LabelKind; label: string; hint: string; icon: JSX.Element }[] = [
    { value: "batch-label", label: t.printBatchLabel, hint: t.printBatchLabelHint, icon: <ScanBarcode className="h-4 w-4" /> },
    { value: "item-label", label: t.printItemLabel, hint: t.printItemLabelHint, icon: <Boxes className="h-4 w-4" /> },
    { value: "medicine-label", label: t.printMedicineLabel, hint: t.printMedicineLabelHint, icon: <Tag className="h-4 w-4" /> },
  ];

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
        ) : isError || !label ? (
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
                      "flex w-full items-start gap-3 rounded-xl border px-3 py-2 text-left transition-colors",
                      kind === k.value ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50"
                    )}
                  >
                    <span className={cn("mt-0.5", kind === k.value ? "text-primary" : "text-muted-foreground")}>{k.icon}</span>
                    <span className="min-w-0">
                      <span className="block text-sm font-medium text-foreground">{k.label}</span>
                      {kind === k.value && <span className="block text-xs text-muted-foreground">{k.hint}</span>}
                    </span>
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap gap-3">
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
                    className="w-24 rounded-xl"
                  />
                </div>
                {kind === "item-label" && (
                  <div className="space-y-1.5">
                    <Label htmlFor="print-start">{t.printStartNumber}</Label>
                    <Input
                      id="print-start"
                      type="number"
                      inputMode="numeric"
                      min={1}
                      value={startNumber}
                      onChange={(e) => setStartNumber(e.target.value)}
                      className="w-24 rounded-xl"
                    />
                  </div>
                )}
              </div>

              <LabelSettings prefs={prefs} onChange={updatePrefs} kinds={[kind]} />
            </div>

            {/* Preview: the exact HTML that is printed */}
            <div className="min-w-0 space-y-2">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{t.printPreview}</p>
              <div className="flex min-h-[14rem] items-center justify-center overflow-auto rounded-xl border border-border bg-muted/40 p-4">
                {missingMedicineCode ? (
                  <p className="max-w-xs text-center text-sm text-muted-foreground">{t.printNoMedicineBarcode}</p>
                ) : (
                  <PrintPreview
                    html={preview ?? ""}
                    title={t.printPreview}
                    zoom={previewZoom(prefs.size)}
                    alignStart={prefs.size === "a4-64x34"}
                    className={prefs.size === "a4-64x34" ? "h-[22rem]" : kind === "item-label" ? "h-[20rem]" : "h-[12rem]"}
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
          <Button className="gap-2 rounded-xl" disabled={!label || !!missingMedicineCode} onClick={handlePrint}>
            <Printer className="h-4 w-4" />
            {t.printButton}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
