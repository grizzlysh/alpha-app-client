import { axiosInstance } from "@/configs/axiosInstance";
import type { ApiResponse } from "@/types/api";
import type {
  Medicine,
  MedicineDropdownItem,
  MedicineListParams,
  CreateMedicinePayload,
  UpdateMedicinePayload,
} from "@/types/medicine";

export async function getMedicine(
  uuid: string
): Promise<ApiResponse<Medicine>> {
  const response = await axiosInstance.get<ApiResponse<Medicine>>(
    `/medicines/${uuid}`
  );
  return response.data;
}

export async function getMedicines(
  params?: MedicineListParams
): Promise<ApiResponse<Medicine[]>> {
  const response = await axiosInstance.get<ApiResponse<Medicine[]>>(
    "/medicines",
    { params }
  );
  return response.data;
}

export async function createMedicine(
  payload: CreateMedicinePayload
): Promise<ApiResponse<Medicine>> {
  const response = await axiosInstance.post<ApiResponse<Medicine>>(
    "/medicines",
    payload
  );
  return response.data;
}

export async function updateMedicine(
  uuid: string,
  payload: UpdateMedicinePayload
): Promise<ApiResponse<Medicine>> {
  const response = await axiosInstance.put<ApiResponse<Medicine>>(
    `/medicines/${uuid}`,
    payload
  );
  return response.data;
}

export async function getMedicinesDropdown(): Promise<
  ApiResponse<MedicineDropdownItem[]>
> {
  const response = await axiosInstance.get<ApiResponse<MedicineDropdownItem[]>>(
    "/medicines/dropdown"
  );
  return response.data;
}

export async function deleteMedicine(
  uuid: string
): Promise<ApiResponse<null>> {
  const response = await axiosInstance.delete<ApiResponse<null>>(
    `/medicines/${uuid}`
  );
  if (response.status === 204 || !response.data) {
    return { success: true, data: null, message: { en: "", id: "" }, code: "", errors: null, meta: null };
  }
  return response.data;
}
