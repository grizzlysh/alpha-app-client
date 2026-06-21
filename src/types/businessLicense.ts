import type { RecordStatus } from "@/types/role";

export interface BusinessLicense {
  uuid: string;
  pharmacyUuid: string;
  licenseNumber: string;
  validFrom: string;
  validUntil: string;
  status: RecordStatus;
  createdAt: string;
  updatedAt: string;
}

export interface BusinessLicenseListParams {
  status?: RecordStatus;
  sortBy?: "licenseNumber" | "validFrom" | "validUntil" | "createdAt";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export interface CreateBusinessLicensePayload {
  pharmacyUuid: string;
  licenseNumber: string;
  validFrom: string;
  validUntil: string;
}

export interface UpdateBusinessLicensePayload {
  licenseNumber?: string;
  validFrom?: string;
  validUntil?: string;
  status?: RecordStatus;
}
