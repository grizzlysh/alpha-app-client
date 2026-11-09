import { axiosInstance } from "@/configs/axiosInstance";
import type { ApiResponse } from "@/types/api";
import type {
  Patient,
  PatientDropdownItem,
  PatientDropdownParams,
  PatientListParams,
  CreatePatientPayload,
  UpdatePatientPayload,
} from "@/types/patient";

export async function getPatients(
  params?: PatientListParams
): Promise<ApiResponse<Patient[]>> {
  const response = await axiosInstance.get<ApiResponse<Patient[]>>(
    "/parties",
    { params }
  );
  return response.data;
}

export async function getPatient(uuid: string): Promise<ApiResponse<Patient>> {
  const response = await axiosInstance.get<ApiResponse<Patient>>(
    `/parties/${uuid}`
  );
  return response.data;
}

export async function createPatient(
  payload: CreatePatientPayload
): Promise<ApiResponse<Patient>> {
  const response = await axiosInstance.post<ApiResponse<Patient>>(
    "/parties",
    payload
  );
  return response.data;
}

export async function updatePatient(
  uuid: string,
  payload: UpdatePatientPayload
): Promise<ApiResponse<Patient>> {
  const response = await axiosInstance.put<ApiResponse<Patient>>(
    `/parties/${uuid}`,
    payload
  );
  return response.data;
}

export async function deletePatient(uuid: string): Promise<ApiResponse<null>> {
  const response = await axiosInstance.delete<ApiResponse<null>>(
    `/parties/${uuid}`
  );
  if (response.status === 204 || !response.data) {
    return { success: true, code: "", data: null, message: { en: "", id: "" }, errors: null, meta: null };
  }
  return response.data;
}

export async function getPatientsDropdown(
  params?: PatientDropdownParams
): Promise<ApiResponse<PatientDropdownItem[]>> {
  const response = await axiosInstance.get<ApiResponse<PatientDropdownItem[]>>(
    "/parties/dropdown",
    { params }
  );
  return response.data;
}
