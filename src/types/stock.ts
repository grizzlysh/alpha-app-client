// ── Detail Search Result ──────────────────────────────────────────────────────

export interface StockDetailSearchResult {
  uuid: string;
  barcode: string | null;
  batchNumber: string;
  expiryDate: string;
  quantityPieces: number;
  quantityBox: number;
  quantityPerBox: number;
  distributor: { uuid: string; name: string };
  stock: { uuid: string; effectiveSellingPrice: number };
  medicine: {
    uuid: string;
    name: string;
    unit: string;
    shape: { name: string };
    type: { name: string };
  };
}

export interface StockDetailListParams {
  search?: string;
}

export interface StockCatalogParams {
  search?: string;
  medicineTypeUuid?: string;
  page?: number;
  limit?: number;
}

// ── Batch / Detail ────────────────────────────────────────────────────────────

export interface StockDetail {
  uuid: string;
  batchNumber: string;
  barcode: string | null;
  expiryDate: string;
  quantityPieces: number;
  quantityBox: number;
  quantityPerBox: number;
  distributor: {
    uuid: string;
    name: string;
  };
  invoiceDetail: { uuid: string } | null;
}

// ── Stock ─────────────────────────────────────────────────────────────────────

export interface Stock {
  uuid: string;
  totalPieces: number;
  reorderLevel: number;
  basePrice: number;
  calculatedPrice: number;
  sellingPrice: number | null;
  isManualPrice: boolean;
  effectiveSellingPrice: number;
  isLowStock: boolean;
  isCriticalStock: boolean;
  medicine: {
    uuid: string;
    name: string;
    unit: string;
    shape: { name: string };
    type: { name: string };
    medicineClass: { name: string };
  };
  details: StockDetail[];
  createdAt: string;
  updatedAt: string;
}

// ── Alerts ────────────────────────────────────────────────────────────────────

export interface ExpiringSoonItem {
  uuid: string;
  batchNumber: string;
  expiryDate: string;
  quantityPieces: number;
  daysUntilExpiry: number;
  medicine: {
    uuid: string;
    name: string;
    unit: string;
  };
  stock: {
    uuid: string;
  };
}

export interface StockAlerts {
  lowStock: Stock[];
  expiringSoon: ExpiringSoonItem[];
}

// ── Movement ──────────────────────────────────────────────────────────────────

export interface StockMovement {
  uuid: string;
  type: string;
  reason: string;
  quantity: number;
  quantityBefore: number;
  quantityAfter: number;
  description: string | null;
  createdAt: string;
  medicine: { uuid: string; name: string };
  stockDetail: { uuid: string; batchNumber: string };
  invoiceDetail: { uuid: string; invoice: { invoiceNumber: string } } | null;
  sale: { uuid: string; saleNumber: string } | null;
  stockReturn: { uuid: string; returnNumber: string } | null;
  stockDisposal: { uuid: string; disposalNumber: string } | null;
}

// ── Query Params ──────────────────────────────────────────────────────────────

export interface StockListParams {
  page?: number;
  limit?: number;
  search?: string;
  isLowStock?: boolean;
  isExpiringSoon?: boolean;
  sortBy?: "name" | "totalPieces" | "updatedAt";
  sortOrder?: "asc" | "desc";
}

export interface StockMovementListParams {
  page?: number;
  limit?: number;
  medicineUuid?: string;
  type?: string;
  reason?: string;
  dateFrom?: string;
  dateTo?: string;
  sortOrder?: "asc" | "desc";
}

// ── Mutation Payloads ─────────────────────────────────────────────────────────

export interface UpdateStockPricePayload {
  sellingPrice: number | null;
}

export interface UpdateStockReorderLevelPayload {
  reorderLevel: number;
}

export interface AdjustStockPayload {
  quantity: number;
  signedByUuid: string;
  description: string;
}
