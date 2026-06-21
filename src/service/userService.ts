import { axiosInstance } from "@/configs/axiosInstance";
import type { ApiResponse } from "@/types/api";
import type {
  UserListItem,
  UserDetail,
  UserListParams,
  PlacementItem,
  PlacementGroup,
  PlacementListParams,
  LicenseItem,
  LicenseListParams,
  CreateUserPayload,
  UpdateUserPayload,
  CreatePlacementPayload,
  UpdatePlacementPayload,
  CreateLicensePayload,
  UpdateLicensePayload,
} from "@/types/user";

const EMPTY_204: ApiResponse<null> = {
  success: true,
  data: null,
  message: { en: "", id: "" },
  code: "",
  errors: null,
  meta: null,
};

export async function getUsers(
  params?: UserListParams
): Promise<ApiResponse<UserListItem[]>> {
  const response = await axiosInstance.get<ApiResponse<UserListItem[]>>(
    "/users",
    { params }
  );
  return response.data;
}

export async function getUser(uuid: string): Promise<ApiResponse<UserDetail>> {
  const response = await axiosInstance.get<ApiResponse<UserDetail>>(
    `/users/${uuid}`
  );
  return response.data;
}

export async function createUser(
  payload: CreateUserPayload
): Promise<ApiResponse<UserDetail>> {
  const response = await axiosInstance.post<ApiResponse<UserDetail>>(
    "/users",
    payload
  );
  return response.data;
}

export async function updateUser(
  uuid: string,
  payload: UpdateUserPayload
): Promise<ApiResponse<UserDetail>> {
  const response = await axiosInstance.put<ApiResponse<UserDetail>>(
    `/users/${uuid}`,
    payload
  );
  return response.data;
}

export async function deleteUser(uuid: string): Promise<ApiResponse<null>> {
  const response = await axiosInstance.delete<ApiResponse<null>>(
    `/users/${uuid}`
  );
  if (response.status === 204 || !response.data) return EMPTY_204;
  return response.data;
}

export async function resetUserPassword(
  uuid: string
): Promise<ApiResponse<null>> {
  const response = await axiosInstance.post<ApiResponse<null>>(
    `/users/${uuid}/reset-password`
  );
  if (response.status === 204 || !response.data) return EMPTY_204;
  return response.data;
}

export async function getUserPlacements(
  userUuid: string,
  params?: PlacementListParams
): Promise<ApiResponse<PlacementGroup[]>> {
  const response = await axiosInstance.get<ApiResponse<PlacementGroup[]>>(
    `/users/${userUuid}/placements`,
    { params }
  );
  return response.data;
}

export async function createPlacement(
  userUuid: string,
  payload: CreatePlacementPayload
): Promise<ApiResponse<PlacementItem>> {
  const response = await axiosInstance.post<ApiResponse<PlacementItem>>(
    `/users/${userUuid}/placements`,
    payload
  );
  return response.data;
}

export async function updatePlacement(
  userUuid: string,
  placementUuid: string,
  payload: UpdatePlacementPayload
): Promise<ApiResponse<PlacementItem>> {
  const response = await axiosInstance.put<ApiResponse<PlacementItem>>(
    `/users/${userUuid}/placements/${placementUuid}`,
    payload
  );
  return response.data;
}

export async function deletePlacement(
  userUuid: string,
  placementUuid: string
): Promise<ApiResponse<null>> {
  const response = await axiosInstance.delete<ApiResponse<null>>(
    `/users/${userUuid}/placements/${placementUuid}`
  );
  if (response.status === 204 || !response.data) return EMPTY_204;
  return response.data;
}

export async function getLicenses(
  userUuid: string,
  placementUuid: string,
  params?: LicenseListParams
): Promise<ApiResponse<LicenseItem[]>> {
  const response = await axiosInstance.get<ApiResponse<LicenseItem[]>>(
    `/users/${userUuid}/placements/${placementUuid}/practice-licenses`,
    { params }
  );
  return response.data;
}

export async function addLicense(
  userUuid: string,
  placementUuid: string,
  payload: CreateLicensePayload
): Promise<ApiResponse<LicenseItem>> {
  const response = await axiosInstance.post<ApiResponse<LicenseItem>>(
    `/users/${userUuid}/placements/${placementUuid}/practice-licenses`,
    payload
  );
  return response.data;
}

export async function updateLicense(
  userUuid: string,
  placementUuid: string,
  licenseUuid: string,
  payload: UpdateLicensePayload
): Promise<ApiResponse<LicenseItem>> {
  const response = await axiosInstance.put<ApiResponse<LicenseItem>>(
    `/users/${userUuid}/placements/${placementUuid}/practice-licenses/${licenseUuid}`,
    payload
  );
  return response.data;
}

export async function deleteLicense(
  userUuid: string,
  placementUuid: string,
  licenseUuid: string
): Promise<ApiResponse<null>> {
  const response = await axiosInstance.delete<ApiResponse<null>>(
    `/users/${userUuid}/placements/${placementUuid}/practice-licenses/${licenseUuid}`
  );
  if (response.status === 204 || !response.data) return EMPTY_204;
  return response.data;
}
