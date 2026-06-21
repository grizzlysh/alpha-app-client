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

const EMPTY_204: ApiResponse<null> = {
  success: true,
  code: "",
  data: null,
  message: { en: "", id: "" },
  errors: null,
  meta: null,
};

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

export async function createSale(
  payload: CreateSalePayload
): Promise<ApiResponse<Sale>> {
  const response = await axiosInstance.post<ApiResponse<Sale>>(
    "/sales",
    payload
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
  payload?: CreateSalePayload
): Promise<ApiResponse<Sale>> {
  const response = await axiosInstance.patch<ApiResponse<Sale>>(
    `/sales/${uuid}/complete`,
    payload
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
): Promise<ApiResponse<null>> {
  const response = await axiosInstance.delete<ApiResponse<null>>(
    `/sales/${uuid}/payment/history/${historyUuid}`
  );
  if (response.status === 204 || !response.data) return EMPTY_204;
  return response.data;
}
