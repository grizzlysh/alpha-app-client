// ── Reference entities (Shape, Type, Class) ───────────────────────────────────

export interface MedicineShape {
  uuid: string;
  name: string;
  status: "ACTIVE" | "INACTIVE";
  /** Medicines using it; it can only be deleted at 0. */
  medicineCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface MedicineType {
  uuid: string;
  name: string;
  requiredPrescription: boolean;
  /** Narcotics/psychotropics/precursors: documents need the Head Pharmacist. */
  isControlled: boolean;
  status: "ACTIVE" | "INACTIVE";
  /** Medicines using it; it can only be deleted at 0. */
  medicineCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface MedicineTypeDropdownItem {
  uuid: string;
  name: string;
  requiredPrescription: boolean;
}

export interface MedicineClass {
  uuid: string;
  name: string;
  status: "ACTIVE" | "INACTIVE";
  /** Medicines using it; it can only be deleted at 0. */
  medicineCount: number;
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
  isControlled?: boolean;
}

// ── Medicine ──────────────────────────────────────────────────────────────────

export interface MedicineIngredient {
  uuid: string;
  name: string;
  /** "500 mg"; null when not recorded. */
  strength: string | null;
}

export interface MedicineIngredientInput {
  name: string;
  strength?: string | null;
}

export interface Medicine {
  uuid: string;
  /** The full name as shown (built from the parts, or typed when isCustomName). */
  name: string;
  baseName: string | null;
  variant: string | null;
  isCustomName: boolean;
  /** The ingredients' strengths as in the name ("500/50 mg"); "" when none. */
  strength: string;
  unit: string;
  /** One code for all batches (maker's EAN-13 or in-house); null when not set. */
  barcode: string | null;
  status: "ACTIVE" | "INACTIVE";
  medicineShape: { uuid: string; name: string };
  medicineType: { uuid: string; name: string };
  medicineClass: { uuid: string; name: string };
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
  /** Only for a custom name. */
  name?: string;
  baseName?: string;
  variant?: string | null;
  isCustomName: boolean;
  medicineShapeUuid: string;
  medicineTypeUuid: string;
  medicineClassUuid: string;
  unit: string;
  barcode?: string | null;
  ingredients: MedicineIngredientInput[];
}

export interface UpdateMedicinePayload {
  name?: string;
  baseName?: string;
  variant?: string | null;
  isCustomName?: boolean;
  medicineShapeUuid?: string;
  medicineTypeUuid?: string;
  medicineClassUuid?: string;
  unit?: string;
  barcode?: string | null;
  ingredients?: MedicineIngredientInput[];
  status?: "ACTIVE" | "INACTIVE";
}
