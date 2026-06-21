import type { JSX } from "react";
import { cn } from "@/utils/cn";
import { DateInput } from "@/components/ui/date-input";
import type { Translations } from "@/configs/i18n";
import type { ReportFilterMode } from "@/types/report";

interface ReportDateRangeFilterProps {
  mode: ReportFilterMode;
  dateFrom: string;
  dateTo: string;
  t: Translations;
  onModeChange: (mode: ReportFilterMode) => void;
  onDateFromChange: (date: string) => void;
  onDateToChange: (date: string) => void;
}

type ModeOption = { value: ReportFilterMode; label: (t: Translations) => string };

const MODE_OPTIONS: ModeOption[] = [
  { value: "all", label: (t) => t.reportPeriodAll },
  { value: "monthly", label: (t) => t.reportPeriodMonthly },
  { value: "custom", label: (t) => t.reportPeriodCustom },
];

export function ReportDateRangeFilter({
  mode,
  dateFrom,
  dateTo,
  t,
  onModeChange,
  onDateFromChange,
  onDateToChange,
}: ReportDateRangeFilterProps): JSX.Element {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex overflow-hidden rounded-lg border border-border">
        {MODE_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onModeChange(opt.value)}
            className={cn(
              "px-3 py-1.5 text-sm transition-colors",
              "not-last:border-r not-last:border-border",
              mode === opt.value
                ? "bg-primary text-primary-foreground"
                : "bg-card text-muted-foreground hover:bg-muted"
            )}
          >
            {opt.label(t)}
          </button>
        ))}
      </div>

      {mode === "custom" && (
        <>
          <DateInput
            value={dateFrom}
            onChange={onDateFromChange}
            placeholder={t.reportDateFrom}
            className="h-9 w-[10rem]"
          />
          <span className="text-sm text-muted-foreground">—</span>
          <DateInput
            value={dateTo}
            onChange={onDateToChange}
            placeholder={t.reportDateTo}
            className="h-9 w-[10rem]"
          />
        </>
      )}
    </div>
  );
}
