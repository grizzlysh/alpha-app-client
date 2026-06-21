import type { ReportDateRangeParams, ReportFilterMode } from "@/types/report";

export function formatCurrency(value: number): string {
  return `Rp ${new Intl.NumberFormat("id-ID", { maximumFractionDigits: 0 }).format(
    Math.round(value)
  )}`;
}

export function formatDate(value: string | null | undefined): string {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function buildDateParams(
  mode: ReportFilterMode,
  dateFrom: string,
  dateTo: string
): ReportDateRangeParams {
  if (mode === "monthly") return { period: "monthly" };
  if (mode === "custom" && dateFrom && dateTo) return { dateFrom, dateTo };
  return {};
}
