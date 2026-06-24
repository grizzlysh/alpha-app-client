// ── Shared ────────────────────────────────────────────────────

export type ReportPeriod = "monthly";
export type ReportFilterMode = "monthly" | "custom";

export interface ReportDateRangeParams {
  period?: ReportPeriod;
  dateFrom?: string;
  dateTo?: string;
}

// ── Sales ────────────────────────────────────────────────────

export interface SalesPaymentBreakdown {
  method: string;
  count: number;
  amount: number;
}

export interface SalesTopMedicine {
  medicineUuid: string;
  medicineName: string;
  totalQuantityPieces: number;
  totalRevenue: number;
}

export interface SalesDailyRevenue {
  date: string;
  revenue: number;
  count: number;
}

export interface SalesSummary {
  totalRevenue: number;
  totalSales: number;
  averageOrderValue: number;
  paymentBreakdown: SalesPaymentBreakdown[];
}

export interface SalesExportRow {
  saleNumber: string;
  soldAt: string;
  customerName: string;
  saleType: string;
  status: string;
  totalAmount: number;
  discountPercentage: number;
  discountAmount: number;
  ppnAmount: number;
  grandTotal: number;
  paidAmount: number;
  paymentStatus: string;
}

export interface SalesSummaryResponse {
  summary: SalesSummary;
  topMedicines: SalesTopMedicine[];
  dailyRevenue: SalesDailyRevenue[];
}

export type SalesListParams = ReportDateRangeParams & { page?: number; limit?: number };

// ── Purchases ────────────────────────────────────────────────

export interface PurchaseByDistributor {
  distributorUuid: string;
  distributorName: string;
  invoiceCount: number;
  totalAmount: number;
  paidAmount: number;
  unpaidAmount: number;
}

export interface PurchaseInvoiceRow {
  invoiceUuid: string;
  invoiceNumber: string;
  invoiceDate: string;
  distributorName: string;
  purchaseOrderNumber: string | null;
  totalAmount: number;
  paidAmount: number;
  paymentStatus: string;
}

export interface PurchaseSummary {
  totalInvoices: number;
  totalAmount: number;
  paidAmount: number;
  unpaidAmount: number;
}

export interface PurchaseSummaryResponse {
  summary: PurchaseSummary;
  byDistributor: PurchaseByDistributor[];
}

export interface PurchaseReportParams extends ReportDateRangeParams {
  distributorUuid?: string;
}

export type PurchaseListParams = PurchaseReportParams & { page?: number; limit?: number };

// ── Inventory ────────────────────────────────────────────────

export interface InventoryStockLevel {
  medicineUuid: string;
  medicineName: string;
  unit: string;
  totalPieces: number;
  reorderLevel: number;
  isLowStock: boolean;
  basePrice: number;
  sellingPrice: number;
}

export interface InventoryExpiryAlert {
  medicineUuid: string;
  medicineName: string;
  batchNumber: string;
  expiryDate: string;
  daysUntilExpiry: number;
  quantityPieces: number;
  distributorName: string;
}

export interface InventorySummary {
  totalMedicines: number;
  totalStockValue: number;
  lowStockCount: number;
  expiredCount: number;
  expiringSoonCount: number;
}

export interface InventorySummaryResponse {
  summary: InventorySummary;
  expiringSoon: InventoryExpiryAlert[];
  expired: InventoryExpiryAlert[];
}

export interface InventoryListParams {
  expiryDays?: number;
  isLowStock?: boolean;
  page?: number;
  limit?: number;
}

// ── Stock Movements ──────────────────────────────────────────

export interface StockMovementRow {
  movementUuid: string;
  createdAt: string;
  medicineName: string;
  medicineUuid: string;
  type: string;
  reason: string;
  quantity: number;
  quantityBefore: number;
  quantityAfter: number;
  batchNumber: string;
  description: string | null;
  referenceNumber: string | null;
}

export interface StockMovementSummary {
  totalMovements: number;
  totalInQty: number;
  totalOutQty: number;
}

export interface StockMovementReportParams extends ReportDateRangeParams {
  medicineUuid?: string;
  type?: string;
  reason?: string;
}

export type StockMovementListParams = StockMovementReportParams & {
  page?: number;
  limit?: number;
};

// ── Disposals ────────────────────────────────────────────────

export interface DisposalByReason {
  reason: string;
  count: number;
  totalQuantityPieces: number;
}

export interface DisposalDetailRow {
  disposalUuid: string;
  disposalNumber: string;
  disposedAt: string | null;
  medicineName: string;
  batchNumber: string;
  quantityPieces: number;
  reason: string;
  status: string;
}

export interface DisposalSummary {
  totalDisposals: number;
  totalItems: number;
  totalQuantityPieces: number;
}

export interface DisposalSummaryResponse {
  summary: DisposalSummary;
  byReason: DisposalByReason[];
}

export type DisposalReportParams = ReportDateRangeParams;
export type DisposalListParams = DisposalReportParams & { page?: number; limit?: number };

// ── Returns ──────────────────────────────────────────────────

export interface ReturnByDistributor {
  distributorUuid: string;
  distributorName: string;
  returnCount: number;
  totalQuantityPieces: number;
}

export interface ReturnDetailRow {
  returnUuid: string;
  returnNumber: string;
  returnedAt: string | null;
  distributorName: string;
  medicineName: string;
  batchNumber: string;
  quantityPieces: number;
  reason: string | null;
  status: string;
}

export interface ReturnSummary {
  totalReturns: number;
  totalItems: number;
  totalQuantityPieces: number;
}

export interface ReturnSummaryResponse {
  summary: ReturnSummary;
  byDistributor: ReturnByDistributor[];
}

export interface ReturnReportParams extends ReportDateRangeParams {
  distributorUuid?: string;
}

export type ReturnListParams = ReturnReportParams & { page?: number; limit?: number };
