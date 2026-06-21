import type { Translations } from "@/configs/i18n";
import type { PurchaseOrderStatus } from "@/types/purchaseOrder";

export { formatDate } from "@/utils/dateHelpers";

export function getPOStatusLabel(
  status: PurchaseOrderStatus,
  t: Translations
): string {
  const map: Record<PurchaseOrderStatus, string> = {
    DRAFT: t.poStatusDraft,
    SENT: t.poStatusSent,
    COMPLETED: t.poStatusCompleted,
    CANCELLED: t.poStatusCancelled,
  };
  return map[status] ?? status;
}

export function canEdit(status: PurchaseOrderStatus): boolean {
  return status === "DRAFT";
}

export function canSubmit(status: PurchaseOrderStatus): boolean {
  return status === "DRAFT";
}

export function canPrint(status: PurchaseOrderStatus): boolean {
  return status === "DRAFT" || status === "SENT" || status === "COMPLETED";
}

export function canMarkReceived(status: PurchaseOrderStatus): boolean {
  return status === "SENT";
}

export function canCancel(status: PurchaseOrderStatus): boolean {
  return status === "DRAFT" || status === "SENT";
}

export function canDelete(status: PurchaseOrderStatus): boolean {
  return status === "DRAFT";
}

export function canRepurchase(status: PurchaseOrderStatus): boolean {
  return status !== "DRAFT";
}

import { AVATAR_COLORS_RICH } from "@/utils/avatarHelpers";

export function getPOAvatarColor(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) & 0xffffffff;
  }
  return AVATAR_COLORS_RICH[Math.abs(hash) % AVATAR_COLORS_RICH.length];
}

export function getPOInitials(orderNumber: string): string {
  const clean = orderNumber.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
  return clean.slice(0, 2) + clean.slice(-2);
}
