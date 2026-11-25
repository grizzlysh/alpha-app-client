import type { JSX } from "react";
import { useMemo, useState } from "react";
import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Layers, Loader2, Package, Printer, ScanBarcode, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useBarcodeScanner } from "@/hooks/useBarcodeScanner";
import { useLanguage } from "@/hooks/useLanguage";
import { useNameFormat } from "@/hooks/useNameFormat";
import { getBatchLabels, getStockDetails } from "@/service/stockService";
import type { BatchLabel } from "@/types/stock";
import { getApiErrorMessage } from "@/utils/apiError";
import { cn } from "@/utils/cn";
import { type PrintMode, MAX_LABELS, boxCount, clampCopies, labelsDocument, printDocument } from "./barcodeLabels";
import { LabelSettings } from "./LabelSettings";
import { PrintPreview } from "./PrintPreview";
import { type PrintPrefs, labelText, loadPrefs, previewZoom, savePrefs } from "./printPrefs";

export interface LabelPrintModalProps {
  /** Batches to start with. */
  stockDetailUuids?: string[];
  /** Medicines whose in-stock batches are added. */
  medicineUuids?: string[];
  onClose: () => void;
}

interface Request {
  stockDetailUuids: string[];
  medicineUuids: string[];
}

const addUnique = (list: string[], value: string): string[] => (list.includes(value) ? list : [...list, value]);

/**
 * Batch labels for one or many batches: one per pack (to stick on each pack)
 * or one per batch (to keep where it is stored). The label is the same; only
 * how many are printed differs, and each batch's number can be changed.
 */
