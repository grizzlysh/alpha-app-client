// ── Detail Search Result ──────────────────────────────────────────────────────

export interface StockDetailSearchResult {
  /** On a barcode scan: what the code was (a batch, a medicine, or one item of a batch). */
  scanMatch?: "BATCH" | "MEDICINE" | "ITEM";
  uuid: string;
  barcode: string | null;
  batchNumber: string;
  expiryDate: string;
  quantityPieces: number;
  /** quantityPieces minus pieces reserved by held sales. */
  availablePieces: number;
  quantityBox: number;
  quantityPerBox: number;
  distributor: { uuid: string; name: string };
  stock: { uuid: string; effectiveSellingPrice: number };
  medicine: {
    uuid: string;
    name: string;
    unit: string;
    barcode?: string | null;
    shape: { name: string };
    type: { name: string; requiredPrescription: boolean };
  };
}

export interface StockDetailListParams {
  search?: string;
  /** Sellable (unexpired) batches of one medicine, earliest expiry first. */
  medicineUuid?: string;
  /** Exact scan: that batch, or the medicine's sellable batches earliest expiry first. */
  barcode?: string;
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

export interface StockCardMedicine {
  uuid: string;
  name: string;
  unit: string;
  barcode: string | null;
  shape: string;
  type: string;
  isControlled: boolean;
  requiredPrescription: boolean;
  therapeuticClass: string;
}

/** Data behind a printed batch, item or medicine label. */
export interface BatchLabel {
  pharmacy: { name: string; code: string };
  medicine: StockCardMedicine;
  batch: {
    uuid: string;
    batchNumber: string;
    barcode: string;
    expiryDate: string;
    quantityPieces: number;
    quantityPerBox: number;
    distributor: string;
    location: string | null;
  };
  reorderLevel: number;
  /** Stock of the medicine across all its batches. */
  medicineTotalPieces: number;
  sellingPrice: number;
}

/** One day on a medicine's stock card (all batches together). */
export interface MedicineStockCardDay {
  /** yyyy-MM-dd */
  date: string;
  in: number;
  out: number;
  balance: number;
  documents: string[];
  sales: number;
  adjustments: number;
}

export interface MedicineStockCard {
  pharmacy: { name: string; code: string };
  medicine: StockCardMedicine;
  reorderLevel: number;
  totalPieces: number;
  quantityPerBox: number;
  sellingPrice: number;
  batches: { batchNumber: string; expiryDate: string; quantityPieces: number; location: string | null }[];
  period: { from: string; to: string };
  openingBalance: number;
  closingBalance: number;
  movementsAfterPeriod: number;
  days: MedicineStockCardDay[];
}

export interface MedicineStockCardParams {
  from?: string;
  to?: string;
}
