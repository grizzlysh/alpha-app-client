import { axiosInstance } from "@/configs/axiosInstance";
import type { ApiResponse } from "@/types/api";
import type { Parameter, ParameterListParams, UpdateParameterPayload } from "@/types/parameters";

export async function getSystemParameters(
  params?: ParameterListParams
): Promise<ApiResponse<Parameter[]>> {
  const response = await axiosInstance.get<ApiResponse<Parameter[]>>(
    "/system-parameters",
    { params }
  );
  return response.data;
}

export async function getSystemParameter(
  uuid: string
): Promise<ApiResponse<Parameter>> {
  const response = await axiosInstance.get<ApiResponse<Parameter>>(
    `/system-parameters/${uuid}`
  );
  return response.data;
}

export async function updateSystemParameter(
  uuid: string,
  payload: UpdateParameterPayload
): Promise<ApiResponse<Parameter>> {
  const response = await axiosInstance.put<ApiResponse<Parameter>>(
    `/system-parameters/${uuid}`,
    payload
  );
  return response.data;
}
