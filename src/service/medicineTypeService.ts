import { axiosInstance } from "@/configs/axiosInstance";
import type { ApiResponse } from "@/types/api";
import type { MedicineType, MedicineTypeDropdownItem, ReferenceListParams, ReferencePayload } from "@/types/medicine";

export async function getMedicineTypes(
  params?: ReferenceListParams
): Promise<ApiResponse<MedicineType[]>> {
  const response = await axiosInstance.get<ApiResponse<MedicineType[]>>(
    "/medicine-types",
    { params }
  );
  return response.data;
}

export async function createMedicineType(
  payload: ReferencePayload
): Promise<ApiResponse<MedicineType>> {
  const response = await axiosInstance.post<ApiResponse<MedicineType>>(
    "/medicine-types",
    payload
  );
  return response.data;
}

export async function updateMedicineType(
  uuid: string,
  payload: ReferencePayload
): Promise<ApiResponse<MedicineType>> {
  const response = await axiosInstance.put<ApiResponse<MedicineType>>(
    `/medicine-types/${uuid}`,
    payload
  );
  return response.data;
}

export async function deleteMedicineType(
  uuid: string
): Promise<ApiResponse<null>> {
  const response = await axiosInstance.delete<ApiResponse<null>>(
    `/medicine-types/${uuid}`
  );
  if (response.status === 204 || !response.data) {
    return { success: true, data: null, message: { en: "", id: "" }, code: "", errors: null, meta: null };
  }
  return response.data;
}

export async function getMedicineTypesDropdown(
  search?: string
): Promise<ApiResponse<MedicineTypeDropdownItem[]>> {
  const response = await axiosInstance.get<ApiResponse<MedicineTypeDropdownItem[]>>(
    "/medicine-types/dropdown",
    { params: search ? { search } : undefined }
  );
  return response.data;
}
