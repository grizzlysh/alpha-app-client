import { axiosInstance } from "@/configs/axiosInstance";
import type { ApiResponse } from "@/types/api";
import type {
  Pharmacy,
  PharmacyDdlItem,
  PharmacyListParams,
  CreatePharmacyPayload,
  UpdatePharmacyPayload,
} from "@/types/pharmacy";

const EMPTY_204: ApiResponse<null> = {
  success: true,
  data: null,
  message: { en: "", id: "" },
  code: "",
  errors: null,
  meta: null,
};

export async function getPharmacies(
  params?: PharmacyListParams
): Promise<ApiResponse<Pharmacy[]>> {
  const response = await axiosInstance.get<ApiResponse<Pharmacy[]>>(
    "/pharmacies",
    { params }
  );
  return response.data;
}

export async function getPharmacy(
  uuid: string
): Promise<ApiResponse<Pharmacy>> {
  const response = await axiosInstance.get<ApiResponse<Pharmacy>>(
    `/pharmacies/${uuid}`
  );
  return response.data;
}

export async function createPharmacy(
  payload: CreatePharmacyPayload
): Promise<ApiResponse<Pharmacy>> {
  const response = await axiosInstance.post<ApiResponse<Pharmacy>>(
    "/pharmacies",
    payload
  );
  return response.data;
}

export async function updatePharmacy(
  uuid: string,
  payload: UpdatePharmacyPayload
): Promise<ApiResponse<Pharmacy>> {
  const response = await axiosInstance.put<ApiResponse<Pharmacy>>(
    `/pharmacies/${uuid}`,
    payload
  );
  return response.data;
}

export async function deletePharmacy(uuid: string): Promise<ApiResponse<null>> {
  const response = await axiosInstance.delete<ApiResponse<null>>(
    `/pharmacies/${uuid}`
  );
  if (response.status === 204 || !response.data) return EMPTY_204;
  return response.data;
}

export async function getPharmaciesDdl(): Promise<ApiResponse<PharmacyDdlItem[]>> {
  const response = await axiosInstance.get<ApiResponse<PharmacyDdlItem[]>>(
    "/pharmacies/dropdown"
  );
  return response.data;
}
