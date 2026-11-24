import type { JSX } from "react";
import { useState } from "react";
import { toast } from "sonner";
import { Download, Loader2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";
import { getApiErrorMessage } from "@/utils/apiError";

/** Toolbar pair: download the list as Excel, and open the import dialog. */
export function DataTransferButtons({
  onExport,
  onImport,
  importLabel,
  exportHint,
  importHint,
}: {
  onExport?: () => Promise<void>;
  onImport?: () => void;
  importLabel?: string;
  exportHint?: string;
  importHint?: string;
}): JSX.Element {
  const { t, language } = useLanguage();
  const [exporting, setExporting] = useState(false);

  async function run(): Promise<void> {
    if (!onExport) return;
    setExporting(true);
    try {
      await onExport();
    } catch (err) {
      toast.error(getApiErrorMessage(err, language, t.unexpectedError));
    } finally {
      setExporting(false);
    }
  }

  return (
    <>
      {onExport && (
        <Button variant="outline" onClick={run} disabled={exporting} className="shrink-0 gap-2 rounded-xl" title={exportHint}>
          {exporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
          <span className="hidden md:inline">{t.catalogExport}</span>
        </Button>
      )}
      {onImport && (
        <Button variant="outline" onClick={onImport} className="shrink-0 gap-2 rounded-xl" title={importHint}>
          <Upload className="h-4 w-4" />
          <span className="hidden md:inline">{importLabel ?? t.catalogImport}</span>
        </Button>
      )}
    </>
  );
}
