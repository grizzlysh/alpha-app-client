import { axiosInstance } from "@/configs/axiosInstance";
import type { ApiResponse } from "@/types/api";
import type {
  Sale,
  SaleListParams,
  CreateSalePayload,
  UpdateSalePayload,
  CancelSalePayload,
  RefundSalePayload,
  SalePayment,
  AddSalePaymentPayload,
  UpdatePaymentHistoryPayload,
} from "@/types/sale";


export async function getSales(
  params?: SaleListParams
): Promise<ApiResponse<Sale[]>> {
  const response = await axiosInstance.get<ApiResponse<Sale[]>>("/sales", {
    params,
  });
  return response.data;
}

export async function getSale(uuid: string): Promise<ApiResponse<Sale>> {
  const response = await axiosInstance.get<ApiResponse<Sale>>(
    `/sales/${uuid}`
  );
  return response.data;
}

export interface SaleRequestOptions {
  /**
   * Same key for every retry of one checkout: if the first response is lost,
   * the server replays it instead of creating a second sale.
   */
  idempotencyKey?: string;
}

// Checkout runs one DB transaction for the whole cart; allow more than the 10s default.
const CHECKOUT_TIMEOUT_MS = 30000;

function saleRequestConfig(options?: SaleRequestOptions) {
  return {
    timeout: CHECKOUT_TIMEOUT_MS,
    headers: options?.idempotencyKey ? { "Idempotency-Key": options.idempotencyKey } : undefined,
  };
}

export async function createSale(
  payload: CreateSalePayload,
  options?: SaleRequestOptions
): Promise<ApiResponse<Sale>> {
  const response = await axiosInstance.post<ApiResponse<Sale>>(
    "/sales",
    payload,
    saleRequestConfig(options)
  );
  return response.data;
}

export async function updateSale(
  uuid: string,
  payload: UpdateSalePayload
): Promise<ApiResponse<Sale>> {
  const response = await axiosInstance.patch<ApiResponse<Sale>>(
    `/sales/${uuid}`,
    payload
  );
  return response.data;
}

export async function completeSale(
  uuid: string,
  payload?: CreateSalePayload,
  options?: SaleRequestOptions
): Promise<ApiResponse<Sale>> {
  const response = await axiosInstance.patch<ApiResponse<Sale>>(
    `/sales/${uuid}/complete`,
    payload,
    saleRequestConfig(options)
  );
  return response.data;
}

export async function cancelSale(
  uuid: string,
  payload: CancelSalePayload
): Promise<ApiResponse<Sale>> {
  const response = await axiosInstance.patch<ApiResponse<Sale>>(
    `/sales/${uuid}/cancel`,
    payload
  );
  return response.data;
}

export async function refundSale(
  uuid: string,
  payload: RefundSalePayload
): Promise<ApiResponse<Sale>> {
  const response = await axiosInstance.patch<ApiResponse<Sale>>(
    `/sales/${uuid}/refund`,
    payload
  );
  return response.data;
}

export async function getSalePayment(
  uuid: string
): Promise<ApiResponse<SalePayment>> {
  const response = await axiosInstance.get<ApiResponse<SalePayment>>(
    `/sales/${uuid}/payment`
  );
  return response.data;
}

export async function addSalePayment(
  uuid: string,
  payload: AddSalePaymentPayload
): Promise<ApiResponse<SalePayment>> {
  const response = await axiosInstance.post<ApiResponse<SalePayment>>(
    `/sales/${uuid}/payment`,
    payload
  );
  return response.data;
}

export async function updatePaymentHistory(
  uuid: string,
  historyUuid: string,
  payload: UpdatePaymentHistoryPayload
): Promise<ApiResponse<SalePayment>> {
  const response = await axiosInstance.patch<ApiResponse<SalePayment>>(
    `/sales/${uuid}/payment/history/${historyUuid}`,
    payload
  );
  return response.data;
}

export async function deletePaymentHistory(
  uuid: string,
  historyUuid: string
): Promise<ApiResponse<SalePayment>> {
  const response = await axiosInstance.delete<ApiResponse<SalePayment>>(
    `/sales/${uuid}/payment/history/${historyUuid}`
  );
  return response.data;
}
