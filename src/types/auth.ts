import type { PharmacyRole } from "@/types/role";

export type PlatformRole = "PLATFORM_ADMIN" | "PLATFORM_VIEWER" | "PLATFORM_SUPPORT";

// Role shape inside accessiblePharmacies — no uuid, only returned in currentPharmacy
export interface PharmacyItemRole {
  name: string;
  type: PharmacyRole;
}

export interface PharmacyItem {
  uuid: string;
  name: string;
  address: string;
  role: PharmacyItemRole | null;
}

export interface LoginUserData {
  uuid: string;
  name: string;
  email: string;
  platformRole: PlatformRole | null;
  accessiblePharmacies: PharmacyItem[];
}

// Full role object inside currentPharmacy — includes uuid
export interface PharmacyRoleItem {
  uuid: string;
  name: string;
  type: PharmacyRole;
}

export interface PermissionSet {
  read?: boolean;
  create?: boolean;
  update?: boolean;
  delete?: boolean;
}

export interface CurrentPharmacyData {
  uuid: string;
  name: string;
  role: PharmacyRoleItem | null;
  permissions: Record<string, PermissionSet>;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: LoginUserData;
  currentPharmacy: CurrentPharmacyData | null;
}

export interface SelectPharmacyPayload {
  pharmacyUuid: string;
}

export interface SelectPharmacyResponse {
  accessToken: string;
  user: LoginUserData;
  currentPharmacy: CurrentPharmacyData;
}

export interface MeResponse {
  user: LoginUserData;
  currentPharmacy: CurrentPharmacyData | null;
}

export interface AuthState {
  accessToken: string | null;
  user: LoginUserData | null;
  currentPharmacy: CurrentPharmacyData | null;
  permissions: Record<string, PermissionSet>;
  isAuthenticated: boolean;
  pharmacySelected: boolean;
}
