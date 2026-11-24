import type { JSX, ReactNode } from "react";

/**
 * A plain section heading inside a form: label + hairline. Used instead of a
 * nested bordered box so section fields stay on the same grid as the rest.
 */
export function FormSectionLabel({ children }: { children: ReactNode }): JSX.Element {
  return (
    <div className="flex items-center gap-3">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{children}</p>
      <span className="h-px flex-1 bg-border" aria-hidden />
    </div>
  );
}
