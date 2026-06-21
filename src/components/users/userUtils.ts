import type { PlatformRole, PlacementItem } from "@/types/user";
import type { RecordStatus } from "@/types/role";
import type { Translations } from "@/configs/i18n";

import { getInitials, getAvatarColor, AVATAR_COLORS_RICH } from "@/utils/avatarHelpers";

export function getUserInitials(name: string): string {
  return getInitials(name);
}

export function getUserAvatarColor(name: string): string {
  return getAvatarColor(name, AVATAR_COLORS_RICH);
}

export function getPlatformRoleLabel(
  role: PlatformRole | null,
  t: Translations
): string {
  if (!role) return "—";
  const map: Record<PlatformRole, string> = {
    PLATFORM_ADMIN: t.platformRoleAdmin,
    PLATFORM_VIEWER: t.platformRoleViewer,
    PLATFORM_SUPPORT: t.platformRoleSupport,
  };
  return map[role] ?? role;
}

export function getUserStatusLabel(
  status: RecordStatus,
  t: Translations
): string {
  const map: Record<RecordStatus, string> = {
    ACTIVE: t.userStatusActive,
    INACTIVE: t.userStatusInactive,
    DELETED: t.userStatusDeleted,
  };
  return map[status] ?? status;
}

export function getPlacementStatusLabel(
  status: RecordStatus,
  t: Translations
): string {
  const map: Record<RecordStatus, string> = {
    ACTIVE: t.userStatusActive,
    INACTIVE: t.userStatusInactive,
    DELETED: t.userStatusDeleted,
  };
  return map[status] ?? status;
}

export function isPlacementActive(placement: PlacementItem): boolean {
  return placement.status === "ACTIVE" && placement.leftAt === null;
}

export { formatDate } from "@/utils/dateHelpers";
