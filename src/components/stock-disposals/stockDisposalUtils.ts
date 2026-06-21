import type { Translations } from "@/configs/i18n";
import type { StockDisposalStatus, DisposalReason } from "@/types/stockDisposal";
import { AVATAR_COLORS_RICH } from "@/utils/avatarHelpers";

export { formatDate } from "@/utils/dateHelpers";

export function getSDStatusLabel(
  status: StockDisposalStatus,
  t: Translations
): string {
  const map: Record<StockDisposalStatus, string> = {
    DRAFT: t.sdStatusDraft,
    COMPLETED: t.sdStatusCompleted,
    CANCELLED: t.sdStatusCancelled,
  };
  return map[status] ?? status;
}

export function getSDReasonLabel(
  reason: DisposalReason,
  t: Translations
): string {
  const map: Record<DisposalReason, string> = {
    EXPIRED: t.sdReasonExpired,
    DAMAGED: t.sdReasonDamaged,
    CONTAMINATED: t.sdReasonContaminated,
  };
  return map[reason] ?? reason;
}

export function getSDInitials(disposalNumber: string): string {
  const clean = disposalNumber.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
  return clean.slice(0, 2) + clean.slice(-2);
}

export function getSDAvaterColor(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) & 0xffffffff;
  }
  return AVATAR_COLORS_RICH[Math.abs(hash) % AVATAR_COLORS_RICH.length];
}

export function canEdit(status: StockDisposalStatus): boolean {
  return status === "DRAFT";
}

export function canComplete(status: StockDisposalStatus): boolean {
  return status === "DRAFT";
}

export function canCancel(status: StockDisposalStatus): boolean {
  return status === "DRAFT";
}

export function canDelete(status: StockDisposalStatus): boolean {
  return status === "DRAFT" || status === "COMPLETED";
}
