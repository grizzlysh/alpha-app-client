import { axiosInstance } from "@/configs/axiosInstance";
import type { ApiResponse } from "@/types/api";
import type { Permission, PermissionGroup, PermissionListParams } from "@/types/role";

export async function getPermissions(
  params?: PermissionListParams
): Promise<ApiResponse<PermissionGroup[]>> {
  const response = await axiosInstance.get<ApiResponse<PermissionGroup[]>>(
    "/permissions",
    { params }
  );
  return response.data;
}

export async function getPermission(
  uuid: string
): Promise<ApiResponse<Permission>> {
  const response = await axiosInstance.get<ApiResponse<Permission>>(
    `/permissions/${uuid}`
  );
  return response.data;
}
