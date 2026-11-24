import type { JSX } from "react";
import { useMemo } from "react";
import { useQueries } from "@tanstack/react-query";
import { toast } from "sonner";
import { Boxes, Loader2, Printer, ScanBarcode, Tag, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { LabelSettings } from "@/components/stock/LabelSettings";
import { PrintPreview } from "@/components/stock/PrintPreview";
import { type LabelJob, type LabelKind, countLabels, labelsDocument, printDocument } from "@/components/stock/barcodeLabels";
import { type PrintPrefs, labelText, previewZoom } from "@/components/stock/printPrefs";
import { useLanguage } from "@/hooks/useLanguage";
import { useNameFormat } from "@/hooks/useNameFormat";
import { getBatchLabel } from "@/service/stockService";
import type { BatchLabel } from "@/types/stock";
import type { QueueItem } from "./labelQueue";

const KIND_ORDER: LabelKind[] = ["batch-label", "item-label", "medicine-label"];
const KIND_ICON: Record<LabelKind, JSX.Element> = {
  "batch-label": <ScanBarcode className="h-4 w-4" />,
  "item-label": <Boxes className="h-4 w-4" />,
  "medicine-label": <Tag className="h-4 w-4" />,
};

export interface LabelQueuePanelProps {
  queue: QueueItem[];
  onChange: (queue: QueueItem[]) => void;
  prefs: PrintPrefs;
  onPrefsChange: (prefs: PrintPrefs) => void;
}

/** The labels waiting to be printed, their settings, a preview, and one Print for all. */
export function LabelQueuePanel({ queue, onChange, prefs, onPrefsChange }: LabelQueuePanelProps): JSX.Element {
  const { t, language } = useLanguage();
  const fmt = useNameFormat();
  const locale = language === "id" ? "id-ID" : "en-GB";
  const text = useMemo(() => labelText(t), [t]);

  const uuids = [...new Set(queue.map((q) => q.stockDetailUuid))];
  const labelQueries = useQueries({
    queries: uuids.map((uuid) => ({
      queryKey: ["batch-label", uuid],
      queryFn: () => getBatchLabel(uuid),
    })),
  });
  const labels = new Map<string, BatchLabel>();
  labelQueries.forEach((q, i) => {
    if (q.data?.data) labels.set(uuids[i], q.data.data);
  });
  const isLoading = labelQueries.some((q) => q.isLoading);

  // Medicine labels need the medicine's own barcode; those without are left out.
  let skipped = 0;
  const jobs: LabelJob[] = [];
  for (const q of queue) {
    const data = labels.get(q.stockDetailUuid);
    if (!data) continue;
    if (q.kind === "medicine-label" && !data.medicine.barcode) {
      skipped += 1;
      continue;
    }
    jobs.push({ kind: q.kind, data, copies: q.copies, startNumber: q.startNumber, fields: prefs.fields[q.kind] });
  }
  const total = countLabels(jobs);
  const sheet = { size: prefs.size, locale, formatName: fmt };
  const preview = jobs.length ? labelsDocument(jobs, text, sheet, prefs.size === "a4-64x34" ? 24 : 6) : "";
  const kindsInQueue = KIND_ORDER.filter((k) => queue.some((q) => q.kind === k));
  const kindLabel: Record<LabelKind, string> = {
    "batch-label": t.printBatchLabel,
    "item-label": t.printItemLabel,
    "medicine-label": t.printMedicineLabel,
  };

  function update(id: string, patch: Partial<QueueItem>): void {
    onChange(queue.map((q) => (q.id === id ? { ...q, ...patch } : q)));
  }

  function handlePrint(): void {
    if (!jobs.length) return;
    if (!printDocument(`${t.printTitle} · ${total}`, labelsDocument(jobs, text, sheet))) toast.error(t.printPopupBlocked);
  }

  return (
    <Card className="flex min-w-0 flex-col gap-4 p-4">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-foreground">
          {t.stockLabelsQueue}
          {queue.length > 0 && <span className="ml-2 font-normal text-muted-foreground">{t.stockLabelsTotal.replace("{n}", String(total))}</span>}
        </h3>
        {queue.length > 0 && (
          <Button size="sm" variant="ghost" onClick={() => onChange([])}>
            {t.stockLabelsClear}
          </Button>
        )}
      </div>

      {queue.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
          {t.stockLabelsQueueEmpty}
        </p>
      ) : (
        <ul className="divide-y divide-border rounded-xl border border-border">
          {queue.map((q) => (
            <li key={q.id} className="flex flex-wrap items-center gap-2 px-3 py-2">
              <span className="text-primary" title={kindLabel[q.kind]}>{KIND_ICON[q.kind]}</span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium name-case text-foreground">{q.medicineName}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {kindLabel[q.kind]}
                  {q.batchNumber && <span className="font-mono"> · {q.batchNumber.toUpperCase()}</span>}
                </p>
              </div>
              <label className="flex items-center gap-1 text-xs text-muted-foreground">
                ×
                <Input
                  type="number"
                  inputMode="numeric"
                  min={1}
                  max={500}
                  aria-label={t.printCopies}
                  value={q.copies}
                  onChange={(e) => update(q.id, { copies: Math.max(1, Math.min(500, Number(e.target.value) || 1)) })}
                  className="h-8 w-16 rounded-lg px-2"
                />
              </label>
              {q.kind === "item-label" && (
                <label className="flex items-center gap-1 text-xs text-muted-foreground">
                  #
                  <Input
                    type="number"
                    inputMode="numeric"
                    min={1}
                    aria-label={t.printStartNumber}
                    title={t.printStartNumber}
                    value={q.startNumber}
                    onChange={(e) => update(q.id, { startNumber: Math.max(1, Number(e.target.value) || 1) })}
                    className="h-8 w-16 rounded-lg px-2"
                  />
                </label>
              )}
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8"
                aria-label={t.stockLabelsRemove}
                onClick={() => onChange(queue.filter((x) => x.id !== q.id))}
              >
                <X className="h-4 w-4" />
              </Button>
            </li>
          ))}
        </ul>
      )}

      {skipped > 0 && <p className="text-xs text-destructive">{t.stockLabelsSkippedNoBarcode.replace("{n}", String(skipped))}</p>}

      <div className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{t.stockLabelsSettings}</p>
        <LabelSettings prefs={prefs} onChange={onPrefsChange} kinds={kindsInQueue.length ? kindsInQueue : KIND_ORDER} />
      </div>

      {queue.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{t.printPreview}</p>
          <div className="flex min-h-[10rem] items-center justify-center overflow-auto rounded-xl border border-border bg-muted/40 p-2">
            {isLoading ? (
              <span className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                {t.stockLabelsLoading}
              </span>
            ) : (
              <PrintPreview
                html={preview}
                title={t.printPreview}
                zoom={previewZoom(prefs.size)}
                alignStart={prefs.size === "a4-64x34"}
                className={prefs.size === "a4-64x34" ? "h-[22rem]" : "h-[20rem]"}
              />
            )}
          </div>
        </div>
      )}

      <Button className="gap-2 rounded-xl" disabled={total === 0 || isLoading} onClick={handlePrint}>
        <Printer className="h-4 w-4" />
        {t.stockLabelsPrintAll}
        {total > 0 && ` (${total})`}
      </Button>
    </Card>
  );
}
