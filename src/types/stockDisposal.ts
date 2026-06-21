export type StockDisposalStatus = "DRAFT" | "COMPLETED" | "CANCELLED";
export type DisposalReason = "EXPIRED" | "DAMAGED" | "CONTAMINATED";

export interface StockDisposalMedicine {
  uuid: string;
  name: string;
  unit: string;
}

export interface StockDisposalBatch {
  uuid: string;
  batchNumber: string;
  expiryDate: string;
}

export interface StockDisposalDetail {
  uuid: string;
  quantityPieces: number;
  quantityBox: number;
  reason: DisposalReason;
  medicine: StockDisposalMedicine;
  stockDetail: StockDisposalBatch;
}

export interface StockDisposalParty {
  uuid: string;
  name: string;
}

export interface StockDisposal {
  uuid: string;
  disposalNumber: string;
  status: StockDisposalStatus;
  description: string | null;
  cancellationReason: string | null;
  disposedAt: string | null;
  createdAt: string;
  updatedAt: string;
  signedByUser: StockDisposalParty | null;
  details: StockDisposalDetail[];
}

export interface StockDisposalListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: StockDisposalStatus;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: "disposalNumber" | "createdAt" | "disposedAt";
  sortOrder?: "asc" | "desc";
}

export interface CreateStockDisposalDetailPayload {
  stockDetailUuid: string;
  quantityPieces: number;
  reason: DisposalReason;
}

export interface CreateStockDisposalPayload {
  signedByUuid?: string;
  description?: string;
  details: CreateStockDisposalDetailPayload[];
}

export interface UpdateStockDisposalPayload {
  signedByUuid?: string;
  description?: string;
  details?: CreateStockDisposalDetailPayload[];
}

export interface CancelStockDisposalPayload {
  description: string;
}
