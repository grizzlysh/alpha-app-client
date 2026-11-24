import type { PaymentStatus, SaleStatus } from "./sale";
import type { PaginationMeta } from "./api";
export type CustomerType = "PATIENT" | "PROFESSIONAL";
export type Gender = "MALE" | "FEMALE";

export interface MedicalRecord {
  uuid: string;
  number: string;
}

export interface PatientDetail {
  nik: string | null;
  gender: Gender | null;
  dateOfBirth: string | null;
  bpjsNumber: string | null;
}

export interface ProfessionalDetail {
  strNumber: string | null;
  sipNumber: string | null;
  profession: string | null;
}

export interface Customer {
  uuid: string;
  customerType: CustomerType;
  name: string;
  phone: string | null;
  address: string | null;
  description: string | null;
  isWalkIn: boolean;
  status: "ACTIVE" | "INACTIVE";
  createdAt: string;
  updatedAt: string;
  medicalRecord: MedicalRecord | null;
  patientDetail: PatientDetail | null;
  professionalDetail: ProfessionalDetail | null;
}

export interface CustomerListParams {
  page?: number;
  limit?: number;
  search?: string;
  customerType?: CustomerType;
  status?: "ACTIVE" | "INACTIVE";
  isWalkIn?: boolean;
}

export interface CreateCustomerPayload {
  customerType: CustomerType;
  name: string;
  phone?: string;
  address?: string;
  description?: string;
  patientDetail?: {
    nik?: string;
    gender?: Gender;
    dateOfBirth?: string;
    bpjsNumber?: string;
  };
  professionalDetail?: {
    strNumber?: string;
    sipNumber?: string;
    profession?: string;
  };
}

export interface UpdateCustomerPayload {
  name?: string;
  phone?: string;
  address?: string;
  description?: string;
  status?: "ACTIVE" | "INACTIVE";
  patientDetail?: {
    nik?: string;
    gender?: Gender;
    dateOfBirth?: string;
    bpjsNumber?: string;
  };
  professionalDetail?: {
    strNumber?: string;
    sipNumber?: string;
    profession?: string;
  };
}

export interface CustomerDropdownItem {
  uuid: string;
  name: string;
  phone: string | null;
  customerType: CustomerType;
  isWalkIn: boolean;
}

export interface CustomerDropdownParams {
  search?: string;
  customerType?: CustomerType;
}

// ── Purchase history ──────────────────────────────────────────────────────────

export interface PurchaseMedicine {
  uuid: string;
  name: string;
  unit: string;
}

export interface CustomerPurchaseHistory {
  summary: {
    /** Completed sales only. */
    transactionCount: number;
    totalSpent: number;
    averageSpent: number;
    firstPurchaseAt: string | null;
    lastPurchaseAt: string | null;
  };
  /** Most bought medicines in the last 12 months. */
  frequentItems: {
    medicine: PurchaseMedicine;
    timesBought: number;
    totalPieces: number;
    lastBoughtAt: string;
  }[];
  sales: {
    uuid: string;
    saleNumber: string;
    soldAt: string;
    status: SaleStatus;
    paymentStatus: PaymentStatus | null;
    grandTotal: number;
    prescription: { uuid: string; prescriptionNumber: string | null } | null;
    items: { medicine: PurchaseMedicine; quantityPieces: number; totalAmount: number }[];
  }[];
  meta: PaginationMeta;
}
