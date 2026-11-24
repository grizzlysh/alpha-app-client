import { axiosInstance } from "@/configs/axiosInstance";
import type { ApiResponse } from "@/types/api";
import type {
  CloseShiftPayload,
  CurrentShift,
  OpenShiftPayload,
  Shift,
  ShiftCashMovementPayload,
  ShiftDetail,
  ShiftListParams,
} from "@/types/shift";

export async function getCurrentShift(): Promise<ApiResponse<CurrentShift>> {
  const response = await axiosInstance.get<ApiResponse<CurrentShift>>("/shifts/current");
  return response.data;
}

export async function getShifts(params?: ShiftListParams): Promise<ApiResponse<Shift[]>> {
  const response = await axiosInstance.get<ApiResponse<Shift[]>>("/shifts", { params });
  return response.data;
}

export async function getShift(uuid: string): Promise<ApiResponse<ShiftDetail>> {
  const response = await axiosInstance.get<ApiResponse<ShiftDetail>>(`/shifts/${uuid}`);
  return response.data;
}

export async function openShift(payload: OpenShiftPayload): Promise<ApiResponse<Shift>> {
  const response = await axiosInstance.post<ApiResponse<Shift>>("/shifts", payload);
  return response.data;
}

export async function addShiftCashMovement(uuid: string, payload: ShiftCashMovementPayload): Promise<ApiResponse<ShiftDetail>> {
  const response = await axiosInstance.post<ApiResponse<ShiftDetail>>(`/shifts/${uuid}/cash-movements`, payload);
  return response.data;
}

export async function closeShift(uuid: string, payload: CloseShiftPayload): Promise<ApiResponse<ShiftDetail>> {
  const response = await axiosInstance.post<ApiResponse<ShiftDetail>>(`/shifts/${uuid}/close`, payload);
  return response.data;
}
