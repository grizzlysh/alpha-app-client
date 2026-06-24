export type PharmacyRole = "OWNER" | "ADMIN" | "PHARMACIST" | "HEAD_PHARMACIST" | "CASHIER";
export type RecordStatus = "ACTIVE" | "INACTIVE" | "DELETED";

export interface Permission {
  uuid: string;
  name: string;
  module: string;
  description: string | null;
}

export interface PermissionGroup {
  module: string;
  permissions: Permission[];
}

export interface Role {
  uuid: string;
  name: string;
  type: PharmacyRole;
  isGlobal: boolean;
  requiresLicense: boolean;
  status: RecordStatus;
  permissionCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface RoleDetail extends Role {
  permissions: Permission[];
}

export interface RoleListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: RecordStatus;
  isGlobal?: "true" | "false";
  sortBy?: "name" | "createdAt";
  sortOrder?: "asc" | "desc";
  pharmacyUuid?: string;
}

export interface CreateRolePayload {
  name: string;
  type: PharmacyRole;
  requiresLicense?: boolean;
  pharmacyUuid?: string;
}

export interface UpdateRolePayload {
  name?: string;
  requiresLicense?: boolean;
  status?: RecordStatus;
}

export interface SetRolePermissionsPayload {
  permissionUuids: string[];
}

export interface PermissionListParams {
  search?: string;
  module?: string;
  page?: number;
  limit?: number;
}

export interface RoleDdlItem {
  uuid: string;
  name: string;
  type: PharmacyRole;
  isGlobal: boolean;
  requiresLicense: boolean;
}
