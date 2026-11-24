import type { JSX } from "react";

import { cn } from "@/utils/cn";

interface AmountInputProps {
  id: string;
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  invalid?: boolean;
  autoFocus?: boolean;
  ariaLabel?: string;
}

/** A rupiah amount: digits only, shown with thousand separators. */
export function AmountInput({ id, value, onChange, disabled = false, invalid = false, autoFocus = false, ariaLabel }: AmountInputProps): JSX.Element {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">Rp</span>
      <input
        id={id}
        type="text"
        inputMode="numeric"
        autoComplete="off"
        value={value ? new Intl.NumberFormat("id-ID").format(value) : ""}
        placeholder="0"
        onChange={(e) => onChange(Number(e.target.value.replace(/[^0-9]/g, "") || 0))}
        disabled={disabled}
        autoFocus={autoFocus}
        aria-label={ariaLabel}
        aria-invalid={invalid}
        className={cn(
          "w-full rounded-xl border bg-background py-2.5 pl-11 pr-4 text-base font-medium tabular-nums text-foreground outline-none focus:border-primary disabled:opacity-60",
          invalid ? "border-destructive" : "border-border"
        )}
      />
    </div>
  );
}
