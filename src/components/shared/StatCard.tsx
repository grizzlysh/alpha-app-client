import type { JSX } from "react";
import { cn } from "@/utils/cn";

type TrendDirection = "up" | "down" | "neutral";

interface TrendInfo {
  direction: TrendDirection;
  label: string;
}

interface StatCardProps {
  label: string;
  value: string | null;
  trend?: TrendInfo;
  subLabel?: string;
  className?: string;
}

export function StatCard({
  label,
  value,
  trend,
  subLabel,
  className,
}: StatCardProps): JSX.Element {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-card px-5 py-4 shadow-sm",
        className
      )}
    >
      <p className="text-sm text-muted-foreground">{label}</p>

      <p className="mt-2 text-2xl font-bold tracking-tight text-foreground">
        {value ?? "—"}
      </p>

      {trend && (
        <p
          className={cn(
            "mt-1.5 flex items-center gap-1 text-sm font-medium",
            trend.direction === "up" && "text-success dark:text-success",
            trend.direction === "down" && "text-destructive",
            trend.direction === "neutral" && "text-muted-foreground"
          )}
        >
          {trend.direction === "up" && (
            <span aria-hidden>▲</span>
          )}
          {trend.direction === "down" && (
            <span aria-hidden>▼</span>
          )}
          {trend.label}
        </p>
      )}

      {subLabel && !trend && (
        <p className="mt-1.5 text-sm text-muted-foreground">{subLabel}</p>
      )}
    </div>
  );
}
