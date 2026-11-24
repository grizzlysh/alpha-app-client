import type { JSX } from "react";
import { useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { AlertTriangle, CheckCircle2, FileSpreadsheet, Loader2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useLanguage } from "@/hooks/useLanguage";
import { getApiErrorMessage } from "@/utils/apiError";
import { cn } from "@/utils/cn";
import { importCatalog } from "@/service/catalogService";
import type { CatalogImportPayload, CatalogImportResult, CatalogInvalidReason } from "@/types/catalog";
import type { Translations } from "@/configs/i18n";
import { CatalogFileError, parseCatalogFile } from "./catalogFile";

const reasonLabel = (r: CatalogInvalidReason, t: Translations): string =>
  ({
    NAME_REQUIRED: t.catalogReasonName,
    UNIT_REQUIRED: t.catalogReasonUnit,
    SHAPE_REQUIRED: t.catalogReasonShape,
    TYPE_REQUIRED: t.catalogReasonType,
    CLASS_REQUIRED: t.catalogReasonClass,
    DUPLICATE_IN_FILE: t.catalogReasonDuplicate,
  })[r];

/**
 * Import a medicine list exported from another branch (or a hand-made sheet):
 * pick the file → see what would be added → confirm. Only missing medicines and
 * classifications are added; nothing existing is changed.
 */
export function CatalogImportModal({ onClose }: { onClose: () => void }): JSX.Element {
  const { t, language } = useLanguage();
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [payload, setPayload] = useState<CatalogImportPayload | null>(null);
  const [preview, setPreview] = useState<CatalogImportResult | null>(null);
  const [done, setDone] = useState<CatalogImportResult | null>(null);
  const [parsing, setParsing] = useState(false);

  const previewMutation = useMutation({
    mutationFn: (p: CatalogImportPayload) => importCatalog({ ...p, dryRun: true }),
    onSuccess: (res) => setPreview(res.data ?? null),
    onError: (err) => toast.error(getApiErrorMessage(err, language, t.unexpectedError)),
  });
  const importMutation = useMutation({
    mutationFn: (p: CatalogImportPayload) => importCatalog({ ...p, dryRun: false }),
    onSuccess: (res) => {
      setDone(res.data ?? null);
      toast.success(t.catalogImported);
    },
    onError: (err) => toast.error(getApiErrorMessage(err, language, t.unexpectedError)),
  });

  async function pick(file: File | undefined): Promise<void> {
    if (!file) return;
    setFileName(file.name);
    setPreview(null);
    setPayload(null);
    setParsing(true);
    try {
      const parsed = await parseCatalogFile(file);
      setPayload(parsed);
      previewMutation.mutate(parsed);
    } catch (e) {
      toast.error(e instanceof CatalogFileError ? t.catalogFileEmpty : t.catalogFileUnreadable);
    } finally {
      setParsing(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  const busy = parsing || previewMutation.isPending || importMutation.isPending;
  const result = done ?? preview;
  const newClassifications = result ? result.shapes.created + result.types.created + result.classes.created : 0;

  return (
    <Dialog open onOpenChange={(open) => { if (!open && !importMutation.isPending) onClose(); }}>
      <DialogContent className="max-w-lg p-0" onInteractOutside={(e) => { if (busy) e.preventDefault(); }}>
        <DialogHeader className="flex flex-row items-center gap-3 space-y-0 border-b border-border px-6 py-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
            <FileSpreadsheet className="h-4 w-4 text-primary" />
          </div>
          <div>
            <DialogTitle className="text-base">{t.catalogImportTitle}</DialogTitle>
            <p className="text-xs text-muted-foreground">{t.catalogImportDesc}</p>
          </div>
        </DialogHeader>

        <div className="max-h-[60vh] space-y-4 overflow-y-auto px-6 py-5">
          {!done && (
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
              <span className="text-xs text-muted-foreground">{t.catalogPickFileHint}</span>
            </button>
          )}
          <input
            ref={inputRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            className="hidden"
            onChange={(e) => void pick(e.target.files?.[0])}
          />

          {result && (
            <section className="space-y-3">
              <div className={cn("flex items-start gap-2.5 rounded-xl px-3 py-2.5", done ? "bg-success/10" : "bg-muted/40")}>
                {done ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" /> : <FileSpreadsheet className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />}
                <div className="text-sm">
                  <p className="font-medium text-foreground">
                    {(done ? t.catalogDoneMedicines : t.catalogWillAddMedicines).replace("{n}", String(result.medicines.created))}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {(done ? t.catalogDoneClassifications : t.catalogWillAddClassifications).replace("{n}", String(newClassifications))}
                    {result.medicines.existing > 0 && <> · {t.catalogSkippedExisting.replace("{n}", String(result.medicines.existing))}</>}
                  </p>
                </div>
              </div>

              {result.medicines.invalid.length > 0 && (
                <div className="space-y-1.5">
                  <p className="flex items-center gap-1.5 text-xs font-medium text-amber-700 dark:text-amber-400">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    {t.catalogInvalidRows.replace("{n}", String(result.medicines.invalid.length))}
                  </p>
                  <ul className="max-h-32 space-y-0.5 overflow-y-auto rounded-xl border border-border px-3 py-2 text-xs">
                    {result.medicines.invalid.slice(0, 50).map((r) => (
                      <li key={r.row} className="flex gap-2">
                        <span className="w-14 shrink-0 tabular-nums text-muted-foreground">{t.catalogRow.replace("{n}", String(r.row + 1))}</span>
                        <span className="min-w-0 truncate name-case text-foreground">{r.name || "—"}</span>
                        <span className="ml-auto shrink-0 text-muted-foreground">{reasonLabel(r.reason, t)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {!done && <p className="text-xs text-muted-foreground">{t.catalogNoStockNote}</p>}
            </section>
          )}
        </div>

        <div className="flex justify-end gap-2 border-t border-border px-6 py-4">
          {done ? (
            <Button onClick={onClose} className="min-w-[6rem] rounded-xl">{t.done}</Button>
          ) : (
            <>
              <Button variant="outline" onClick={onClose} disabled={importMutation.isPending} className="rounded-xl">
                {t.cancel}
              </Button>
              <Button
                onClick={() => payload && importMutation.mutate(payload)}
                disabled={!preview || busy || (preview.medicines.created === 0 && newClassifications === 0)}
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
