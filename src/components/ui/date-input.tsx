import * as React from "react";
import { format, parse, isValid } from "date-fns";
import { CalendarDays } from "lucide-react";

import { cn } from "@/utils/cn";
import { Button } from "./button";
import { Calendar } from "./calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

export interface DateInputProps {
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  name?: string;
  id?: string;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
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
      placeholder = "Pick a date",
      className,
    },
    ref
  ) => {
    const parsed = value ? parse(value, "yyyy-MM-dd", new Date()) : undefined;
    const selected = parsed && isValid(parsed) ? parsed : undefined;

    function handleSelect(date: Date | undefined): void {
      onChange?.(date ? format(date, "yyyy-MM-dd") : "");
    }

    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button
            ref={ref}
            type="button"
            variant="outline"
            id={id}
            name={name}
            disabled={disabled}
            onBlur={onBlur}
            className={cn(
              "w-full justify-start bg-card font-normal",
              !selected && "text-muted-foreground",
              className
            )}
          >
            <CalendarDays className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
            {selected ? (
              format(selected, "MMM d, yyyy")
            ) : (
              <span>{placeholder}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={selected}
            onSelect={handleSelect}
            defaultMonth={selected}
            autoFocus
          />
        </PopoverContent>
      </Popover>
    );
  }
);
DateInput.displayName = "DateInput";

export { DateInput };
