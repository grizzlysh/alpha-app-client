export type StockReturnStatus = "ON_PROCESS" | "COMPLETED" | "CANCELLED" | "REJECTED";

export interface StockReturnMedicine {
  uuid: string;
  name: string;
  unit: string;
}

export interface StockReturnBatch {
  uuid: string;
  batchNumber: string;
  expiryDate: string;
  invoiceDetail: {
    uuid: string;
    invoice: {
      uuid: string;
      invoiceNumber: string;
    };
  };
}

export interface StockReturnDetail {
  uuid: string;
  quantityPieces: number;
  quantityBox: number;
  price: string;
  totalAmount: string;
  medicine: StockReturnMedicine;
  stockDetail: StockReturnBatch;
}

export interface StockReturnParty {
  uuid: string;
  name: string;
}

export interface StockReturn {
  uuid: string;
  returnNumber: string;
  status: StockReturnStatus;
  reason: string | null;
  description: string | null;
  totalAmount: string;
  cancellationReason: string | null;
  rejectionReason: string | null;
  returnedAt: string | null;
  createdAt: string;
  updatedAt: string;
  distributor: StockReturnParty;
  signedBy: StockReturnParty | null;
  details: StockReturnDetail[];
}

export interface StockReturnListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: StockReturnStatus;
  distributorUuid?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: "returnNumber" | "createdAt" | "returnedAt";
  sortOrder?: "asc" | "desc";
}

export interface CreateStockReturnDetailPayload {
  stockDetailUuid: string;
  quantityPieces: number;
  reason?: string;
}

export interface CreateStockReturnPayload {
  distributorUuid: string;
  signedByUuid?: string;
  description?: string;
  details: CreateStockReturnDetailPayload[];
}

export interface UpdateStockReturnPayload {
  distributorUuid?: string;
  signedByUuid?: string;
  description?: string;
  details?: CreateStockReturnDetailPayload[];
}

export interface CancelStockReturnPayload {
  description: string;
}

export interface RejectStockReturnPayload {
  description: string;
}
