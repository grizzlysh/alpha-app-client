import type { JSX, ReactNode } from "react";

import { Button, type ButtonProps } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/utils/cn";

// ── InfoPair ──────────────────────────────────────────────────────────────────

export interface InfoPairProps {
  label: string;
  value?: string | null;
  valueClassName?: string;
  children?: ReactNode;
}

export function InfoPair({ label, value, valueClassName, children }: InfoPairProps): JSX.Element {
  return (
    <div className="flex items-center justify-between gap-4 py-2.5">
      <span className="flex-shrink-0 text-sm text-muted-foreground">{label}</span>
      <div className="text-right">
        {children ?? (
          value ? (
            <span className={cn("text-sm font-medium text-foreground", valueClassName)}>{value}</span>
          ) : (
            <span className="text-sm text-muted-foreground/40">—</span>
          )
        )}
      </div>
    </div>
  );
}

// ── DetailDatesCard ───────────────────────────────────────────────────────────

export interface DateEntry {
  label: string;
  value: string;
}

export function DetailDatesCard({ rows, className }: { rows: DateEntry[]; className?: string }): JSX.Element {
  return (
    <div className={cn("mx-5 mb-6 space-y-3 rounded-xl bg-muted/40 p-4", className)}>
      {rows.map((row) => (
        <div key={row.label} className="flex items-center justify-between gap-4">
          <span className="text-sm text-muted-foreground">{row.label}</span>
          <span className="text-right text-sm font-medium text-foreground">{row.value}</span>
        </div>
      ))}
    </div>
  );
}

// ── DetailModal ───────────────────────────────────────────────────────────────

export interface DetailModalAction {
  label: string;
  icon?: ReactNode;
  variant?: ButtonProps["variant"];
  onClick: () => void;
  hidden?: boolean;
  disabled?: boolean;
}

export interface DetailModalProps {
  onClose: () => void;
  icon: ReactNode;
  title: string;
  children: ReactNode;
  actions?: DetailModalAction[];
  className?: string;
  bodyClassName?: string;
}

export function DetailModal({
  onClose,
  icon,
  title,
  children,
  actions = [],
  className,
  bodyClassName,
}: DetailModalProps): JSX.Element {
  const visibleActions = actions.filter((a) => !a.hidden);

  return (
    <Sheet open onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side="right"
        className={cn("flex h-full w-full max-w-sm flex-col gap-0 overflow-hidden p-0", className)}
      >
        <SheetHeader className="flex flex-row items-center gap-3 space-y-0 border-b border-border px-5 py-4">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10">
            {icon}
          </div>
          <SheetTitle className="text-base">{title}</SheetTitle>
        </SheetHeader>

        <div className={bodyClassName ?? "flex flex-1 min-h-0 flex-col overflow-y-auto"}>{children}</div>

        {visibleActions.length > 0 && (
          <div className="border-t border-border px-5 py-4">
            <div
              className={cn(
                "gap-2",
                visibleActions.length >= 3 ? "grid grid-cols-2" : "flex items-center",
              )}
            >
              {visibleActions.map((action, index) => {
                const isLastOdd =
                  visibleActions.length >= 3 &&
                  visibleActions.length % 2 === 1 &&
                  index === visibleActions.length - 1;
                return (
                  <Button
                    key={action.label}
                    variant={action.variant ?? "outline"}
                    className={cn(
                      "gap-2 rounded-xl",
                      visibleActions.length < 3 && "flex-1",
                      isLastOdd && "col-span-2",
                    )}
                    onClick={action.onClick}
                    disabled={action.disabled}
                  >
                    {action.icon}
                    {action.label}
                  </Button>
                );
              })}
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
