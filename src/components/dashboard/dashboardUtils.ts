import type React from "react";

export const CHART_TOOLTIP_STYLE: React.CSSProperties = {
  borderRadius: 12,
  border: "1px solid hsl(var(--border))",
  backgroundColor: "hsl(var(--card))",
  color: "hsl(var(--card-foreground))",
  fontSize: 12,
};

export function formatCompactCurrency(value: number): string {
  if (value >= 1_000_000) {
    return `Rp ${(value / 1_000_000).toLocaleString("id-ID", { maximumFractionDigits: 1 })}jt`;
  }
  if (value >= 1_000) {
    return `Rp ${(value / 1_000).toLocaleString("id-ID", { maximumFractionDigits: 0 })}rb`;
  }
  return `Rp ${value.toLocaleString("id-ID")}`;
}
