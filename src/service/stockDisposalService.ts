import { axiosInstance } from "@/configs/axiosInstance";
import type { ApiResponse } from "@/types/api";
import type {
  StockDisposal,
  StockDisposalListParams,
  CreateStockDisposalPayload,
  UpdateStockDisposalPayload,
  CancelStockDisposalPayload,
} from "@/types/stockDisposal";

const EMPTY_204: ApiResponse<null> = {
  success: true,
  code: "",
  data: null,
  message: { en: "", id: "" },
  errors: null,
  meta: null,
};

export async function getStockDisposals(
  params?: StockDisposalListParams
): Promise<ApiResponse<StockDisposal[]>> {
  const response = await axiosInstance.get<ApiResponse<StockDisposal[]>>(
    "/stock-disposals",
    { params }
  );
  return response.data;
}

export async function getStockDisposal(
  uuid: string
): Promise<ApiResponse<StockDisposal>> {
  const response = await axiosInstance.get<ApiResponse<StockDisposal>>(
    `/stock-disposals/${uuid}`
  );
  return response.data;
}

export async function createStockDisposal(
  payload: CreateStockDisposalPayload
): Promise<ApiResponse<StockDisposal>> {
  const response = await axiosInstance.post<ApiResponse<StockDisposal>>(
    "/stock-disposals",
    payload
  );
  return response.data;
}

export async function updateStockDisposal(
  uuid: string,
  payload: UpdateStockDisposalPayload
): Promise<ApiResponse<StockDisposal>> {
  const response = await axiosInstance.put<ApiResponse<StockDisposal>>(
    `/stock-disposals/${uuid}`,
    payload
  );
  return response.data;
}

export async function completeStockDisposal(
  uuid: string
): Promise<ApiResponse<StockDisposal>> {
  const response = await axiosInstance.patch<ApiResponse<StockDisposal>>(
    `/stock-disposals/${uuid}/complete`
  );
  return response.data;
}

export async function cancelStockDisposal(
  uuid: string,
  payload: CancelStockDisposalPayload
): Promise<ApiResponse<StockDisposal>> {
  const response = await axiosInstance.patch<ApiResponse<StockDisposal>>(
    `/stock-disposals/${uuid}/cancel`,
    payload
  );
  return response.data;
}

export async function deleteStockDisposal(
  uuid: string
): Promise<ApiResponse<null>> {
  const response = await axiosInstance.delete<ApiResponse<null>>(
    `/stock-disposals/${uuid}`
  );
  if (response.status === 204 || !response.data) return EMPTY_204;
  return response.data;
}
