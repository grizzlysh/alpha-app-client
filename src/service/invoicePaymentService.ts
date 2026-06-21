import { axiosInstance } from "@/configs/axiosInstance";
import type { ApiResponse } from "@/types/api";
import type {
  Invoice,
  InvoicePayment,
  AddPaymentPayload,
  UpdatePaymentHistoryPayload,
} from "@/types/invoice";

const BASE = (invoiceUuid: string) => `/invoices/${invoiceUuid}/payment`;

export async function getInvoicePayment(
  invoiceUuid: string
): Promise<ApiResponse<InvoicePayment>> {
  const response = await axiosInstance.get<ApiResponse<InvoicePayment>>(
    BASE(invoiceUuid)
  );
  return response.data;
}

export async function addInvoicePayment(
  invoiceUuid: string,
  payload: AddPaymentPayload
): Promise<ApiResponse<Invoice>> {
  const response = await axiosInstance.post<ApiResponse<Invoice>>(
    BASE(invoiceUuid),
    payload
  );
  return response.data;
}

export async function updatePaymentHistory(
  invoiceUuid: string,
  historyUuid: string,
  payload: UpdatePaymentHistoryPayload
): Promise<ApiResponse<InvoicePayment>> {
  const response = await axiosInstance.patch<ApiResponse<InvoicePayment>>(
    `${BASE(invoiceUuid)}/history/${historyUuid}`,
    payload
  );
  return response.data;
}

export async function deletePaymentHistory(
  invoiceUuid: string,
  historyUuid: string
): Promise<ApiResponse<InvoicePayment>> {
  const response = await axiosInstance.delete<ApiResponse<InvoicePayment>>(
    `${BASE(invoiceUuid)}/history/${historyUuid}`
  );
  return response.data;
}
