import * as React from "react";
import { Check, Minus } from "lucide-react";

import { cn } from "@/utils/cn";

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
  /** Some, but not all, of a group is ticked (shows a dash). */
  indeterminate?: boolean;
  /** "sm" for dense lists, "md" (default) everywhere else. */
  size?: "sm" | "md";
}

/**
 * The app's checkbox: a native input (so labels, forms and keyboard work as
 * usual) drawn as a rounded box that fills with the primary colour.
 */
export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, indeterminate = false, size = "md", ...props }, ref) => {
    const inner = React.useRef<HTMLInputElement | null>(null);

    React.useEffect(() => {
      if (inner.current) inner.current.indeterminate = indeterminate;
    }, [indeterminate]);

    const setRef = (el: HTMLInputElement | null): void => {
      inner.current = el;
      if (typeof ref === "function") ref(el);
      else if (ref) ref.current = el;
    };

    const box = size === "sm" ? "h-4 w-4 rounded-[5px]" : "h-[18px] w-[18px] rounded-md";
    const icon = size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5";

    return (
      <span className={cn("relative inline-flex shrink-0", box, className)}>
        <input
          ref={setRef}
          type="checkbox"
          className={cn(
            "peer absolute inset-0 m-0 cursor-pointer appearance-none border-[1.5px] border-input bg-card shadow-sm",
            box,
            "transition-colors duration-150",
            "hover:border-primary/70",
            "checked:border-primary checked:bg-primary indeterminate:border-primary indeterminate:bg-primary",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            "disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-input"
          )}
          {...props}
        />
        <Check
          aria-hidden
          strokeWidth={3.5}
          className={cn(
            "pointer-events-none absolute inset-0 m-auto scale-50 text-primary-foreground opacity-0 transition-all duration-150",
            "peer-checked:scale-100 peer-checked:opacity-100 peer-indeterminate:opacity-0",
            icon
          )}
        />
        <Minus
          aria-hidden
          strokeWidth={3.5}
          className={cn(
            "pointer-events-none absolute inset-0 m-auto text-primary-foreground opacity-0 transition-opacity duration-150 peer-indeterminate:opacity-100",
            icon
          )}
        />
      </span>
    );
  }
);
Checkbox.displayName = "Checkbox";
