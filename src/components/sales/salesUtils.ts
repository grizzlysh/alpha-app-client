import type { Translations } from "@/configs/i18n";
import type { SaleStatus, SaleType, PaymentStatus, PaymentMethod } from "@/types/sale";
import { AVATAR_COLORS_RICH } from "@/utils/avatarHelpers";

export { formatDate } from "@/utils/dateHelpers";

export function formatCurrency(value: number): string {
  return `Rp ${new Intl.NumberFormat("id-ID", { maximumFractionDigits: 0 }).format(Math.round(value))}`;
}

export function formatCurrencyDecimal(value: number): string {
  const rounded = Math.round(value * 100) / 100;
  return `Rp ${new Intl.NumberFormat("id-ID", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(rounded)}`;
}

export function getSaleStatusLabel(status: SaleStatus, t: Translations): string {
  const map: Record<SaleStatus, string> = {
    PENDING: t.saleStatusPending,
    COMPLETED: t.saleStatusCompleted,
    CANCELLED: t.saleStatusCancelled,
    REFUNDED: t.saleStatusRefunded,
  };
  return map[status] ?? status;
}

export function getSaleTypeLabel(saleType: SaleType, t: Translations): string {
  const map: Record<SaleType, string> = {
    CASH: t.saleTypeCash,
    CREDIT: t.saleTypeCredit,
  };
  return map[saleType] ?? saleType;
}

export function getSalePaymentStatusLabel(status: PaymentStatus, t: Translations): string {
  const map: Record<PaymentStatus, string> = {
    UNPAID: t.salePaymentStatusUnpaid,
    PARTIAL: t.salePaymentStatusPartial,
    PAID: t.salePaymentStatusPaid,
  };
  return map[status] ?? status;
}

export function getPaymentMethodLabel(method: PaymentMethod, t: Translations): string {
  const map: Record<PaymentMethod, string> = {
    CASH: t.salePaymentMethodCash,
    TRANSFER: t.salePaymentMethodTransfer,
    CREDIT: t.salePaymentMethodCredit,
  };
  return map[method] ?? method;
}

export function getSaleInitials(saleNumber: string): string {
  const clean = saleNumber.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
  return clean.slice(0, 2) + clean.slice(-2);
}

export function getSaleAvatarColor(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) & 0xffffffff;
  }
  return AVATAR_COLORS_RICH[Math.abs(hash) % AVATAR_COLORS_RICH.length];
}

export function canCancelSale(status: SaleStatus): boolean {
  return status === "COMPLETED" || status === "PENDING";
}

export function canRefundSale(status: SaleStatus): boolean {
  return status === "COMPLETED";
}

export function canCompleteSale(status: SaleStatus): boolean {
  return status === "PENDING";
}

export function canAddPayment(status: SaleStatus, saleType: SaleType, paymentStatus: PaymentStatus | undefined): boolean {
  return status === "COMPLETED" && saleType === "CREDIT" && paymentStatus !== "PAID";
}
