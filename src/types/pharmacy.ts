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
  /** False until someone holds an active Owner placement. */
  hasOwner: boolean;
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

export type PharmacyOwnerInput =
  | { mode: "new"; name: string; email: string; phone?: string }
  | { mode: "existing"; userUuid: string };

/** Everything is created in one transaction — nothing is left half-made. */
export interface CreatePharmacyPayload {
  name: string;
  code: string;
  category: PharmacyCategory;
  phone: string;
  address: string;
  location: string;
  email?: string;
  license?: { licenseNumber: string; validFrom: string; validUntil: string };
  owner?: PharmacyOwnerInput;
  /** Start from this pharmacy's medicines, classifications and parameters instead of the default template. */
  copyFromPharmacyUuid?: string;
}

export interface PharmacyCreateResult {
  pharmacy: Pharmacy;
  owner: { uuid: string; name: string; email: string; temporaryPassword: string | null } | null;
  copied: { medicines: number; shapes: number; types: number; classes: number } | null;
}

export interface PharmacySetupStatus {
  hasActiveLicense: boolean;
  hasHeadPharmacist: boolean;
  staffCount: number;
  medicineCount: number;
  distributorCount: number;
  storageCabinetCount: number;
  stockedMedicineCount: number;
}

export interface UpdatePharmacyPayload {
  name?: string;
  code?: string;
  category?: PharmacyCategory;
  phone?: string;
  address?: string;
  location?: string;
  /** null clears it. */
  email?: string | null;
  status?: RecordStatus;
}

export interface PharmacyDdlItem {
  uuid: string;
  name: string;
  code: string;
}
