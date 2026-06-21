import { axiosInstance } from "@/configs/axiosInstance";
import type { ApiResponse } from "@/types/api";
import type {
  PurchaseOrder,
  PurchaseOrderPrintData,
  PurchaseOrderListParams,
  CreatePurchaseOrderPayload,
  UpdatePurchaseOrderPayload,
  CancelPurchaseOrderPayload,
  PurchaseOrderDropdownItem,
} from "@/types/purchaseOrder";

const EMPTY_204: ApiResponse<null> = {
  success: true,
  code: "",
  data: null,
  message: { en: "", id: "" },
  errors: null,
  meta: null,
};

export async function getPurchaseOrders(
  params?: PurchaseOrderListParams
): Promise<ApiResponse<PurchaseOrder[]>> {
  const response = await axiosInstance.get<ApiResponse<PurchaseOrder[]>>(
    "/purchase-orders",
    { params }
  );
  return response.data;
}

export async function getPurchaseOrder(
  uuid: string
): Promise<ApiResponse<PurchaseOrder>> {
  const response = await axiosInstance.get<ApiResponse<PurchaseOrder>>(
    `/purchase-orders/${uuid}`
  );
  return response.data;
}

export async function getPurchaseOrderPrint(
  uuid: string
): Promise<ApiResponse<PurchaseOrderPrintData>> {
  const response = await axiosInstance.get<ApiResponse<PurchaseOrderPrintData>>(
    `/purchase-orders/${uuid}/print`
  );
  return response.data;
}

export async function createPurchaseOrder(
  payload: CreatePurchaseOrderPayload
): Promise<ApiResponse<PurchaseOrder>> {
  const response = await axiosInstance.post<ApiResponse<PurchaseOrder>>(
    "/purchase-orders",
    payload
  );
  return response.data;
}

export async function updatePurchaseOrder(
  uuid: string,
  payload: UpdatePurchaseOrderPayload
): Promise<ApiResponse<PurchaseOrder>> {
  const response = await axiosInstance.put<ApiResponse<PurchaseOrder>>(
    `/purchase-orders/${uuid}`,
    payload
  );
  return response.data;
}

export async function submitPurchaseOrder(
  uuid: string
): Promise<ApiResponse<PurchaseOrder>> {
  const response = await axiosInstance.patch<ApiResponse<PurchaseOrder>>(
    `/purchase-orders/${uuid}/submit`
  );
  return response.data;
}

export async function completePurchaseOrder(
  uuid: string
): Promise<ApiResponse<PurchaseOrder>> {
  const response = await axiosInstance.patch<ApiResponse<PurchaseOrder>>(
    `/purchase-orders/${uuid}/complete`
  );
  return response.data;
}

export async function cancelPurchaseOrder(
  uuid: string,
  payload: CancelPurchaseOrderPayload
): Promise<ApiResponse<PurchaseOrder>> {
  const response = await axiosInstance.patch<ApiResponse<PurchaseOrder>>(
    `/purchase-orders/${uuid}/cancel`,
    payload
  );
  return response.data;
}

export async function deletePurchaseOrder(
  uuid: string
): Promise<ApiResponse<null>> {
  const response = await axiosInstance.delete<ApiResponse<null>>(
    `/purchase-orders/${uuid}`
  );
  if (response.status === 204 || !response.data) return EMPTY_204;
  return response.data;
}

export async function getPurchaseOrdersDropdown(): Promise<
  ApiResponse<PurchaseOrderDropdownItem[]>
> {
  const response = await axiosInstance.get<
    ApiResponse<PurchaseOrderDropdownItem[]>
  >("/purchase-orders/dropdown");
  return response.data;
}
