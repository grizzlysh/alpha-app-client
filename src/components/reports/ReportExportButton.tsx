import type { JSX } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Translations } from "@/configs/i18n";

interface ReportExportButtonProps {
  t: Translations;
  onCsv: () => void;
  onExcel: () => void;
  disabled?: boolean;
}

export function ReportExportButton({
  t,
  onCsv,
  onExcel,
  disabled,
}: ReportExportButtonProps): JSX.Element {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" disabled={disabled} className="h-9 gap-1.5">
          <Download className="h-4 w-4" />
          {t.reportExport}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={onCsv}>{t.reportExportCsv}</DropdownMenuItem>
        <DropdownMenuItem onClick={onExcel}>{t.reportExportExcel}</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
