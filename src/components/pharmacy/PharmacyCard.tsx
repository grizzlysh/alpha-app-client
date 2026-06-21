import type { JSX } from "react";
import { ArrowRight, Loader2, AlertTriangle } from "lucide-react";

import { cn } from "@/utils/cn";
import { PharmacyAvatar } from "@/components/pharmacy/PharmacyAvatar";

export interface PharmacyStatRow {
  salesFormatted: string;
  transactions: number;
  prescriptionQueue: number;
}

export interface PharmacyStatusRow {
  isOpen: boolean;
  roles: string[];
  lowStockCount?: number;
}

interface PharmacyCardLabels {
  salesLabel: string;
  transactionsLabel: string;
  rxQueueLabel: string;
  statusOpen: string;
  statusClosed: string;
  lowStockWarning: string;
}

interface PharmacyCardProps {
  uuid: string;
  name: string;
  address: string;
  stats?: PharmacyStatRow;
  status?: PharmacyStatusRow;
  labels: PharmacyCardLabels;
  onSelect: (uuid: string) => void;
  isSelecting: boolean;
  disabled: boolean;
}

export function PharmacyCard({
  uuid,
  name,
  address,
  stats,
  status,
  labels,
  onSelect,
  isSelecting,
  disabled,
}: PharmacyCardProps): JSX.Element {
  return (
    <div
      className={cn(
        "group rounded-2xl border border-border bg-card shadow-sm",
        "transition-all duration-200",
        // Hover — border turns primary + diffuse glow (light: subtle, dark: vivid)
        "hover:border-primary",
        "hover:shadow-[0_0_0_1px_hsl(var(--primary)_/_0.2),_0_0_18px_hsl(var(--primary)_/_0.1)]",
        "dark:hover:shadow-[0_0_0_1px_hsl(var(--primary)_/_0.55),_0_0_28px_hsl(var(--primary)_/_0.3)]",
        // Selecting state — always glowing
        isSelecting && [
          "border-primary",
          "shadow-[0_0_0_1px_hsl(var(--primary)_/_0.3),_0_0_18px_hsl(var(--primary)_/_0.12)]",
          "dark:shadow-[0_0_0_1px_hsl(var(--primary)_/_0.6),_0_0_30px_hsl(var(--primary)_/_0.35)]",
        ]
      )}
    >
      {/* Top row: avatar + name/address + arrow */}
      <div className="flex items-center gap-3 p-5">
        <PharmacyAvatar name={name} size="md" />

        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold uppercase text-foreground">{name}</p>
          <p className="mt-0.5 truncate text-sm text-muted-foreground">
            {address}
          </p>
        </div>

        <button
          type="button"
          onClick={() => onSelect(uuid)}
          disabled={disabled}
          aria-label={`Select ${name}`}
          className={cn(
            "flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl",
            "border border-border bg-background text-muted-foreground",
            "transition-all duration-200",
            // Card hover → solid green fill + white arrow
            "group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground",
            "hover:border-primary hover:bg-primary hover:text-primary-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
            "disabled:cursor-not-allowed disabled:opacity-50"
          )}
        >
          {isSelecting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ArrowRight className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Stats row — only when data is available */}
      {stats && (
        <>
          <div className="mx-5 border-t border-border" />
          <div className="grid grid-cols-3 gap-4 px-5 py-4">
            <div>
              <p className="text-base font-semibold text-foreground">
                {stats.salesFormatted}
              </p>
              <p className="mt-0.5 min-w-[5rem] whitespace-nowrap text-xs text-muted-foreground">
                {labels.salesLabel}
              </p>
            </div>
            <div>
              <p className="text-base font-semibold text-foreground">
                {stats.transactions}
              </p>
              <p className="mt-0.5 min-w-[5rem] whitespace-nowrap text-xs text-muted-foreground">
                {labels.transactionsLabel}
              </p>
            </div>
            <div>
              <p className="text-base font-semibold text-foreground">
                {stats.prescriptionQueue}
              </p>
              <p className="mt-0.5 min-w-[5rem] whitespace-nowrap text-xs text-muted-foreground">
                {labels.rxQueueLabel}
              </p>
            </div>
          </div>
        </>
      )}

      {/* Status row — only when data is available */}
      {status && (
        <>
          <div className="mx-5 border-t border-border" />
          <div className="flex items-center justify-between px-5 py-3">
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <span
                className={cn(
                  "h-2 w-2 rounded-full",
                  status.isOpen ? "bg-success" : "bg-muted-foreground"
                )}
              />
              <span>{status.isOpen ? labels.statusOpen : labels.statusClosed}</span>
              {status.roles.map((role) => (
                <span key={role}>
                  <span className="mx-0.5 opacity-40">·</span>
                  {role}
                </span>
              ))}
            </div>

            {status.lowStockCount !== undefined && status.lowStockCount > 0 && (
              <span className="flex items-center gap-1 rounded-lg bg-warning/10 px-2.5 py-1 text-xs font-medium text-warning">
                <AlertTriangle className="h-3 w-3" />
                {status.lowStockCount} {labels.lowStockWarning}
              </span>
            )}
          </div>
        </>
      )}
    </div>
  );
}
