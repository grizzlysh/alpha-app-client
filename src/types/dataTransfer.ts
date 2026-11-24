export type ImportInvalidReason =
  | "NAME_REQUIRED"
  | "PHONE_REQUIRED"
  | "DUPLICATE_IN_FILE"
  | "INVALID_DATE"
  | "MEDICINE_NOT_FOUND"
  | "DISTRIBUTOR_NOT_FOUND"
  | "BATCH_REQUIRED"
  | "EXPIRED"
  | "QUANTITY_INVALID"
  | "PRICE_INVALID"
  | "BATCH_EXISTS";

export interface ImportResult {
  dryRun: boolean;
  created: number;
  existing: number;
  invalid: { row: number; name: string; reason: ImportInvalidReason }[];
  /** Opening stock only. */
  invoices?: number;
  totalValue?: number;
}

export interface DistributorRow {
  name: string;
  phone: string;
  email: string | null;
  address: string | null;
  contactPerson: string | null;
  permitNumber: string | null;
}

export interface CustomerRow {
  name: string;
  phone: string | null;
  address: string | null;
  gender: string | null;
  dateOfBirth: string | null;
  nik: string | null;
  bpjsNumber: string | null;
  medicalRecordNumber: string | null;
}

export type ImportRow = Record<string, string | number | undefined>;
