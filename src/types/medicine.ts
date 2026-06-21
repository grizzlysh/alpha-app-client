// ── Reference entities (Shape, Type, Class) ───────────────────────────────────

export interface MedicineShape {
  uuid: string;
  name: string;
  isGlobal: boolean;
  status: "ACTIVE" | "INACTIVE";
  createdAt: string;
  updatedAt: string;
}

export interface MedicineType {
  uuid: string;
  name: string;
  requiredPrescription: boolean;
  isGlobal: boolean;
  status: "ACTIVE" | "INACTIVE";
  createdAt: string;
  updatedAt: string;
}

export interface MedicineTypeDropdownItem {
  uuid: string;
  name: string;
  requiredPrescription: boolean;
  isGlobal: boolean;
}

export interface MedicineClass {
  uuid: string;
  name: string;
  isGlobal: boolean;
  status: "ACTIVE" | "INACTIVE";
  createdAt: string;
  updatedAt: string;
}

export interface MedicineDropdownItem {
  uuid: string;
  name: string;
  unit: string;
}

export interface ReferenceListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: "ACTIVE" | "INACTIVE";
}

export interface ReferencePayload {
  name: string;
  status: "ACTIVE" | "INACTIVE";
  requiredPrescription?: boolean;
}

// ── Medicine ──────────────────────────────────────────────────────────────────

export interface MedicineIngredient {
  uuid: string;
  name: string;
}

export interface Medicine {
  uuid: string;
  name: string;
  unit: string;
  status: "ACTIVE" | "INACTIVE";
  medicineShape: { uuid: string; name: string } | null;
  medicineType: { uuid: string; name: string } | null;
  medicineClass: { uuid: string; name: string } | null;
  ingredients: MedicineIngredient[];
  createdAt: string;
  updatedAt: string;
}

export interface MedicineListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: "ACTIVE" | "INACTIVE";
  sortBy?: "name" | "createdAt";
  sortOrder?: "asc" | "desc";
  medicineShapeUuid?: string;
  medicineTypeUuid?: string;
  medicineClassUuid?: string;
}

export interface CreateMedicinePayload {
  name: string;
  medicineShapeUuid: string;
  medicineTypeUuid: string;
  medicineClassUuid: string;
  unit: string;
  ingredients: string[];
  status: "ACTIVE" | "INACTIVE";
}

export interface UpdateMedicinePayload {
  name?: string;
  medicineShapeUuid?: string;
  medicineTypeUuid?: string;
  medicineClassUuid?: string;
  unit?: string;
  ingredients?: string[];
  status?: "ACTIVE" | "INACTIVE";
}
