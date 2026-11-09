import { axiosInstance } from "@/configs/axiosInstance";
import type { ApiResponse } from "@/types/api";
import type {
  MedicalRecord,
  MedicalVisit,
  UpdateMedicalRecordPayload,
  CreateAllergyPayload,
  UpdateAllergyPayload,
  Allergy,
  CreateVisitPayload,
  UpdateVisitPayload,
  VisitListParams,
} from "@/types/medicalRecord";

export async function getMedicalRecord(
  customerUuid: string
): Promise<ApiResponse<MedicalRecord>> {
  const response = await axiosInstance.get<ApiResponse<MedicalRecord>>(
    `/medical-records/${customerUuid}`
  );
  return response.data;
}

export async function updateMedicalRecord(
  customerUuid: string,
  payload: UpdateMedicalRecordPayload
): Promise<ApiResponse<MedicalRecord>> {
  const response = await axiosInstance.put<ApiResponse<MedicalRecord>>(
    `/medical-records/${customerUuid}`,
    payload
  );
  return response.data;
}

export async function addAllergy(
  customerUuid: string,
  payload: CreateAllergyPayload
): Promise<ApiResponse<Allergy>> {
  const response = await axiosInstance.post<ApiResponse<Allergy>>(
    `/medical-records/${customerUuid}/allergies`,
    payload
  );
  return response.data;
}

export async function updateAllergy(
  customerUuid: string,
  allergyUuid: string,
  payload: UpdateAllergyPayload
): Promise<ApiResponse<Allergy>> {
  const response = await axiosInstance.put<ApiResponse<Allergy>>(
    `/medical-records/${customerUuid}/allergies/${allergyUuid}`,
    payload
  );
  return response.data;
}

export async function removeAllergy(
  customerUuid: string,
  allergyUuid: string
): Promise<ApiResponse<null>> {
  const response = await axiosInstance.delete<ApiResponse<null>>(
    `/medical-records/${customerUuid}/allergies/${allergyUuid}`
  );
  if (response.status === 204 || !response.data) {
    return { success: true, code: "", data: null, message: { en: "", id: "" }, errors: null, meta: null };
  }
  return response.data;
}

export async function getVisits(
  customerUuid: string,
  params?: VisitListParams
): Promise<ApiResponse<MedicalVisit[]>> {
  const response = await axiosInstance.get<ApiResponse<MedicalVisit[]>>(
    `/medical-records/${customerUuid}/visits`,
    { params }
  );
  return response.data;
}

export async function createVisit(
  customerUuid: string,
  payload: CreateVisitPayload
): Promise<ApiResponse<MedicalVisit>> {
  const response = await axiosInstance.post<ApiResponse<MedicalVisit>>(
    `/medical-records/${customerUuid}/visits`,
    payload
  );
  return response.data;
}

export async function updateVisit(
  customerUuid: string,
  visitUuid: string,
  payload: UpdateVisitPayload
): Promise<ApiResponse<MedicalVisit>> {
  const response = await axiosInstance.put<ApiResponse<MedicalVisit>>(
    `/medical-records/${customerUuid}/visits/${visitUuid}`,
    payload
  );
  return response.data;
}

export async function deleteVisit(
  customerUuid: string,
  visitUuid: string
): Promise<ApiResponse<null>> {
  const response = await axiosInstance.delete<ApiResponse<null>>(
    `/medical-records/${customerUuid}/visits/${visitUuid}`
  );
  if (response.status === 204 || !response.data) {
    return { success: true, code: "", data: null, message: { en: "", id: "" }, errors: null, meta: null };
  }
  return response.data;
}
