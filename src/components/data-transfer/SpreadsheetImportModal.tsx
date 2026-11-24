import type { JSX, ReactNode } from "react";
import { useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { AlertTriangle, CheckCircle2, Download, FileSpreadsheet, Loader2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useLanguage } from "@/hooks/useLanguage";
import { getApiErrorMessage } from "@/utils/apiError";
import { formatCurrency } from "@/components/sales/salesUtils";
import { cn } from "@/utils/cn";
import type { Translations } from "@/configs/i18n";
import type { ApiResponse } from "@/types/api";
import type { ImportInvalidReason, ImportResult, ImportRow } from "@/types/dataTransfer";
import { readSheet, SheetEmptyError, writeSheet, type SheetColumn } from "./spreadsheet";

const reasonLabel = (r: ImportInvalidReason, t: Translations): string =>
  ({
    NAME_REQUIRED: t.importReasonName,
    PHONE_REQUIRED: t.importReasonPhone,
    DUPLICATE_IN_FILE: t.catalogReasonDuplicate,
    INVALID_DATE: t.importReasonDate,
    MEDICINE_NOT_FOUND: t.importReasonMedicine,
    DISTRIBUTOR_NOT_FOUND: t.importReasonDistributor,
    BATCH_REQUIRED: t.importReasonBatch,
    EXPIRED: t.importReasonExpired,
    QUANTITY_INVALID: t.importReasonQuantity,
    PRICE_INVALID: t.importReasonPrice,
    BATCH_EXISTS: t.importReasonBatchExists,
  })[r];

export interface SpreadsheetImportModalProps {
  title: string;
  description: string;
  columns: SheetColumn[];
  /**
   * "Download template": file name and example rows, or a `download` that
   * builds a richer template itself (drop-downs from the pharmacy's data).
   */
  template:
    | { filename: string; sheet: string; rows: (string | number | null)[][] }
    | { download: () => Promise<void>; note?: string };
  run: (rows: ImportRow[], dryRun: boolean) => Promise<ApiResponse<ImportResult>>;
  /** Extra inputs shown above the file picker (e.g. signer for opening stock). */
  children?: ReactNode;
  /** False while those inputs are incomplete. */
  ready?: boolean;
  /** Wording for what gets created ("{n} distributor akan ditambahkan"). */
  willAdd: string;
  added: string;
  onClose: () => void;
}

/**
 * Pick a spreadsheet → see what would be added (dry run on the server) →
 * confirm. Existing records are skipped, never changed.
 */
export function SpreadsheetImportModal({
  title,
  description,
  columns,
  template,
  run,
  children,
  ready = true,
  willAdd,
  added,
  onClose,
}: SpreadsheetImportModalProps): JSX.Element {
  const { t, language } = useLanguage();
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [rows, setRows] = useState<ImportRow[] | null>(null);
  const [preview, setPreview] = useState<ImportResult | null>(null);
  const [done, setDone] = useState<ImportResult | null>(null);
  const [parsing, setParsing] = useState(false);
  const [templateBusy, setTemplateBusy] = useState(false);

  async function downloadTemplate(): Promise<void> {
    setTemplateBusy(true);
    try {
      if ("download" in template) await template.download();
      else await writeSheet(template.filename, template.sheet, columns, template.rows);
    } catch (err) {
      console.error(err);
      toast.error(t.importTemplateFailed);
    } finally {
      setTemplateBusy(false);
    }
  }

  const previewMutation = useMutation({
    mutationFn: (r: ImportRow[]) => run(r, true),
    onSuccess: (res) => setPreview(res.data ?? null),
    onError: (err) => toast.error(getApiErrorMessage(err, language, t.unexpectedError)),
  });
  const importMutation = useMutation({
    mutationFn: (r: ImportRow[]) => run(r, false),
    onSuccess: (res) => {
      setDone(res.data ?? null);
      toast.success(t.importDone);
    },
    onError: (err) => toast.error(getApiErrorMessage(err, language, t.unexpectedError)),
  });

  async function pick(file: File | undefined): Promise<void> {
    if (!file) return;
    setFileName(file.name);
    setPreview(null);
    setRows(null);
    setParsing(true);
    try {
      const parsed = await readSheet(file, columns);
      setRows(parsed);
      if (ready) previewMutation.mutate(parsed);
    } catch (e) {
      toast.error(e instanceof SheetEmptyError ? t.importFileEmpty : t.catalogFileUnreadable);
    } finally {
      setParsing(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  const busy = parsing || previewMutation.isPending || importMutation.isPending;
  const result = done ?? preview;

  return (
    <Dialog open onOpenChange={(open) => { if (!open && !importMutation.isPending) onClose(); }}>
      <DialogContent className="max-w-lg p-0" onInteractOutside={(e) => { if (busy) e.preventDefault(); }}>
        <DialogHeader className="flex flex-row items-center gap-3 space-y-0 border-b border-border px-6 py-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10">
            <FileSpreadsheet className="h-4 w-4 text-primary" />
          </div>
          <div className="min-w-0">
            <DialogTitle className="text-base">{title}</DialogTitle>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
        </DialogHeader>

        <div className="max-h-[62vh] space-y-4 overflow-y-auto px-6 py-5">
          {!done && children}

          {!done && (
            <>
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                disabled={busy}
                className="flex w-full flex-col items-center gap-2 rounded-2xl border border-dashed border-border px-6 py-6 text-center transition-colors hover:bg-muted/30 disabled:opacity-60"
              >
                {parsing || previewMutation.isPending ? (
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                ) : (
                  <Upload className="h-6 w-6 text-muted-foreground" />
                )}
                <span className="text-sm font-medium text-foreground">{fileName ?? t.catalogPickFile}</span>
                <span className="text-xs text-muted-foreground">{columns.map((c) => c.header).join(", ")}</span>
              </button>
              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => void downloadTemplate()}
                  disabled={templateBusy}
                  className="flex items-center gap-1.5 text-xs font-medium text-primary hover:underline disabled:opacity-60"
                >
                  {templateBusy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />}
                  {t.importDownloadTemplate}
                </button>
                {"note" in template && template.note && <p className="text-xs text-muted-foreground">{template.note}</p>}
              </div>
              {rows && !preview && !ready && <p className="text-xs text-amber-700 dark:text-amber-400">{t.importCompleteFields}</p>}
              {rows && !preview && ready && !previewMutation.isPending && (
                <Button variant="outline" size="sm" className="rounded-xl" onClick={() => previewMutation.mutate(rows)}>
                  {t.importCheck}
                </Button>
              )}
            </>
          )}
          <input ref={inputRef} type="file" accept=".xlsx,.xls,.csv" className="hidden" onChange={(e) => void pick(e.target.files?.[0])} />

          {result && (
            <section className="space-y-3">
              <div className={cn("flex items-start gap-2.5 rounded-xl px-3 py-2.5", done ? "bg-success/10" : "bg-muted/40")}>
                {done ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" /> : <FileSpreadsheet className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />}
                <div className="text-sm">
                  <p className="font-medium text-foreground">{(done ? added : willAdd).replace("{n}", String(result.created))}</p>
                  <p className="text-xs text-muted-foreground">
                    {t.catalogSkippedExisting.replace("{n}", String(result.existing))}
                    {result.totalValue !== undefined && result.created > 0 && <> · {t.importStockValue.replace("{amount}", formatCurrency(result.totalValue))}</>}
                    {result.invoices !== undefined && result.invoices > 0 && <> · {t.importStockInvoices.replace("{n}", String(result.invoices))}</>}
                  </p>
                </div>
              </div>

              {result.invalid.length > 0 && (
                <div className="space-y-1.5">
                  <p className="flex items-center gap-1.5 text-xs font-medium text-amber-700 dark:text-amber-400">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    {t.catalogInvalidRows.replace("{n}", String(result.invalid.length))}
                  </p>
                  <ul className="max-h-36 space-y-0.5 overflow-y-auto rounded-xl border border-border px-3 py-2 text-xs">
                    {result.invalid.slice(0, 100).map((r) => (
                      <li key={`${r.row}-${r.reason}`} className="flex gap-2">
                        <span className="w-14 shrink-0 tabular-nums text-muted-foreground">{t.catalogRow.replace("{n}", String(r.row + 1))}</span>
                        <span className="name-case min-w-0 truncate text-foreground">{r.name || "—"}</span>
                        <span className="ml-auto shrink-0 text-muted-foreground">{reasonLabel(r.reason, t)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </section>
          )}
        </div>

        <div className="flex justify-end gap-2 border-t border-border px-6 py-4">
          {done ? (
            <Button onClick={onClose} className="min-w-[6rem] rounded-xl">{t.done}</Button>
          ) : (
            <>
              <Button variant="outline" onClick={onClose} disabled={importMutation.isPending} className="rounded-xl">{t.cancel}</Button>
              <Button
                onClick={() => rows && importMutation.mutate(rows)}
                disabled={!preview || !ready || busy || preview.created === 0}
                className="min-w-[7rem] rounded-xl"
              >
                {importMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                {t.catalogImportBtn}
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
