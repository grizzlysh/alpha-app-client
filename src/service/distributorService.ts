import { axiosInstance } from "@/configs/axiosInstance";
import type { ApiResponse } from "@/types/api";
import type {
  Distributor,
  DistributorDropdownItem,
  DistributorListParams,
  CreateDistributorPayload,
  UpdateDistributorPayload,
} from "@/types/distributor";

export async function getDistributors(
  params?: DistributorListParams
): Promise<ApiResponse<Distributor[]>> {
  const response = await axiosInstance.get<ApiResponse<Distributor[]>>(
    "/distributors",
    { params }
  );
  return response.data;
}

export async function createDistributor(
  payload: CreateDistributorPayload
): Promise<ApiResponse<Distributor>> {
  const response = await axiosInstance.post<ApiResponse<Distributor>>(
    "/distributors",
    payload
  );
  return response.data;
}

export async function updateDistributor(
  uuid: string,
  payload: UpdateDistributorPayload
): Promise<ApiResponse<Distributor>> {
  const response = await axiosInstance.put<ApiResponse<Distributor>>(
    `/distributors/${uuid}`,
    payload
  );
  return response.data;
}

export async function getDistributorsDropdown(): Promise<
  ApiResponse<DistributorDropdownItem[]>
> {
  const response = await axiosInstance.get<
    ApiResponse<DistributorDropdownItem[]>
  >("/distributors/dropdown");
  return response.data;
}

export async function deleteDistributor(
  uuid: string
): Promise<ApiResponse<null>> {
  const response = await axiosInstance.delete<ApiResponse<null>>(
    `/distributors/${uuid}`
  );
  // Handle 204 No Content (empty body) — treat as success
  if (response.status === 204 || !response.data) {
    return { success: true, code: "", data: null, message: { en: "", id: "" }, errors: null, meta: null };
  }
  return response.data;
}
