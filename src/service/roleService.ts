import { axiosInstance } from "@/configs/axiosInstance";
import type { ApiResponse } from "@/types/api";
import type {
  Role,
  RoleDdlItem,
  RoleDetail,
  RoleListParams,
  CreateRolePayload,
  UpdateRolePayload,
  SetRolePermissionsPayload,
} from "@/types/role";

export async function getRoles(
  params?: RoleListParams
): Promise<ApiResponse<Role[]>> {
  const response = await axiosInstance.get<ApiResponse<Role[]>>("/roles", {
    params,
  });
  return response.data;
}

export async function getRole(uuid: string): Promise<ApiResponse<RoleDetail>> {
  const response = await axiosInstance.get<ApiResponse<RoleDetail>>(
    `/roles/${uuid}`
  );
  return response.data;
}

export async function createRole(
  payload: CreateRolePayload
): Promise<ApiResponse<Role>> {
  const response = await axiosInstance.post<ApiResponse<Role>>(
    "/roles",
    payload
  );
  return response.data;
}

export async function updateRole(
  uuid: string,
  payload: UpdateRolePayload
): Promise<ApiResponse<Role>> {
  const response = await axiosInstance.put<ApiResponse<Role>>(
    `/roles/${uuid}`,
    payload
  );
  return response.data;
}

export async function setRolePermissions(
  uuid: string,
  payload: SetRolePermissionsPayload
): Promise<ApiResponse<RoleDetail>> {
  const response = await axiosInstance.put<ApiResponse<RoleDetail>>(
    `/roles/${uuid}/permissions`,
    payload
  );
  return response.data;
}

export async function deleteRole(uuid: string): Promise<ApiResponse<null>> {
  const response = await axiosInstance.delete<ApiResponse<null>>(
    `/roles/${uuid}`
  );
  if (response.status === 204 || !response.data) {
    return {
      success: true,
      data: null,
      message: { en: "", id: "" },
      code: "",
      errors: null,
      meta: null,
    };
  }
  return response.data;
}

export async function getRolesDdl(
  pharmacyUuid?: string
): Promise<ApiResponse<RoleDdlItem[]>> {
  const response = await axiosInstance.get<ApiResponse<RoleDdlItem[]>>(
    "/roles/dropdown",
    { params: pharmacyUuid ? { pharmacyUuid } : undefined }
  );
  return response.data;
}
