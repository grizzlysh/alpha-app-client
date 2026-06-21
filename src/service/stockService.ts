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
