import { axiosInstance } from "@/configs/axiosInstance";
import type { ApiResponse } from "@/types/api";
import type {
  InventoryCabinetNode,
  InventoryBinItem,
  UpdateCabinetPositionPayload,
} from "@/types/inventory";

export async function getInventoryTree(): Promise<ApiResponse<InventoryCabinetNode[]>> {
  const res = await axiosInstance.get<ApiResponse<InventoryCabinetNode[]>>("/inventory/tree");
  return res.data;
}

export async function getBinItems(
  binUuid: string
): Promise<ApiResponse<InventoryBinItem[]>> {
  const res = await axiosInstance.get<ApiResponse<InventoryBinItem[]>>(
    `/inventory/bins/${binUuid}/items`
  );
  return res.data;
}

export async function updateCabinetPosition(
  cabinetUuid: string,
  payload: UpdateCabinetPositionPayload
): Promise<ApiResponse<null>> {
  const res = await axiosInstance.patch<ApiResponse<null>>(
    `/inventory/cabinets/${cabinetUuid}/position`,
    payload
  );
  if (res.status === 204 || !res.data) {
    return { success: true, data: null, message: { en: "", id: "" }, code: "", errors: null, meta: null };
  }
  return res.data;
}
