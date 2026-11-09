import { axiosInstance } from "@/configs/axiosInstance";
import type { ApiResponse } from "@/types/api";
import type {
  Prescription,
  PrescriptionListItem,
  AvailablePrescriptionItem,
  PrescriptionListParams,
  CreatePrescriptionPayload,
  UpdatePrescriptionPayload,
  DispensePrescriptionPayload,
} from "@/types/prescription";

export async function getPrescriptions(
  params?: PrescriptionListParams
): Promise<ApiResponse<PrescriptionListItem[]>> {
  const response = await axiosInstance.get<ApiResponse<PrescriptionListItem[]>>(
    "/prescriptions",
    { params }
  );
  return response.data;
}

export async function getPrescriptionsQueue(): Promise<
  ApiResponse<PrescriptionListItem[]>
> {
  const response = await axiosInstance.get<ApiResponse<PrescriptionListItem[]>>(
    "/prescriptions/queue"
  );
  return response.data;
}

export async function getAvailablePrescriptions(params?: {
  customerUuid?: string;
}): Promise<ApiResponse<AvailablePrescriptionItem[]>> {
  const response = await axiosInstance.get<ApiResponse<AvailablePrescriptionItem[]>>(
    "/prescriptions/available",
    { params: params ?? undefined }
  );
  return response.data;
}

export async function getPrescription(
  uuid: string
): Promise<ApiResponse<Prescription>> {
  const response = await axiosInstance.get<ApiResponse<Prescription>>(
    `/prescriptions/${uuid}`
  );
  return response.data;
}

export async function createPrescription(
  payload: CreatePrescriptionPayload
): Promise<ApiResponse<Prescription>> {
  const response = await axiosInstance.post<ApiResponse<Prescription>>(
    "/prescriptions",
    payload
  );
  return response.data;
}

export async function updatePrescription(
  uuid: string,
  payload: UpdatePrescriptionPayload
): Promise<ApiResponse<Prescription>> {
  const response = await axiosInstance.put<ApiResponse<Prescription>>(
    `/prescriptions/${uuid}`,
    payload
  );
  return response.data;
}

export async function deletePrescription(
  uuid: string
): Promise<ApiResponse<null>> {
  const response = await axiosInstance.delete<ApiResponse<null>>(
    `/prescriptions/${uuid}`
  );
  if (response.status === 204 || !response.data) {
    return {
      success: true,
      code: "",
      data: null,
      message: { en: "", id: "" },
      errors: null,
      meta: null,
    };
  }
  return response.data;
}

export async function dispensePrescription(
  uuid: string,
  payload: DispensePrescriptionPayload
): Promise<ApiResponse<Prescription>> {
  const response = await axiosInstance.post<ApiResponse<Prescription>>(
    `/prescriptions/${uuid}/dispense`,
    payload
  );
  return response.data;
}

export async function cancelPrescription(
  uuid: string
): Promise<ApiResponse<Prescription>> {
  const response = await axiosInstance.post<ApiResponse<Prescription>>(
    `/prescriptions/${uuid}/cancel`
  );
  return response.data;
}