export function LabelPrintModal({ stockDetailUuids = [], medicineUuids = [], onClose }: LabelPrintModalProps): JSX.Element {
  const { t, language } = useLanguage();
  const fmt = useNameFormat();
  const locale = language === "id" ? "id-ID" : "en-GB";
  const [mode, setMode] = useState<PrintMode>("per-pack");
  const [prefs, setPrefs] = useState<PrintPrefs>(loadPrefs);
  const [request, setRequest] = useState<Request>({ stockDetailUuids, medicineUuids });
  const [copies, setCopies] = useState<Record<string, string>>({});
  const [removed, setRemoved] = useState<string[]>([]);
  const text = useMemo(() => labelText(t), [t]);
  const hasRequest = request.stockDetailUuids.length + request.medicineUuids.length > 0;

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["batch-labels", request],
    queryFn: () => getBatchLabels(request),
    enabled: hasRequest,
    placeholderData: keepPreviousData,
  });
  const labels = (data?.data ?? []).filter((l) => !removed.includes(l.batch.uuid));

  const defaultCopies = (l: BatchLabel): number =>
    mode === "per-pack" ? boxCount(l.batch.quantityPieces, l.batch.quantityPerBox) : 1;
  const copiesOf = (l: BatchLabel): number => {
    const typed = copies[l.batch.uuid];
    return typed === undefined || typed === "" ? defaultCopies(l) : clampCopies(Number(typed));
  };
  const total = labels.reduce((sum, l) => sum + copiesOf(l), 0);
  const tooMany = total > MAX_LABELS;

  // A scanned code adds its batch (a medicine code adds the medicine's batches).
  const scan = useMutation({
    mutationFn: async (code: string) => (await getStockDetails({ barcode: code })).data ?? [],
    onSuccess: (matches) => {
      const first = matches[0];
      if (!first) {
        toast.warning(t.printNotFound);
        return;
      }
      setRemoved((r) => r.filter((u) => u !== first.uuid));
      setRequest((r) =>
        first.scanMatch === "MEDICINE"
          ? { ...r, medicineUuids: addUnique(r.medicineUuids, first.medicine.uuid) }
          : { ...r, stockDetailUuids: addUnique(r.stockDetailUuids, first.uuid) }
      );
    },
    onError: (err) => toast.error(getApiErrorMessage(err, language, t.unexpectedError)),
  });
  useBarcodeScanner({ onScan: (code) => scan.mutate(code) });

  function switchMode(next: PrintMode): void {
    setMode(next);
    setCopies({});
  }

  function updatePrefs(next: PrintPrefs): void {
    setPrefs(next);
    savePrefs(next);
  }

  function documentHtml(limit?: number): string | null {
    if (labels.length === 0) return null;
    return labelsDocument(
      labels.map((l) => ({ data: l, copies: copiesOf(l) })),
      text,
      { mode, size: prefs.size, locale, formatName: fmt },
      limit
    );
  }

  function handlePrint(): void {
    const html = documentHtml();
    if (!html || tooMany) return;
    const title = labels.length === 1 ? `${t.printTitle} · ${labels[0].medicine.name} · ${labels[0].batch.batchNumber}` : t.printTitle;
    if (!printDocument(title, html)) toast.error(t.printPopupBlocked);
  }

  const preview = documentHtml(prefs.size === "a4-64x34" ? 24 : 3);
  const modes: { value: PrintMode; label: string; hint: string; contents: string; icon: JSX.Element }[] = [
    { value: "per-pack", label: t.printModePerPack, hint: t.printModePerPackHint, contents: t.printContentsPerPack, icon: <Package className="h-5 w-5" /> },
    { value: "per-batch", label: t.printModePerBatch, hint: t.printModePerBatchHint, contents: t.printContentsPerBatch, icon: <Layers className="h-5 w-5" /> },
  ];

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[92vh] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Printer className="h-5 w-5 text-primary" />
            {t.printLabels}
          </DialogTitle>
        </DialogHeader>

        {/* How many: one per pack or one per batch. The label is the same. */}
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2" role="radiogroup" aria-label={t.printLabels}>
          {modes.map((m) => {
            const active = mode === m.value;
            return (
              <button
                key={m.value}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => switchMode(m.value)}
                className={cn(
                  "flex items-start gap-3 rounded-2xl border px-4 py-3 text-left transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
                  active ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border hover:border-primary/40 hover:bg-muted/40"
                )}
              >
                <span
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
                    active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  )}
                >
                  {m.icon}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold text-foreground">{m.label}</span>
                  <span className="mt-0.5 block text-xs text-muted-foreground">{m.hint}</span>
                  <span className="mt-1.5 block text-[11px] text-muted-foreground">
                    <span className="font-medium text-foreground/80">{t.printContentsTitle}:</span> {m.contents}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-[minmax(0,1fr)_minmax(0,19rem)]">
          {/* Batches */}
          <section className="min-w-0 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {t.printBatches} {labels.length > 0 && `(${labels.length})`}
              </p>
              <p className="flex items-center gap-1 text-xs text-muted-foreground">
                {isFetching || scan.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ScanBarcode className="h-3.5 w-3.5" />}
                {t.printScanHint}
              </p>
            </div>
            {isLoading && hasRequest ? (
              <div className="flex h-24 items-center justify-center"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>
            ) : labels.length === 0 ? (
              <p className="rounded-xl border border-dashed border-border px-4 py-6 text-center text-sm text-muted-foreground">{t.printEmpty}</p>
            ) : (
              <ul className="max-h-80 divide-y divide-border overflow-y-auto rounded-xl border border-border">
                {labels.map((l) => (
                  <li key={l.batch.uuid} className="flex items-center gap-3 px-3 py-2">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground name-case">{fmt(l.medicine.name)}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        <span className="font-mono">{l.batch.batchNumber.toUpperCase()}</span>
                        {" · "}ED {new Date(l.batch.expiryDate).toLocaleDateString(locale, { month: "2-digit", year: "numeric" })}
                        {" · "}{t.printPacks.replace("{n}", String(boxCount(l.batch.quantityPieces, l.batch.quantityPerBox)))}
                      </p>
                    </div>
                    <input
                      type="number"
                      inputMode="numeric"
                      min={1}
                      max={500}
                      aria-label={`${t.printCopies} · ${l.batch.batchNumber}`}
                      title={t.printCopies}
                      value={copies[l.batch.uuid] ?? String(defaultCopies(l))}
                      onChange={(e) => setCopies((c) => ({ ...c, [l.batch.uuid]: e.target.value }))}
                      className="h-9 w-20 rounded-lg border border-input bg-card px-2 text-right text-sm tabular-nums text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                    />
                    <button
                      type="button"
                      onClick={() => setRemoved((r) => [...r, l.batch.uuid])}
                      aria-label={`${t.printRemoveBatch} ${l.batch.batchNumber}`}
                      className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Preview, with the paper it is printed on */}
          <section className="min-w-0 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{t.printPreview}</p>
              <LabelSettings prefs={prefs} onChange={updatePrefs} />
            </div>
            <div className="flex min-h-[12rem] items-center justify-center overflow-auto rounded-xl border border-border bg-muted/40 p-4">
              {preview ? (
                <PrintPreview
                  html={preview}
                  title={t.printPreview}
                  zoom={previewZoom(prefs.size)}
                  alignStart={prefs.size === "a4-64x34"}
                  className={prefs.size === "a4-64x34" ? "h-[20rem]" : "h-[14rem]"}
                />
              ) : (
                <p className="text-sm text-muted-foreground">—</p>
              )}
            </div>
          </section>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-3">
          {tooMany ? (
            <p className="mr-auto text-xs text-destructive">{t.printTooMany.replace("{n}", String(MAX_LABELS))}</p>
          ) : (
            labels.length > 0 && <p className="mr-auto text-sm text-muted-foreground">{t.printTotalLabels.replace("{n}", String(total))}</p>
          )}
          <Button variant="outline" className="rounded-xl" onClick={onClose}>
            {t.cancel}
          </Button>
          <Button className="gap-2 rounded-xl" disabled={labels.length === 0 || tooMany} onClick={handlePrint}>
            <Printer className="h-4 w-4" />
            {t.printButton}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
