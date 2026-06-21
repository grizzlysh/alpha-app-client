import type { PharmacyCategory } from "@/types/pharmacy";
import type { RecordStatus } from "@/types/role";
import type { Translations } from "@/configs/i18n";

import { getInitials, getAvatarColor, AVATAR_COLORS_RICH } from "@/utils/avatarHelpers";

export function getPharmacyInitials(name: string): string {
  return getInitials(name);
}

export function getPharmacyAvatarColor(name: string): string {
  return getAvatarColor(name, AVATAR_COLORS_RICH);
}

export function getPharmacyCategoryLabel(
  category: PharmacyCategory,
  t: Translations
): string {
  const map: Record<PharmacyCategory, string> = {
    APOTEK: t.pharmaCategoryApotek,
    KLINIK: t.pharmaCategoryKlinik,
    RUMAH_SAKIT: t.pharmaCategoryRumahSakit,
    PUSKESMAS: t.pharmaCategoryPuskesmas,
  };
  return map[category] ?? category;
}

export function getPharmacyStatusLabel(
  status: RecordStatus,
  t: Translations
): string {
  const map: Record<RecordStatus, string> = {
    ACTIVE: t.pharmaStatusActive,
    INACTIVE: t.pharmaStatusInactive,
    DELETED: t.pharmaStatusDeleted,
  };
  return map[status] ?? status;
}

export function getBizLicenseStatusLabel(
  status: RecordStatus,
  t: Translations
): string {
  return getPharmacyStatusLabel(status, t);
}

export { formatDate } from "@/utils/dateHelpers";
