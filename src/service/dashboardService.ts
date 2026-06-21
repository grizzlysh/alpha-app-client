import { axiosInstance } from "@/configs/axiosInstance";
import type { ApiResponse } from "@/types/api";
import type { DashboardResponse, AdvancedDashboardResponse } from "@/types/dashboard";

export async function getDashboard(): Promise<ApiResponse<DashboardResponse>> {
  const response = await axiosInstance.get<ApiResponse<DashboardResponse>>("/dashboard");
  return response.data;
}

export async function getAdvancedDashboard(
  days: 7 | 30
): Promise<ApiResponse<AdvancedDashboardResponse>> {
  const response = await axiosInstance.get<ApiResponse<AdvancedDashboardResponse>>(
    "/dashboard/advanced",
    { params: { days } }
  );
  return response.data;
}
