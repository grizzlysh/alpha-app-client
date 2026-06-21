import { axiosInstance } from "@/configs/axiosInstance";
import type { ApiResponse } from "@/types/api";
import type {
  StockMovement,
  StockMovementDetail,
  StockMovementListParams,
} from "@/types/stockMovement";

export async function getStockMovements(
  params?: StockMovementListParams
): Promise<ApiResponse<StockMovement[]>> {
  const response = await axiosInstance.get<ApiResponse<StockMovement[]>>(
    "/stock-movements",
    { params }
  );
  return response.data;
}

export async function getStockMovement(
  uuid: string
): Promise<ApiResponse<StockMovementDetail>> {
  const response = await axiosInstance.get<ApiResponse<StockMovementDetail>>(
    `/stock-movements/${uuid}`
  );
  return response.data;
}
