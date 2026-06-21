export type StockMovementType = "IN" | "OUT";

export type StockMovementReason =
  | "PURCHASE"
  | "SALE"
  | "RETURN"
  | "ADJUSTMENT"
  | "DISPOSAL"
  | "DAMAGED"
  | "TRANSFER"
  | "DONATION";

export interface StockMovementMedicine {
  uuid: string;
  name: string;
  unit: string;
}

export interface StockMovementBatch {
  uuid: string;
  batchNumber: string;
}

export interface StockMovementReference {
  uuid: string;
  number: string;
}

export interface StockMovement {
  uuid: string;
  type: StockMovementType;
  reason: StockMovementReason;
  quantity: number;
  quantityBefore: number;
  quantityAfter: number;
  description: string | null;
  createdAt: string;
  medicine: StockMovementMedicine;
  stockDetail: StockMovementBatch;
  reference: StockMovementReference | null;
}

export interface StockMovementDetail extends StockMovement {
  stock: { uuid: string };
  invoiceDetail: {
    uuid: string;
    invoice: { invoiceNumber: string };
  } | null;
  sale: { uuid: string; saleNumber: string } | null;
  stockReturn: { uuid: string; returnNumber: string } | null;
  stockDisposal: { uuid: string; disposalNumber: string } | null;
  createdByUser: { name: string } | null;
}

export interface StockMovementListParams {
  page?: number;
  limit?: number;
  search?: string;
  medicineUuid?: string;
  type?: StockMovementType;
  reason?: StockMovementReason;
  dateFrom?: string;
  dateTo?: string;
  sortOrder?: "asc" | "desc";
}
