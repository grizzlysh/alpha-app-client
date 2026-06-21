import { axiosInstance } from "@/configs/axiosInstance";
import type { ApiResponse } from "@/types/api";
import type {
  LoginPayload,
  LoginResponse,
  MeResponse,
  SelectPharmacyPayload,
  SelectPharmacyResponse,
} from "@/types/auth";

export async function login(
  payload: LoginPayload
): Promise<ApiResponse<LoginResponse>> {
  const response = await axiosInstance.post<ApiResponse<LoginResponse>>(
    "/auth/login",
    payload
  );
  return response.data;
}

export async function selectPharmacy(
  payload: SelectPharmacyPayload
): Promise<ApiResponse<SelectPharmacyResponse>> {
  const response = await axiosInstance.post<ApiResponse<SelectPharmacyResponse>>(
    "/auth/select-pharmacy",
    payload
  );
  return response.data;
}

export async function getMe(): Promise<ApiResponse<MeResponse>> {
  const response = await axiosInstance.get<ApiResponse<MeResponse>>("/auth/me");
  return response.data;
}

export async function refreshAccessToken(): Promise<ApiResponse<{ accessToken: string }>> {
  const response = await axiosInstance.post<ApiResponse<{ accessToken: string }>>(
    "/auth/refresh"
  );
  return response.data;
}

export async function logoutUser(): Promise<ApiResponse<null>> {
  const response = await axiosInstance.post<ApiResponse<null>>("/auth/logout");
  return response.data;
}
