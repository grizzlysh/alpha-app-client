import * as React from "react";
import { DayPicker, type DayPickerProps } from "react-day-picker";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  addMonths,
  subMonths,
  addYears,
  subYears,
  setMonth as fnSetMonth,
  setYear as fnSetYear,
  getYear,
  getMonth,
  format,
} from "date-fns";

import { cn } from "@/utils/cn";
import { buttonVariants } from "./button";

type CalendarView = "days" | "months" | "years";

const MONTH_LABELS = [
  "Jan", "Feb", "Mar", "Apr",
  "May", "Jun", "Jul", "Aug",
  "Sep", "Oct", "Nov", "Dec",
];

export type CalendarProps = DayPickerProps;

function resolveInitialMonth(props: DayPickerProps): Date {
  const defaultMonth = (props as Record<string, unknown>).defaultMonth;
  if (defaultMonth instanceof Date && !isNaN(defaultMonth.getTime())) return defaultMonth;
  const selected = (props as Record<string, unknown>).selected;
  if (selected instanceof Date && !isNaN(selected.getTime())) return selected;
  return new Date();
}

export function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps): React.JSX.Element {
  const [view, setView] = React.useState<CalendarView>("days");
  const [displayMonth, setDisplayMonth] = React.useState<Date>(() =>
    resolveInitialMonth(props)
  );

  // Re-sync when the selected date changes (e.g. reopening the popover)
  const selectedDate = (props as Record<string, unknown>).selected;
  React.useEffect(() => {
    if (selectedDate instanceof Date && !isNaN(selectedDate.getTime())) {
      setDisplayMonth(selectedDate);
    }
  }, [selectedDate]);

  const displayYear = getYear(displayMonth);
  const displayMonthIndex = getMonth(displayMonth);

  // 12-year block anchored to the current decade
  const blockBase = Math.floor(displayYear / 12) * 12;
  const years = Array.from({ length: 12 }, (_, i) => blockBase + i);

  function handlePrev(): void {
    if (view === "days") setDisplayMonth((m) => subMonths(m, 1));
    else if (view === "months") setDisplayMonth((m) => subYears(m, 1));
    else setDisplayMonth((m) => subYears(m, 12));
  }

  function handleNext(): void {
    if (view === "days") setDisplayMonth((m) => addMonths(m, 1));
    else if (view === "months") setDisplayMonth((m) => addYears(m, 1));
    else setDisplayMonth((m) => addYears(m, 12));
  }

  function handleHeaderClick(): void {
    setView((v) => (v === "days" ? "months" : v === "months" ? "years" : "days"));
  }

  function handleMonthSelect(monthIndex: number): void {
    setDisplayMonth((m) => fnSetMonth(m, monthIndex));
    setView("days");
  }

  function handleYearSelect(year: number): void {
    setDisplayMonth((m) => fnSetYear(m, year));
    setView("months");
  }

  const headerLabel =
    view === "days"
      ? format(displayMonth, "MMMM yyyy")
      : view === "months"
      ? format(displayMonth, "yyyy")
      : `${years[0]} – ${years[years.length - 1]}`;

  const navBtnClass = cn(
    buttonVariants({ variant: "ghost" }),
    "h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
  );

  // Strip defaultMonth so it doesn't conflict with the controlled `month` prop
  const { defaultMonth: _defaultMonth, ...dayPickerProps } = props as Record<
    string,
    unknown
  > & DayPickerProps;

  return (
    <div className={cn("w-[252px] p-3 select-none", className)}>
      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-2">
        <button type="button" onClick={handlePrev} className={navBtnClass}>
          <ChevronLeft className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={handleHeaderClick}
          className="rounded-md px-2 py-1 text-sm font-semibold transition-colors hover:bg-muted hover:text-primary"
        >
          {headerLabel}
        </button>

        <button type="button" onClick={handleNext} className={navBtnClass}>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* ── Month picker ── */}
      {view === "months" && (
        <div className="grid grid-cols-3 gap-1">
          {MONTH_LABELS.map((label, i) => (
            <button
              key={label}
              type="button"
              onClick={() => handleMonthSelect(i)}
              className={cn(
                "rounded-md py-2 text-sm font-normal transition-colors",
                displayMonthIndex === i
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted text-foreground"
              )}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      {/* ── Year picker ── */}
      {view === "years" && (
        <div className="grid grid-cols-3 gap-1">
          {years.map((year) => (
            <button
              key={year}
              type="button"
              onClick={() => handleYearSelect(year)}
              className={cn(
                "rounded-md py-2 text-sm font-normal transition-colors",
                displayYear === year
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted text-foreground"
              )}
            >
              {year}
            </button>
          ))}
        </div>
      )}

      {/* ── Day picker ── */}
      {view === "days" && (
        <DayPicker
          showOutsideDays={showOutsideDays}
          month={displayMonth}
          onMonthChange={setDisplayMonth}
          classNames={{
            months: "flex flex-col gap-2",
            month: "flex flex-col gap-3",
            month_caption: "hidden",
            caption_label: "hidden",
            nav: "hidden",
            month_grid: "w-full border-collapse",
            weekdays: "flex",
            weekday:
              "text-muted-foreground w-8 font-normal text-[0.8rem] text-center",
            week: "flex w-full mt-1",
            day: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20",
            day_button: cn(
              buttonVariants({ variant: "ghost" }),
              "h-8 w-8 p-0 font-normal aria-selected:opacity-100 rounded-md"
            ),
            selected:
              "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground rounded-md",
            today: "bg-accent text-accent-foreground rounded-md",
            outside: "text-muted-foreground opacity-50",
            disabled: "text-muted-foreground opacity-50",
            range_middle:
              "aria-selected:bg-accent aria-selected:text-accent-foreground",
            hidden: "invisible",
            ...classNames,
          }}
          {...(dayPickerProps as DayPickerProps)}
        />
      )}
    </div>
  );
}
