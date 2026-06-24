export type ExpiryTier = "red" | "amber" | "yellow";
export type LicenseStatus = "valid" | "expiring_soon" | "expired";
export type RunwayStatus = "critical" | "low" | "adequate" | "overstocked";

// ── Section 1: Daily Operations ───────────────────

export interface KpiDelta {
  today: number;
  yesterday: number;
  delta: number;
  deltaPercent: number | null;
}

export interface RecentTransaction {
  uuid: string;
  saleNumber: string;
  customerName: string;
  totalAmount: number;
  soldAt: string;
  isRx: boolean;
}

export interface DailyOpsResponse {
  revenue: KpiDelta;
  transactionCount: KpiDelta;
  avgTransactionValue: KpiDelta;
  otcVsRx: {
    otcCount: number;
    rxCount: number;
    otcRevenue: number;
    rxRevenue: number;
  };
  recentTransactions: RecentTransaction[];
}

// ── Section 2: Sales Trend ────────────────────────

export interface SalesTrendDay {
  date: string;
  revenue: number;
  transactionCount: number;
}

export interface SalesTrendResponse {
  period: number;
  data: SalesTrendDay[];
}

// ── Section 3: Inventory Alerts ───────────────────

export interface RestockItem {
  uuid: string;
  medicineName: string;
  totalPieces: number;
  reorderLevel: number;
  isOutOfStock: boolean;
}

export interface ExpiringBatch {
  uuid: string;
  batchNumber: string;
  medicineName: string;
  expiryDate: string;
  daysUntilExpiry: number;
  quantityPieces: number;
  tier: ExpiryTier;
}

export interface InventoryAlertsResponse {
  restockNeeded: RestockItem[];
  expiringSoon: ExpiringBatch[];
}

// ── Section 4: Top Products ───────────────────────

export interface TopProductItem {
  medicineUuid: string;
  medicineName: string;
  totalQty: number;
  totalRevenue: number;
}

export interface TopProductsResponse {
  byQuantity: TopProductItem[];
  byRevenue: TopProductItem[];
}

// ── Section 5: Purchasing Status ──────────────────

export interface OpenPurchaseOrderItem {
  uuid: string;
  orderNumber: string;
  distributorName: string;
  orderedAt: string;
  itemCount: number;
}

export interface UnpaidInvoiceByDistributor {
  distributorUuid: string;
  distributorName: string;
  invoiceCount: number;
  totalOutstanding: number;
  oldestDueDate: string | null;
}

export interface UnpaidInvoiceSummary {
  totalCount: number;
  totalOutstanding: number;
  byDistributor: UnpaidInvoiceByDistributor[];
}

// ── Section 6: Compliance ─────────────────────────

export interface LicenseItem {
  uuid: string;
  licenseNumber: string;
  validUntil: string;
  daysUntilExpiry: number;
  status: LicenseStatus;
}

export interface PracticeLicenseItem {
  userName: string;
  roleType: string;
  license: LicenseItem;
}

export interface ComplianceResponse {
  businessLicenses: LicenseItem[];
  practiceLicenses: PracticeLicenseItem[];
}

// ── Section 7: Inventory Asset ────────────────────

export interface InventoryAssetResponse {
  totalAsset: number;
  prevQuarterEndAsset: number;
  prevQuarterEndDate: string;
  delta: number;
  deltaPercent: number;
}

// ── Section 8: Slow Movers ────────────────────────

export interface SlowMoverItem {
  medicineUuid: string;
  medicineName: string;
  totalPieces: number;
  lastMovementAt: string | null;
  daysSinceLastMovement: number | null;
  estimatedValue: number;
}

export interface SlowMoversResponse {
  threshold: number;
  items: SlowMoverItem[];
}

// ── Section 9: Stock Runway ───────────────────────

export interface StockRunwayItem {
  medicineUuid: string;
  medicineName: string;
  currentPieces: number;
  avgDailySales: number;
  daysRemaining: number | null;
  status: RunwayStatus;
}

export interface StockRunwayResponse {
  items: StockRunwayItem[];
}

// ── Section 8: Revenue & Profit ──────────────────────

export interface RevenueProfitMonth {
  year: number;
  month: number;
  label: string;
  revenue: number;
  grossProfit: number;
  marginPercent: number | null;
}

export interface RevenueProfitMtdMetric {
  value: number;
  prevValue: number;
  delta: number;
  deltaPercent: number | null;
}

export interface RevenueProfitResponse {
  last6Months: RevenueProfitMonth[];
  mtd: {
    revenue: RevenueProfitMtdMetric & { transactionCount: number };
    grossProfit: RevenueProfitMtdMetric & { marginPercent: number | null };
  };
}

// ── Section 9: Purchase Spend ─────────────────────

export interface PurchaseSpendMonth {
  year: number;
  month: number;
  label: string;
  spend: number;
  invoiceCount: number;
}

export interface PurchaseSpendResponse {
  last6Months: PurchaseSpendMonth[];
  mtd: {
    value: number;
    prevValue: number;
    delta: number;
    deltaPercent: number | null;
    invoiceCount: number;
  };
}

// ── Section 13: Payment Schedule ─────────────────

export interface PaymentScheduleItem {
  invoiceUuid: string;
  invoiceNumber: string;
  distributorName: string;
  dueDate: string | null;
  outstanding: number;
  isOverdue: boolean;
  daysUntilDue: number | null;
}

export interface PaymentScheduleResponse {
  upcoming: PaymentScheduleItem[];
  overdue: PaymentScheduleItem[];
  totalUpcoming: number;
  totalOverdue: number;
}

// ── Section 14: Credit Sales Outstanding ─────────

export interface CreditSaleItem {
  saleUuid: string;
  saleNumber: string;
  customerName: string;
  soldAt: string;
  grandTotal: number;
  paidAmount: number;
  outstanding: number;
  daysSinceSale: number;
}

export interface CreditSalesOutstandingResponse {
  items: CreditSaleItem[];
  totalOutstanding: number;
  totalCount: number;
}

// ── Dashboard Responses ───────────────────────────

export interface DashboardResponse {
  dailyOps: DailyOpsResponse;
  inventoryAlerts: InventoryAlertsResponse;
  topProducts: TopProductsResponse;
  inventoryAsset: InventoryAssetResponse;
  slowMovers: SlowMoversResponse;
  stockRunway: StockRunwayResponse;
}

export interface AdvancedDashboardResponse {
  salesTrend: SalesTrendResponse;
  openPurchaseOrders: OpenPurchaseOrderItem[];
  unpaidInvoices: UnpaidInvoiceSummary;
  compliance: ComplianceResponse;
  revenueProfit: RevenueProfitResponse;
  purchaseSpend: PurchaseSpendResponse;
  paymentSchedule: PaymentScheduleResponse;
  creditSalesOutstanding: CreditSalesOutstandingResponse;
}
