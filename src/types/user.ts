import type { RecordStatus } from "@/types/role";

export type PlatformRole = "PLATFORM_ADMIN" | "PLATFORM_VIEWER" | "PLATFORM_SUPPORT";

export interface LicenseItem {
  uuid: string;
  licenseNumber: string;
  validFrom: string;
  validUntil: string;
  status: RecordStatus;
  createdAt: string;
  updatedAt: string;
}

export interface PlacementItem {
  uuid: string;
  pharmacy: { uuid: string; name: string; code: string };
  role: { uuid: string; name: string };
  joinedAt: string;
  leftAt: string | null;
  status: RecordStatus;
  activeLicense: LicenseItem | null;
  createdAt: string;
  updatedAt: string;
}

export interface UserListItem {
  uuid: string;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  platformRole: PlatformRole | null;
  mustChangePassword: boolean;
  status: RecordStatus;
  placementCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface UserDetail extends UserListItem {
  updatedAt: string;
  placements: PlacementItem[];
}

export interface UserDropdownItem {
  uuid: string;
  name: string;
  email: string;
}

export interface UserListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: RecordStatus;
  platformRole?: PlatformRole;
  pharmacyUuid?: string;
}

export interface PlacementGroup {
  pharmacy: { uuid: string; name: string; code: string };
  tenures: PlacementItem[];
}

export interface PlacementListParams {
  status?: RecordStatus;
}

export interface LicenseInput {
  licenseNumber: string;
  validFrom: string;
  validUntil: string;
}

export interface CreateUserPayload {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  placement?: {
    pharmacyUuid: string;
    roleUuid: string;
    joinedAt: string;
    license?: LicenseInput;
  };
}

export interface UpdateUserPayload {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  status?: "ACTIVE" | "INACTIVE";
}

export interface CreatePlacementPayload {
  pharmacyUuid: string;
  roleUuid: string;
  joinedAt: string;
  license?: LicenseInput;
}

export interface UpdatePlacementPayload {
  roleUuid?: string;
  joinedAt?: string;
  leftAt?: string | null;
  status?: "ACTIVE" | "INACTIVE";
}

export interface LicenseListParams {
  page?: number;
  limit?: number;
  status?: RecordStatus;
}

export interface CreateLicensePayload {
  licenseNumber: string;
  validFrom: string;
  validUntil: string;
}

export interface UpdateLicensePayload {
  licenseNumber?: string;
  validFrom?: string;
  validUntil?: string;
  status?: "ACTIVE" | "INACTIVE";
}

// ── Me (self-service profile) ──────────────────────────────────────────────────

export interface MeProfile {
  uuid: string;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  platformRole: PlatformRole | null;
  mustChangePassword: boolean;
  status: RecordStatus;
  createdAt: string;
  updatedAt: string;
  currentPlacement: PlacementItem | null;
}

export interface UpdateMePayload {
  name?: string;
  phone?: string;
  address?: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}
