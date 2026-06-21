import type { Translations } from "@/configs/i18n";
import type { StockReturnStatus } from "@/types/stockReturn";
import { AVATAR_COLORS_RICH } from "@/utils/avatarHelpers";

export { formatDate } from "@/utils/dateHelpers";

export function getSRStatusLabel(
  status: StockReturnStatus,
  t: Translations
): string {
  const map: Record<StockReturnStatus, string> = {
    ON_PROCESS: t.srStatusOnProcess,
    COMPLETED: t.srStatusCompleted,
    CANCELLED: t.srStatusCancelled,
    REJECTED: t.srStatusRejected,
  };
  return map[status] ?? status;
}

export function getSRInitials(returnNumber: string): string {
  const clean = returnNumber.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
  return clean.slice(0, 2) + clean.slice(-2);
}

export function getSRAvatarColor(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) & 0xffffffff;
  }
  return AVATAR_COLORS_RICH[Math.abs(hash) % AVATAR_COLORS_RICH.length];
}

export function canEdit(_status: StockReturnStatus): boolean {
  return false;
}

export function canComplete(status: StockReturnStatus): boolean {
  return status === "ON_PROCESS";
}

export function canReject(status: StockReturnStatus): boolean {
  return status === "ON_PROCESS";
}

export function canCancel(status: StockReturnStatus): boolean {
  return status === "ON_PROCESS";
}

export function canDelete(status: StockReturnStatus): boolean {
  return status === "ON_PROCESS";
}
