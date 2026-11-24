export type PrescriptionStatus = "PENDING" | "DISPENSED" | "PARTIAL" | "CANCELLED" | "EXPIRED";
export type PrescriptionDetailStatus = "PENDING" | "DISPENSED" | "PARTIAL" | "CANCELLED";

export interface PrescriptionListItem {
  uuid: string;
  prescriptionNumber: string | null;
  prescribedAt: string;
  status: PrescriptionStatus;
  createdAt: string;
  customer: { uuid: string; name: string };
  doctor: { uuid: string; name: string; licenseNumber: string | null } | null;
}

export interface AvailablePrescriptionItem {
  uuid: string;
  prescriptionNumber: string | null;
  prescribedAt: string;
  status: PrescriptionStatus;
  customer: { uuid: string; name: string };
  doctor: { uuid: string; name: string } | null;
}

export interface PrescriptionDetail {
  uuid: string;
  medicineName: string;
  frequency: string | null;
  duration: string | null;
  qty: number;
  dispensedQty: number;
  notes: string | null;
  status: PrescriptionDetailStatus;
  medicine: { uuid: string; name: string; unit: string } | null;
}

export interface Prescription {
  uuid: string;
  prescriptionNumber: string | null;
  prescribedAt: string;
  notes: string | null;
  status: PrescriptionStatus;
  createdAt: string;
  updatedAt: string;
  customer: { uuid: string; name: string };
  doctor: {
    uuid: string;
    name: string;
    licenseNumber: string | null;
    clinicName: string | null;
  } | null;
  sale: { uuid: string; saleNumber: string } | null;
  /** The examination this prescription was written in, if any. */
  medicalVisit: { uuid: string; visitDate: string; diagnosis: string | null } | null;
  details: PrescriptionDetail[];
}

export interface PrescriptionListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: PrescriptionStatus;
  doctorUuid?: string;
  customerUuid?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: "prescribedAt" | "createdAt" | "updatedAt";
  sortOrder?: "asc" | "desc";
}

export interface PrescriptionItemPayload {
  uuid?: string;
  medicineUuid?: string;
  medicineName: string;
  frequency?: string;
  duration?: string;
  qty: number;
  notes?: string;
}

export interface CreatePrescriptionPayload {
  customerUuid: string;
  doctorUuid?: string;
  medicalVisitUuid?: string;
  prescriptionNumber?: string;
  prescribedAt: string;
  notes?: string;
  items: PrescriptionItemPayload[];
}

export interface UpdatePrescriptionPayload {
  doctorUuid?: string | null;
  prescriptionNumber?: string | null;
  prescribedAt?: string;
  notes?: string | null;
  items?: PrescriptionItemPayload[];
}

export interface DispenseItemPayload {
  detailUuid: string;
  dispensedQty: number;
  stockDetailUuid: string;
  sellingPrice: number;
  originalPrice: number;
  discountPercentage?: number;
  discountAmount?: number;
}

export interface DispensePrescriptionPayload {
  items: DispenseItemPayload[];
  saleType: "CASH" | "CREDIT";
  discountPercentage?: number;
  discountAmount?: number;
  ppnPercentage?: number;
  ppnAmount?: number;
  totalAmount: number;
  grandTotal: number;
  description?: string;
  payment?: {
    paymentMethod: "CASH" | "TRANSFER" | "DEBIT" | "CREDIT_CARD" | "QRIS";
    description?: string;
  };
}
