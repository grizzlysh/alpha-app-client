import type { Translations } from "@/configs/i18n";
import type { PaymentStatus } from "@/types/invoice";
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

export function getPaymentStatusLabel(
  status: PaymentStatus,
  t: Translations
): string {
  const map: Record<PaymentStatus, string> = {
    UNPAID: t.invoicePaymentStatusUnpaid,
    PARTIAL: t.invoicePaymentStatusPartial,
    PAID: t.invoicePaymentStatusPaid,
  };
  return map[status] ?? status;
}

export function canDelete(status: PaymentStatus): boolean {
  return status === "UNPAID";
}

export function getInvoiceAvatarColor(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) & 0xffffffff;
  }
  return AVATAR_COLORS_RICH[Math.abs(hash) % AVATAR_COLORS_RICH.length];
}

export function getInvoiceInitials(invoiceNumber: string): string {
  const clean = invoiceNumber.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
  return clean.slice(0, 2) + clean.slice(-2);
}
