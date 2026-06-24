import type { RecordStatus } from "@/types/role";

export type PharmacyCategory = "APOTEK" | "KLINIK" | "RUMAH_SAKIT" | "PUSKESMAS";

export interface ActiveBusinessLicense {
  uuid: string;
  licenseNumber: string;
  validFrom: string;
  validUntil: string;
  status: RecordStatus;
}

export interface PharmacistInCharge {
  placementUuid: string;
  user: { uuid: string; name: string };
  activeLicense: ActiveBusinessLicense | null;
}

export interface Pharmacy {
  uuid: string;
  name: string;
  code: string;
  category: PharmacyCategory;
  phone: string;
  address: string;
  location: string;
  email: string | null;
  status: RecordStatus;
  activeLicense: ActiveBusinessLicense | null;
  pharmacistInCharge: PharmacistInCharge | null;
  createdAt: string;
  updatedAt: string;
}

export interface PharmacyListParams {
  search?: string;
  status?: RecordStatus;
  category?: PharmacyCategory;
  sortBy?: "name" | "code" | "createdAt";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export interface CreatePharmacyPayload {
  name: string;
  code?: string;
  category: PharmacyCategory;
  phone: string;
  address: string;
  location: string;
  email?: string;
}

export interface UpdatePharmacyPayload {
  name?: string;
  code?: string;
  category?: PharmacyCategory;
  phone?: string;
  address?: string;
  location?: string;
  email?: string;
  status?: RecordStatus;
}

export interface PharmacyDdlItem {
  uuid: string;
  name: string;
  code: string;
}
