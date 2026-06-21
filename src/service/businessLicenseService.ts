import { axiosInstance } from "@/configs/axiosInstance";
import type { ApiResponse } from "@/types/api";
import type {
  BusinessLicense,
  BusinessLicenseListParams,
  CreateBusinessLicensePayload,
  UpdateBusinessLicensePayload,
} from "@/types/businessLicense";

const EMPTY_204: ApiResponse<null> = {
  success: true,
  data: null,
  message: { en: "", id: "" },
  code: "",
  errors: null,
  meta: null,
};

export async function getBusinessLicenses(
  pharmacyUuid: string,
  params?: Omit<BusinessLicenseListParams, "pharmacyUuid">
): Promise<ApiResponse<BusinessLicense[]>> {
  const response = await axiosInstance.get<ApiResponse<BusinessLicense[]>>(
    `/pharmacies/${pharmacyUuid}/business-licenses`,
    { params }
  );
  return response.data;
}

export async function getBusinessLicense(
  pharmacyUuid: string,
  uuid: string
): Promise<ApiResponse<BusinessLicense>> {
  const response = await axiosInstance.get<ApiResponse<BusinessLicense>>(
    `/pharmacies/${pharmacyUuid}/business-licenses/${uuid}`
  );
  return response.data;
}

export async function createBusinessLicense(
  payload: CreateBusinessLicensePayload
): Promise<ApiResponse<BusinessLicense>> {
  const { pharmacyUuid, ...body } = payload;
  const response = await axiosInstance.post<ApiResponse<BusinessLicense>>(
    `/pharmacies/${pharmacyUuid}/business-licenses`,
    body
  );
  return response.data;
}

export async function updateBusinessLicense(
  pharmacyUuid: string,
  uuid: string,
  payload: UpdateBusinessLicensePayload
): Promise<ApiResponse<BusinessLicense>> {
  const response = await axiosInstance.put<ApiResponse<BusinessLicense>>(
    `/pharmacies/${pharmacyUuid}/business-licenses/${uuid}`,
    payload
  );
  return response.data;
}

export async function deleteBusinessLicense(
  pharmacyUuid: string,
  uuid: string
): Promise<ApiResponse<null>> {
  const response = await axiosInstance.delete<ApiResponse<null>>(
    `/pharmacies/${pharmacyUuid}/business-licenses/${uuid}`
  );
  if (response.status === 204 || !response.data) return EMPTY_204;
  return response.data;
}
