import type { Stock } from "@/types/stock";

export { getInitials, getAvatarColor } from "@/utils/avatarHelpers";
export { formatDate } from "@/utils/dateHelpers";

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

export function daysUntilExpiry(expiryDateStr: string): number {
  const now = new Date();
  const expiry = new Date(expiryDateStr);
  return Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

export function getStockStatusClass(stock: Stock): string {
  if (stock.isCriticalStock) {
    return "bg-destructive/15 text-destructive";
  }
  if (stock.isLowStock) {
    return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300";
  }
  return "bg-success/15 text-success";
}

export function getStockStatusKey(
  stock: Stock
): "stockStatusCritical" | "stockStatusLow" | "stockStatusNormal" {
  if (stock.isCriticalStock) return "stockStatusCritical";
  if (stock.isLowStock) return "stockStatusLow";
  return "stockStatusNormal";
}
