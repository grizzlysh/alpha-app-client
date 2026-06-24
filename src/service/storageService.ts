import { axiosInstance } from "@/configs/axiosInstance";
import type { ApiResponse } from "@/types/api";
import type {
  StorageCabinet,
  StorageCabinetDropdownItem,
  StorageShelf,
  StorageShelfDropdownItem,
  StorageBin,
  StorageBinDropdownItem,
  CabinetListParams,
  ShelfListParams,
  BinListParams,
  CreateCabinetPayload,
  UpdateCabinetPayload,
  CreateShelfPayload,
  UpdateShelfPayload,
  CreateBinPayload,
  UpdateBinPayload,
} from "@/types/storage";

const EMPTY_204: ApiResponse<null> = {
  success: true,
  data: null,
  message: { en: "", id: "" },
  code: "",
  errors: null,
  meta: null,
};

// ── Cabinets ──────────────────────────────────────────────────────────────────

export async function getCabinets(
  params?: CabinetListParams
): Promise<ApiResponse<StorageCabinet[]>> {
  const res = await axiosInstance.get<ApiResponse<StorageCabinet[]>>(
    "/storage/cabinets",
    { params }
  );
  return res.data;
}

export async function getCabinetsDropdown(): Promise<
  ApiResponse<StorageCabinetDropdownItem[]>
> {
  const res = await axiosInstance.get<ApiResponse<StorageCabinetDropdownItem[]>>(
    "/storage/cabinets/dropdown"
  );
  return res.data;
}

export async function getCabinet(
  cabinetUuid: string
): Promise<ApiResponse<StorageCabinet>> {
  const res = await axiosInstance.get<ApiResponse<StorageCabinet>>(
    `/storage/cabinets/${cabinetUuid}`
  );
  return res.data;
}

export async function createCabinet(
  payload: CreateCabinetPayload
): Promise<ApiResponse<StorageCabinet>> {
  const res = await axiosInstance.post<ApiResponse<StorageCabinet>>(
    "/storage/cabinets",
    payload
  );
  return res.data;
}

export async function updateCabinet(
  cabinetUuid: string,
  payload: UpdateCabinetPayload
): Promise<ApiResponse<StorageCabinet>> {
  const res = await axiosInstance.put<ApiResponse<StorageCabinet>>(
    `/storage/cabinets/${cabinetUuid}`,
    payload
  );
  return res.data;
}

export async function deleteCabinet(
  cabinetUuid: string
): Promise<ApiResponse<null>> {
  const res = await axiosInstance.delete<ApiResponse<null>>(
    `/storage/cabinets/${cabinetUuid}`
  );
  if (res.status === 204 || !res.data) return EMPTY_204;
  return res.data;
}

// ── Shelves ───────────────────────────────────────────────────────────────────

export async function getShelves(
  cabinetUuid: string,
  params?: ShelfListParams
): Promise<ApiResponse<StorageShelf[]>> {
  const res = await axiosInstance.get<ApiResponse<StorageShelf[]>>(
    `/storage/cabinets/${cabinetUuid}/shelves`,
    { params }
  );
  return res.data;
}

export async function getShelvesDropdown(
  cabinetUuid: string
): Promise<ApiResponse<StorageShelfDropdownItem[]>> {
  const res = await axiosInstance.get<ApiResponse<StorageShelfDropdownItem[]>>(
    `/storage/cabinets/${cabinetUuid}/shelves/dropdown`
  );
  return res.data;
}

export async function getShelf(
  shelfUuid: string
): Promise<ApiResponse<StorageShelf>> {
  const res = await axiosInstance.get<ApiResponse<StorageShelf>>(
    `/storage/shelves/${shelfUuid}`
  );
  return res.data;
}

export async function createShelf(
  cabinetUuid: string,
  payload: CreateShelfPayload
): Promise<ApiResponse<StorageShelf>> {
  const res = await axiosInstance.post<ApiResponse<StorageShelf>>(
    `/storage/cabinets/${cabinetUuid}/shelves`,
    payload
  );
  return res.data;
}

export async function updateShelf(
  shelfUuid: string,
  payload: UpdateShelfPayload
): Promise<ApiResponse<StorageShelf>> {
  const res = await axiosInstance.put<ApiResponse<StorageShelf>>(
    `/storage/shelves/${shelfUuid}`,
    payload
  );
  return res.data;
}

export async function deleteShelf(
  shelfUuid: string
): Promise<ApiResponse<null>> {
  const res = await axiosInstance.delete<ApiResponse<null>>(
    `/storage/shelves/${shelfUuid}`
  );
  if (res.status === 204 || !res.data) return EMPTY_204;
  return res.data;
}

// ── Bins ──────────────────────────────────────────────────────────────────────

export async function getBins(
  cabinetUuid: string,
  shelfUuid: string,
  params?: BinListParams
): Promise<ApiResponse<StorageBin[]>> {
  const res = await axiosInstance.get<ApiResponse<StorageBin[]>>(
    `/storage/cabinets/${cabinetUuid}/shelves/${shelfUuid}/bins`,
    { params }
  );
  return res.data;
}

export async function getBinsDropdown(
  cabinetUuid: string,
  shelfUuid: string
): Promise<ApiResponse<StorageBinDropdownItem[]>> {
  const res = await axiosInstance.get<ApiResponse<StorageBinDropdownItem[]>>(
    `/storage/cabinets/${cabinetUuid}/shelves/${shelfUuid}/bins/dropdown`
  );
  return res.data;
}

export async function getBin(
  binUuid: string
): Promise<ApiResponse<StorageBin>> {
  const res = await axiosInstance.get<ApiResponse<StorageBin>>(
    `/storage/cabinets/shelves/bins/${binUuid}`
  );
  return res.data;
}

export async function createBin(
  cabinetUuid: string,
  shelfUuid: string,
  payload: CreateBinPayload
): Promise<ApiResponse<StorageBin>> {
  const res = await axiosInstance.post<ApiResponse<StorageBin>>(
    `/storage/cabinets/${cabinetUuid}/shelves/${shelfUuid}/bins`,
    payload
  );
  return res.data;
}

export async function updateBin(
  cabinetUuid: string,
  shelfUuid: string,
  binUuid: string,
  payload: UpdateBinPayload
): Promise<ApiResponse<StorageBin>> {
  const res = await axiosInstance.put<ApiResponse<StorageBin>>(
    `/storage/cabinets/${cabinetUuid}/shelves/${shelfUuid}/bins/${binUuid}`,
    payload
  );
  return res.data;
}

export async function deleteBin(
  cabinetUuid: string,
  shelfUuid: string,
  binUuid: string
): Promise<ApiResponse<null>> {
  const res = await axiosInstance.delete<ApiResponse<null>>(
    `/storage/cabinets/${cabinetUuid}/shelves/${shelfUuid}/bins/${binUuid}`
  );
  if (res.status === 204 || !res.data) return EMPTY_204;
  return res.data;
}
