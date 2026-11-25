import { axiosInstance } from "@/configs/axiosInstance";
import type { ApiResponse } from "@/types/api";
import type {
  Stock,
  StockAlerts,
  StockMovement,
  StockDetailSearchResult,
  StockDetailListParams,
  StockCatalogParams,
  StockListParams,
  StockMovementListParams,
  UpdateStockPricePayload,
  UpdateStockReorderLevelPayload,
  AdjustStockPayload,
  BatchLabel,
  MedicineStockCard,
  MedicineStockCardParams,
} from "@/types/stock";

export async function getStockDetails(
  params?: StockDetailListParams
): Promise<ApiResponse<StockDetailSearchResult[]>> {
  const response = await axiosInstance.get<ApiResponse<StockDetailSearchResult[]>>(
    "/stock/details",
    { params }
  );
  return response.data;
}

export async function getStockCatalog(
  params?: StockCatalogParams
): Promise<ApiResponse<StockDetailSearchResult[]>> {
  const response = await axiosInstance.get<ApiResponse<StockDetailSearchResult[]>>(
    "/stock/catalog",
    { params }
  );
  return response.data;
}

export async function getStocks(
  params?: StockListParams
): Promise<ApiResponse<Stock[]>> {
  const response = await axiosInstance.get<ApiResponse<Stock[]>>("/stock", {
    params,
  });
  return response.data;
}

export async function getStock(uuid: string): Promise<ApiResponse<Stock>> {
  const response = await axiosInstance.get<ApiResponse<Stock>>(
    `/stock/${uuid}`
  );
  return response.data;
}

export async function getStockAlerts(): Promise<ApiResponse<StockAlerts>> {
  const response = await axiosInstance.get<ApiResponse<StockAlerts>>(
    "/stock/alerts"
  );
  return response.data;
}

export async function getStockMovements(
  params?: StockMovementListParams
): Promise<ApiResponse<StockMovement[]>> {
  const response = await axiosInstance.get<ApiResponse<StockMovement[]>>(
    "/stock/movements",
    { params }
  );
  return response.data;
}

export async function updateStockPrice(
  stockUuid: string,
  payload: UpdateStockPricePayload
): Promise<ApiResponse<Stock>> {
  const response = await axiosInstance.patch<ApiResponse<Stock>>(
    `/stock/${stockUuid}/price`,
    payload
  );
  return response.data;
}

export async function updateStockReorderLevel(
  stockUuid: string,
  payload: UpdateStockReorderLevelPayload
): Promise<ApiResponse<Stock>> {
  const response = await axiosInstance.patch<ApiResponse<Stock>>(
    `/stock/${stockUuid}/reorder-level`,
    payload
  );
  return response.data;
}

export async function adjustStock(
  stockDetailUuid: string,
  payload: AdjustStockPayload
): Promise<ApiResponse<Stock>> {
  const response = await axiosInstance.post<ApiResponse<Stock>>(
    `/stock/${stockDetailUuid}/adjust`,
    payload
  );
  return response.data;
}

/** Header data and every movement of one batch, for its stock card and labels. */
export async function getBatchLabel(stockDetailUuid: string): Promise<ApiResponse<BatchLabel>> {
  const response = await axiosInstance.get<ApiResponse<BatchLabel>>(`/stock/details/${stockDetailUuid}/label`);
  return response.data;
}

/** Label data for many batches: the batches named and every in-stock batch of the medicines named. */
export async function getBatchLabels(payload: { stockDetailUuids?: string[]; medicineUuids?: string[] }): Promise<ApiResponse<BatchLabel[]>> {
  const response = await axiosInstance.post<ApiResponse<BatchLabel[]>>("/stock/labels", payload);
  return response.data;
}

export async function getMedicineStockCard(
  medicineUuid: string,
  params?: MedicineStockCardParams
): Promise<ApiResponse<MedicineStockCard>> {
  const response = await axiosInstance.get<ApiResponse<MedicineStockCard>>(`/stock/medicines/${medicineUuid}/card`, { params });
  return response.data;
}
