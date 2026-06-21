import { axiosInstance } from "@/configs/axiosInstance";
import type { ApiResponse } from "@/types/api";
import type {
  StockReturn,
  StockReturnListParams,
  CreateStockReturnPayload,
  UpdateStockReturnPayload,
  CancelStockReturnPayload,
  RejectStockReturnPayload,
} from "@/types/stockReturn";

const EMPTY_204: ApiResponse<null> = {
  success: true,
  code: "",
  data: null,
  message: { en: "", id: "" },
  errors: null,
  meta: null,
};

export async function getStockReturns(
  params?: StockReturnListParams
): Promise<ApiResponse<StockReturn[]>> {
  const response = await axiosInstance.get<ApiResponse<StockReturn[]>>(
    "/stock-returns",
    { params }
  );
  return response.data;
}

export async function getStockReturn(
  uuid: string
): Promise<ApiResponse<StockReturn>> {
  const response = await axiosInstance.get<ApiResponse<StockReturn>>(
    `/stock-returns/${uuid}`
  );
  return response.data;
}

export async function createStockReturn(
  payload: CreateStockReturnPayload
): Promise<ApiResponse<StockReturn>> {
  const response = await axiosInstance.post<ApiResponse<StockReturn>>(
    "/stock-returns",
    payload
  );
  return response.data;
}

export async function updateStockReturn(
  uuid: string,
  payload: UpdateStockReturnPayload
): Promise<ApiResponse<StockReturn>> {
  const response = await axiosInstance.put<ApiResponse<StockReturn>>(
    `/stock-returns/${uuid}`,
    payload
  );
  return response.data;
}

export async function completeStockReturn(
  uuid: string
): Promise<ApiResponse<StockReturn>> {
  const response = await axiosInstance.patch<ApiResponse<StockReturn>>(
    `/stock-returns/${uuid}/complete`
  );
  return response.data;
}

export async function rejectStockReturn(
  uuid: string,
  payload: RejectStockReturnPayload
): Promise<ApiResponse<StockReturn>> {
  const response = await axiosInstance.patch<ApiResponse<StockReturn>>(
    `/stock-returns/${uuid}/reject`,
    payload
  );
  return response.data;
}

export async function cancelStockReturn(
  uuid: string,
  payload: CancelStockReturnPayload
): Promise<ApiResponse<StockReturn>> {
  const response = await axiosInstance.patch<ApiResponse<StockReturn>>(
    `/stock-returns/${uuid}/cancel`,
    payload
  );
  return response.data;
}

export async function deleteStockReturn(
  uuid: string
): Promise<ApiResponse<null>> {
  const response = await axiosInstance.delete<ApiResponse<null>>(
    `/stock-returns/${uuid}`
  );
  if (response.status === 204 || !response.data) return EMPTY_204;
  return response.data;
}
