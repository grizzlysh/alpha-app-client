import type { Translations } from "@/configs/i18n";
import type { StockMovementType, StockMovementReason } from "@/types/stockMovement";
import { AVATAR_COLORS_RICH } from "@/utils/avatarHelpers";

export { formatDate } from "@/utils/dateHelpers";

export function getSMTypeLabel(type: StockMovementType, t: Translations): string {
  const map: Record<StockMovementType, string> = {
    IN: t.smTypeIn,
    OUT: t.smTypeOut,
  };
  return map[type] ?? type;
}

export function getSMReasonLabel(reason: StockMovementReason, t: Translations): string {
  const map: Record<StockMovementReason, string> = {
    PURCHASE: t.smReasonPurchase,
    SALE: t.smReasonSale,
    RETURN: t.smReasonReturn,
    ADJUSTMENT: t.smReasonAdjustment,
    DISPOSAL: t.smReasonDisposal,
    DAMAGED: t.smReasonDamaged,
    TRANSFER: t.smReasonTransfer,
    DONATION: t.smReasonDonation,
  };
  return map[reason] ?? reason;
}

export function getSMInitials(medicineName: string): string {
  const parts = medicineName.trim().split(/\s+/);
  if (parts.length >= 2) {
    return ((parts[0][0] ?? "") + (parts[1][0] ?? "")).toUpperCase();
  }
  return medicineName.slice(0, 2).toUpperCase();
}

export function getSMAvatarColor(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) & 0xffffffff;
  }
  return AVATAR_COLORS_RICH[Math.abs(hash) % AVATAR_COLORS_RICH.length];
}

export function getSMTypeBadgeClass(type: StockMovementType): string {
  return type === "IN"
    ? "bg-success/15 text-success"
    : "bg-destructive/15 text-destructive";
}

export function formatQuantityChange(
  type: StockMovementType,
  quantity: number,
  unit: string
): string {
  return `${type === "IN" ? "+" : "-"}${quantity.toLocaleString("en-US")} ${unit}`;
}
