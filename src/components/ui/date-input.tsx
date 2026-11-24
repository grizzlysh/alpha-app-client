import * as React from "react";
import { format, parse, isValid, startOfDay } from "date-fns";
import { id as idLocale, enUS } from "date-fns/locale";
import { CalendarDays } from "lucide-react";

import { cn } from "@/utils/cn";
import { useLanguage } from "@/hooks/useLanguage";
import { Button } from "./button";
import { Calendar } from "./calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

export interface DateInputProps {
  /** yyyy-MM-dd */
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  name?: string;
  id?: string;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  /** Latest selectable day (inclusive). */
  maxDate?: Date;
  /** Earliest selectable day (inclusive). */
  minDate?: Date;
  /** Show "Today" / "Clear" shortcuts under the calendar (default true). */
  showShortcuts?: boolean;
  "aria-invalid"?: boolean;
}

const DateInput = React.forwardRef<HTMLButtonElement, DateInputProps>(
  (
    {
      value,
      onChange,
      onBlur,
      id,
      name,
      disabled,
      placeholder,
      className,
      maxDate,
      minDate,
      showShortcuts = true,
      "aria-invalid": ariaInvalid,
    },
    ref
  ) => {
    const { language, t } = useLanguage();
    const locale = language === "id" ? idLocale : enUS;
    const [open, setOpen] = React.useState(false);

    const parsed = value ? parse(value, "yyyy-MM-dd", new Date()) : undefined;
    const selected = parsed && isValid(parsed) ? parsed : undefined;

    const disabledDays = [
      ...(maxDate ? [{ after: startOfDay(maxDate) }] : []),
      ...(minDate ? [{ before: startOfDay(minDate) }] : []),
    ];
    const todayAllowed =
      (!maxDate || startOfDay(new Date()) <= startOfDay(maxDate)) &&
      (!minDate || startOfDay(new Date()) >= startOfDay(minDate));

    function pick(date: Date | undefined): void {
      onChange?.(date ? format(date, "yyyy-MM-dd") : "");
      setOpen(false);
    }

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            ref={ref}
            type="button"
            variant="outline"
            id={id}
            name={name}
            disabled={disabled}
            onBlur={onBlur}
            aria-invalid={ariaInvalid}
            className={cn(
              "h-10 w-full justify-start rounded-xl bg-card px-3 font-normal",
              !selected && "text-muted-foreground",
              ariaInvalid && "border-destructive",
              className
            )}
          >
            <CalendarDays className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
            {selected ? (
              // e.g. "Senin, 9 Nov 2026" / "Mon, Nov 9, 2026"
              <span className="truncate">
                {format(selected, language === "id" ? "EEEE, d MMM yyyy" : "EEE, MMM d, yyyy", { locale })}
              </span>
            ) : (
              <span>{placeholder ?? t.datePickPlaceholder}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={selected}
            onSelect={pick}
            defaultMonth={selected ?? maxDate}
            locale={locale}
            disabled={disabledDays.length ? disabledDays : undefined}
            autoFocus
          />
          {showShortcuts && (
            <div className="flex items-center justify-between border-t border-border px-3 py-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-7 rounded-lg text-xs"
                onClick={() => pick(undefined)}
              >
                {t.dateClear}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-7 rounded-lg text-xs"
                disabled={!todayAllowed}
                onClick={() => pick(new Date())}
              >
                {t.dateToday}
              </Button>
            </div>
          )}
        </PopoverContent>
      </Popover>
    );
  }
);
DateInput.displayName = "DateInput";

export { DateInput };
