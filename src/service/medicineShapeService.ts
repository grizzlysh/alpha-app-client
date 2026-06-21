import { axiosInstance } from "@/configs/axiosInstance";
import type { ApiResponse } from "@/types/api";
import type { MedicineShape, MedicineDropdownItem, ReferenceListParams, ReferencePayload } from "@/types/medicine";

export async function getMedicineShapes(
  params?: ReferenceListParams
): Promise<ApiResponse<MedicineShape[]>> {
  const response = await axiosInstance.get<ApiResponse<MedicineShape[]>>(
    "/medicine-shapes",
    { params }
  );
  return response.data;
}

export async function createMedicineShape(
  payload: ReferencePayload
): Promise<ApiResponse<MedicineShape>> {
  const response = await axiosInstance.post<ApiResponse<MedicineShape>>(
    "/medicine-shapes",
    payload
  );
  return response.data;
}

export async function updateMedicineShape(
  uuid: string,
  payload: ReferencePayload
): Promise<ApiResponse<MedicineShape>> {
  const response = await axiosInstance.put<ApiResponse<MedicineShape>>(
    `/medicine-shapes/${uuid}`,
    payload
  );
  return response.data;
}

export async function deleteMedicineShape(
  uuid: string
): Promise<ApiResponse<null>> {
  const response = await axiosInstance.delete<ApiResponse<null>>(
    `/medicine-shapes/${uuid}`
  );
  if (response.status === 204 || !response.data) {
    return { success: true, data: null, message: { en: "", id: "" }, code: "", errors: null, meta: null };
  }
  return response.data;
}

export async function getMedicineShapesDropdown(
  search?: string
): Promise<ApiResponse<MedicineDropdownItem[]>> {
  const response = await axiosInstance.get<ApiResponse<MedicineDropdownItem[]>>(
    "/medicine-shapes/dropdown",
    { params: search ? { search } : undefined }
  );
  return response.data;
}
