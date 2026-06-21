import { axiosInstance } from "@/configs/axiosInstance";
import type { ApiResponse } from "@/types/api";
import type { MedicineClass, MedicineDropdownItem, ReferenceListParams, ReferencePayload } from "@/types/medicine";

export async function getMedicineClasses(
  params?: ReferenceListParams
): Promise<ApiResponse<MedicineClass[]>> {
  const response = await axiosInstance.get<ApiResponse<MedicineClass[]>>(
    "/medicine-classes",
    { params }
  );
  return response.data;
}

export async function createMedicineClass(
  payload: ReferencePayload
): Promise<ApiResponse<MedicineClass>> {
  const response = await axiosInstance.post<ApiResponse<MedicineClass>>(
    "/medicine-classes",
    payload
  );
  return response.data;
}

export async function updateMedicineClass(
  uuid: string,
  payload: ReferencePayload
): Promise<ApiResponse<MedicineClass>> {
  const response = await axiosInstance.put<ApiResponse<MedicineClass>>(
    `/medicine-classes/${uuid}`,
    payload
  );
  return response.data;
}

export async function deleteMedicineClass(
  uuid: string
): Promise<ApiResponse<null>> {
  const response = await axiosInstance.delete<ApiResponse<null>>(
    `/medicine-classes/${uuid}`
  );
  if (response.status === 204 || !response.data) {
    return { success: true, data: null, message: { en: "", id: "" }, code: "", errors: null, meta: null };
  }
  return response.data;
}

export async function getMedicineClassesDropdown(
  search?: string
): Promise<ApiResponse<MedicineDropdownItem[]>> {
  const response = await axiosInstance.get<ApiResponse<MedicineDropdownItem[]>>(
    "/medicine-classes/dropdown",
    { params: search ? { search } : undefined }
  );
  return response.data;
}
