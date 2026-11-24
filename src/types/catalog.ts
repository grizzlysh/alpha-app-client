export interface CatalogIngredient {
  name: string;
  strength: string | null;
}

/** As exported: the full name plus its parts. */
export interface CatalogMedicine {
  name: string;
  baseName: string | null;
  variant: string | null;
  isCustomName: boolean;
  unit: string;
  shape: string;
  type: string;
  class: string;
  ingredients: CatalogIngredient[];
}

/** As imported from a file: a structured row sets baseName; ingredients may carry the strength ("Paracetamol 500 mg"). */
export interface CatalogImportMedicine {
  name: string;
  baseName?: string;
  variant?: string | null;
  isCustomName?: boolean;
  unit: string;
  shape: string;
  type: string;
  class: string;
  ingredients: string[];
}

export interface CatalogExport {
  pharmacy: { name: string; code: string };
  exportedAt: string;
  shapes: { name: string }[];
  types: { name: string; requiredPrescription: boolean; isControlled: boolean }[];
  classes: { name: string }[];
  medicines: CatalogMedicine[];
}

export interface CatalogImportPayload {
  dryRun?: boolean;
  shapes: { name: string }[];
  types: { name: string; requiredPrescription?: boolean; isControlled?: boolean }[];
  classes: { name: string }[];
  medicines: CatalogImportMedicine[];
}

export interface CatalogCount {
  created: number;
  existing: number;
}

export type CatalogInvalidReason =
  | "NAME_REQUIRED"
  | "UNIT_REQUIRED"
  | "SHAPE_REQUIRED"
  | "TYPE_REQUIRED"
  | "CLASS_REQUIRED"
  | "DUPLICATE_IN_FILE";

export interface CatalogImportResult {
  dryRun: boolean;
  shapes: CatalogCount;
  types: CatalogCount;
  classes: CatalogCount;
  medicines: CatalogCount & { invalid: { row: number; name: string; reason: CatalogInvalidReason }[] };
}
