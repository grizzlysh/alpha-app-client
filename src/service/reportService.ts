import { axiosInstance } from "@/configs/axiosInstance";
import type { ApiResponse } from "@/types/api";
import type {
  ReportDateRangeParams,
  SalesSummaryResponse,
  SalesExportRow,
  SalesListParams,
  PurchaseReportParams,
  PurchaseSummaryResponse,
  PurchaseInvoiceRow,
  PurchaseListParams,
  InventorySummaryResponse,
  InventoryStockLevel,
  InventoryListParams,
  StockMovementReportParams,
  StockMovementSummary,
  StockMovementRow,
  StockMovementListParams,
  DisposalReportParams,
  DisposalSummaryResponse,
  DisposalDetailRow,
  DisposalListParams,
  ReturnReportParams,
  ReturnSummaryResponse,
  ReturnDetailRow,
  ReturnListParams,
} from "@/types/report";

// ── Sales ─────────────────────────────────────────────────────

export async function getSalesSummary(
  params?: ReportDateRangeParams
): Promise<ApiResponse<SalesSummaryResponse>> {
  const response = await axiosInstance.get<ApiResponse<SalesSummaryResponse>>(
    "/reports/sales/summary",
    { params }
  );
  return response.data;
}

export async function getSalesList(
  params?: SalesListParams
): Promise<ApiResponse<SalesExportRow[]>> {
  const response = await axiosInstance.get<ApiResponse<SalesExportRow[]>>(
    "/reports/sales",
    { params }
  );
  return response.data;
}

export async function getSalesExport(
  params?: ReportDateRangeParams
): Promise<ApiResponse<SalesExportRow[]>> {
  const response = await axiosInstance.get<ApiResponse<SalesExportRow[]>>(
    "/reports/sales/export",
    { params }
  );
  return response.data;
}

// ── Purchases ─────────────────────────────────────────────────

export async function getPurchaseSummary(
  params?: PurchaseReportParams
): Promise<ApiResponse<PurchaseSummaryResponse>> {
  const response = await axiosInstance.get<ApiResponse<PurchaseSummaryResponse>>(
    "/reports/purchases/summary",
    { params }
  );
  return response.data;
}

export async function getPurchaseList(
  params?: PurchaseListParams
): Promise<ApiResponse<PurchaseInvoiceRow[]>> {
  const response = await axiosInstance.get<ApiResponse<PurchaseInvoiceRow[]>>(
    "/reports/purchases",
    { params }
  );
  return response.data;
}

export async function getPurchaseExport(
  params?: PurchaseReportParams
): Promise<ApiResponse<PurchaseInvoiceRow[]>> {
  const response = await axiosInstance.get<ApiResponse<PurchaseInvoiceRow[]>>(
    "/reports/purchases/export",
    { params }
  );
  return response.data;
}

// ── Inventory ─────────────────────────────────────────────────

export async function getInventorySummary(
  params?: { expiryDays?: number }
): Promise<ApiResponse<InventorySummaryResponse>> {
  const response = await axiosInstance.get<ApiResponse<InventorySummaryResponse>>(
    "/reports/inventory/summary",
    { params }
  );
  return response.data;
}

export async function getInventoryList(
  params?: InventoryListParams
): Promise<ApiResponse<InventoryStockLevel[]>> {
  const response = await axiosInstance.get<ApiResponse<InventoryStockLevel[]>>(
    "/reports/inventory",
    { params }
  );
  return response.data;
}

export async function getInventoryExport(
  params?: { isLowStock?: boolean }
): Promise<ApiResponse<InventoryStockLevel[]>> {
  const response = await axiosInstance.get<ApiResponse<InventoryStockLevel[]>>(
    "/reports/inventory/export",
    { params }
  );
  return response.data;
}

// ── Stock Movements ───────────────────────────────────────────

export async function getStockMovementSummary(
  params?: StockMovementReportParams
): Promise<ApiResponse<StockMovementSummary>> {
  const response = await axiosInstance.get<ApiResponse<StockMovementSummary>>(
    "/reports/stock-movements/summary",
    { params }
  );
  return response.data;
}

export async function getStockMovementList(
  params?: StockMovementListParams
): Promise<ApiResponse<StockMovementRow[]>> {
  const response = await axiosInstance.get<ApiResponse<StockMovementRow[]>>(
    "/reports/stock-movements",
    { params }
  );
  return response.data;
}

export async function getStockMovementExport(
  params?: StockMovementReportParams
): Promise<ApiResponse<StockMovementRow[]>> {
  const response = await axiosInstance.get<ApiResponse<StockMovementRow[]>>(
    "/reports/stock-movements/export",
    { params }
  );
  return response.data;
}

// ── Disposals ─────────────────────────────────────────────────

export async function getDisposalSummary(
  params?: DisposalReportParams
): Promise<ApiResponse<DisposalSummaryResponse>> {
  const response = await axiosInstance.get<ApiResponse<DisposalSummaryResponse>>(
    "/reports/disposals/summary",
    { params }
  );
  return response.data;
}

export async function getDisposalList(
  params?: DisposalListParams
): Promise<ApiResponse<DisposalDetailRow[]>> {
  const response = await axiosInstance.get<ApiResponse<DisposalDetailRow[]>>(
    "/reports/disposals",
    { params }
  );
  return response.data;
}

export async function getDisposalExport(
  params?: DisposalReportParams
): Promise<ApiResponse<DisposalDetailRow[]>> {
  const response = await axiosInstance.get<ApiResponse<DisposalDetailRow[]>>(
    "/reports/disposals/export",
    { params }
  );
  return response.data;
}

// ── Returns ───────────────────────────────────────────────────

export async function getReturnSummary(
  params?: ReturnReportParams
): Promise<ApiResponse<ReturnSummaryResponse>> {
  const response = await axiosInstance.get<ApiResponse<ReturnSummaryResponse>>(
    "/reports/returns/summary",
    { params }
  );
  return response.data;
}

export async function getReturnList(
  params?: ReturnListParams
): Promise<ApiResponse<ReturnDetailRow[]>> {
  const response = await axiosInstance.get<ApiResponse<ReturnDetailRow[]>>(
    "/reports/returns",
    { params }
  );
  return response.data;
}

export async function getReturnExport(
  params?: ReturnReportParams
): Promise<ApiResponse<ReturnDetailRow[]>> {
  const response = await axiosInstance.get<ApiResponse<ReturnDetailRow[]>>(
    "/reports/returns/export",
    { params }
  );
  return response.data;
}
