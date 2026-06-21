import { axiosInstance } from "@/configs/axiosInstance";
import type { ApiResponse } from "@/types/api";
import type { MeProfile, UpdateMePayload, ChangePasswordPayload } from "@/types/user";

const EMPTY_204: ApiResponse<null> = {
  success: true,
  data: null,
  message: { en: "", id: "" },
  code: "",
  errors: null,
  meta: null,
};

export async function getMe(): Promise<ApiResponse<MeProfile>> {
  const response = await axiosInstance.get<ApiResponse<MeProfile>>("/me");
  return response.data;
}

export async function updateMe(
  payload: UpdateMePayload
): Promise<ApiResponse<MeProfile>> {
  const response = await axiosInstance.put<ApiResponse<MeProfile>>(
    "/me",
    payload
  );
  return response.data;
}

export async function changePassword(
  payload: ChangePasswordPayload
): Promise<ApiResponse<null>> {
  const response = await axiosInstance.put<ApiResponse<null>>(
    "/me/password",
    payload
  );
  if (response.status === 204 || !response.data) return EMPTY_204;
  return response.data;
}
