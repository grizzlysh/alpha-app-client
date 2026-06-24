export type PurchaseOrderStatus = "DRAFT" | "SENT" | "COMPLETED" | "CANCELLED";

export interface PurchaseOrderPrintData {
  orderNumber: string;
  orderedAt: string;
  distributor: { name: string };
  details: PurchaseOrderDetail[];
  pharmacy: {
    name: string;
    address: string;
    location: string;
    businessLicenseNumber: string;
  };
  headPharmacist: {
    name: string;
    practiceLicenseNumber: string;
  } | null;
}

export interface PurchaseOrderMedicine {
  uuid: string;
  name: string;
  unit: string;
}

export interface PurchaseOrderDetail {
  uuid: string;
  medicine: PurchaseOrderMedicine;
  quantity: number;
  unit: string;
  description: string | null;
}

export interface PurchaseOrderParty {
  uuid: string;
  name: string;
}

export interface PurchaseOrder {
  uuid: string;
  orderNumber: string;
  status: PurchaseOrderStatus;
  description: string | null;
  cancellationReason: string | null;
  orderedAt: string;
  createdAt: string;
  updatedAt: string;
  distributor: PurchaseOrderParty;
  signedByUser: PurchaseOrderParty | null;
  details: PurchaseOrderDetail[];
}

export interface PurchaseOrderListParams {
  search?: string;
  status?: PurchaseOrderStatus;
  distributorUuid?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: "orderNumber" | "orderedAt" | "createdAt";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export interface CreatePurchaseOrderDetailPayload {
  medicineUuid: string;
  quantity: number;
  unit: string;
  description?: string;
}

export interface CreatePurchaseOrderPayload {
  distributorUuid: string;
  signedByUuid?: string;
  description?: string;
  details: CreatePurchaseOrderDetailPayload[];
}

export interface UpdatePurchaseOrderPayload {
  distributorUuid?: string;
  signedByUuid?: string;
  description?: string;
  details?: CreatePurchaseOrderDetailPayload[];
}

export interface CancelPurchaseOrderPayload {
  cancellationReason: string;
}

export interface PurchaseOrderDropdownItem {
  uuid: string;
  orderNumber: string;
  status: PurchaseOrderStatus;
  distributorName: string;
}
