import { axiosInstance } from "@/configs/axiosInstance";
import type { ApiResponse } from "@/types/api";
import type { AuditActionCount, AuditLog, AuditLogListParams } from "@/types/auditLog";

export async function getAuditLogs(params?: AuditLogListParams): Promise<ApiResponse<AuditLog[]>> {
  const response = await axiosInstance.get<ApiResponse<AuditLog[]>>("/audit-logs", { params });
  return response.data;
}

export async function getAuditActions(): Promise<ApiResponse<AuditActionCount[]>> {
  const response = await axiosInstance.get<ApiResponse<AuditActionCount[]>>("/audit-logs/actions");
  return response.data;
}
