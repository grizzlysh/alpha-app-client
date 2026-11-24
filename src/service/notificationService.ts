import { axiosInstance } from "@/configs/axiosInstance";
import type { ApiResponse } from "@/types/api";
import type { NotificationList } from "@/types/notification";

export async function getNotifications(): Promise<ApiResponse<NotificationList>> {
  const response = await axiosInstance.get<ApiResponse<NotificationList>>("/notifications");
  return response.data;
}

export async function markNotificationRead(uuid: string): Promise<ApiResponse<null>> {
  const response = await axiosInstance.post<ApiResponse<null>>(`/notifications/${uuid}/read`);
  return response.data;
}

export async function markAllNotificationsRead(): Promise<ApiResponse<{ marked: number }>> {
  const response = await axiosInstance.post<ApiResponse<{ marked: number }>>("/notifications/read-all");
  return response.data;
}
