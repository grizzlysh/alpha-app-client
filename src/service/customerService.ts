import type { AllergyConflict } from "@/types/examination";
import { axiosInstance } from "@/configs/axiosInstance";
import type { ApiResponse } from "@/types/api";
import type {
  Customer,
  CustomerPurchaseHistory,
  CustomerDropdownItem,
  CustomerDropdownParams,
  CustomerListParams,
  CreateCustomerPayload,
  UpdateCustomerPayload,
} from "@/types/customer";

export async function getCustomers(
  params?: CustomerListParams
): Promise<ApiResponse<Customer[]>> {
  const response = await axiosInstance.get<ApiResponse<Customer[]>>(
    "/customers",
    { params }
  );
  return response.data;
}

export async function getCustomer(uuid: string): Promise<ApiResponse<Customer>> {
  const response = await axiosInstance.get<ApiResponse<Customer>>(
    `/customers/${uuid}`
  );
  return response.data;
}

export async function createCustomer(
  payload: CreateCustomerPayload
): Promise<ApiResponse<Customer>> {
  const response = await axiosInstance.post<ApiResponse<Customer>>(
    "/customers",
    payload
  );
  return response.data;
}

export async function updateCustomer(
  uuid: string,
  payload: UpdateCustomerPayload
): Promise<ApiResponse<Customer>> {
  const response = await axiosInstance.put<ApiResponse<Customer>>(
    `/customers/${uuid}`,
    payload
  );
  return response.data;
}

export async function deleteCustomer(uuid: string): Promise<ApiResponse<null>> {
  const response = await axiosInstance.delete<ApiResponse<null>>(
    `/customers/${uuid}`
  );
  if (response.status === 204 || !response.data) {
    return { success: true, code: "", data: null, message: { en: "", id: "" }, errors: null, meta: null };
  }
  return response.data;
}

export async function getCustomersDropdown(
  params?: CustomerDropdownParams
): Promise<ApiResponse<CustomerDropdownItem[]>> {
  const response = await axiosInstance.get<ApiResponse<CustomerDropdownItem[]>>(
    "/customers/dropdown",
    { params }
  );
  return response.data;
}

export async function getCustomerPurchases(
  uuid: string,
  params?: { page?: number; limit?: number }
): Promise<ApiResponse<CustomerPurchaseHistory>> {
  const response = await axiosInstance.get<ApiResponse<CustomerPurchaseHistory>>(`/customers/${uuid}/purchases`, { params });
  return response.data;
}

/** A cart line (medicine id) or a free-text prescription line (name). */
export interface AllergyCheckItem {
  medicineUuid?: string;
  medicineName?: string;
}

/** Medicines in this list that clash with the customer's recorded allergies (matched on name and ingredients). */
export async function checkCustomerAllergies(
  customerUuid: string,
  items: AllergyCheckItem[]
): Promise<ApiResponse<AllergyConflict[]>> {
  const response = await axiosInstance.post<ApiResponse<AllergyConflict[]>>(
    `/customers/${customerUuid}/allergy-check`,
    { items }
  );
  return response.data;
}
