import { axiosInstance } from "@/configs/axiosInstance";
import type { ApiResponse } from "@/types/api";
import type { Parameter, ParameterListParams, UpdateParameterPayload } from "@/types/parameters";

export async function getBusinessParameters(
  params?: ParameterListParams
): Promise<ApiResponse<Parameter[]>> {
  const response = await axiosInstance.get<ApiResponse<Parameter[]>>(
    "/business-parameters",
    { params }
  );
  return response.data;
}

export async function getBusinessParameter(
  uuid: string
): Promise<ApiResponse<Parameter>> {
  const response = await axiosInstance.get<ApiResponse<Parameter>>(
    `/business-parameters/${uuid}`
  );
  return response.data;
}

export async function updateBusinessParameter(
  uuid: string,
  payload: UpdateParameterPayload
): Promise<ApiResponse<Parameter>> {
  const response = await axiosInstance.put<ApiResponse<Parameter>>(
    `/business-parameters/${uuid}`,
    payload
  );
  return response.data;
}
