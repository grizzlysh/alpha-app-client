import { axiosInstance } from "@/configs/axiosInstance";
import type { ApiResponse } from "@/types/api";
import type {
  Doctor,
  DoctorDropdownItem,
  DoctorListParams,
  CreateDoctorPayload,
  UpdateDoctorPayload,
} from "@/types/doctor";

export async function getDoctors(
  params?: DoctorListParams
): Promise<ApiResponse<Doctor[]>> {
  const response = await axiosInstance.get<ApiResponse<Doctor[]>>("/doctors", {
    params,
  });
  return response.data;
}

export async function getDoctor(uuid: string): Promise<ApiResponse<Doctor>> {
  const response = await axiosInstance.get<ApiResponse<Doctor>>(
    `/doctors/${uuid}`
  );
  return response.data;
}

export async function createDoctor(
  payload: CreateDoctorPayload
): Promise<ApiResponse<Doctor>> {
  const response = await axiosInstance.post<ApiResponse<Doctor>>(
    "/doctors",
    payload
  );
  return response.data;
}

export async function updateDoctor(
  uuid: string,
  payload: UpdateDoctorPayload
): Promise<ApiResponse<Doctor>> {
  const response = await axiosInstance.put<ApiResponse<Doctor>>(
    `/doctors/${uuid}`,
    payload
  );
  return response.data;
}

export async function deleteDoctor(uuid: string): Promise<ApiResponse<null>> {
  const response = await axiosInstance.delete<ApiResponse<null>>(
    `/doctors/${uuid}`
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

export async function getDoctorsDropdown(
  search?: string
): Promise<ApiResponse<DoctorDropdownItem[]>> {
  const response = await axiosInstance.get<ApiResponse<DoctorDropdownItem[]>>(
    "/doctors/dropdown",
    { params: search ? { search } : undefined }
  );
  return response.data;
}
