import type { PharmacyRole, RecordStatus } from "@/types/role";
import type { Translations } from "@/configs/i18n";

export function getRoleTypeLabel(type: PharmacyRole, t: Translations): string {
  const map: Record<PharmacyRole, string> = {
    OWNER: t.roleTypeOwner,
    ADMIN: t.roleTypeAdmin,
    PHARMACIST: t.roleTypePharmacist,
    HEAD_PHARMACIST: t.roleTypeHeadPharmacist,
    CASHIER: t.roleTypeCashier,
  };
  return map[type] ?? type;
}

export function getRoleStatusLabel(
  status: RecordStatus,
  t: Translations
): string {
  const map: Record<RecordStatus, string> = {
    ACTIVE: t.roleStatusActive,
    INACTIVE: t.roleStatusInactive,
    DELETED: t.roleStatusDeleted,
  };
  return map[status] ?? status;
}

import { getInitials, getAvatarColor, AVATAR_COLORS_RICH } from "@/utils/avatarHelpers";

export function getRoleInitials(name: string): string {
  return getInitials(name);
}

export function getRoleAvatarColor(name: string): string {
  return getAvatarColor(name, AVATAR_COLORS_RICH);
}

export function formatPermissionName(name: string): string {
  return name
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export { formatDate } from "@/utils/dateHelpers";
