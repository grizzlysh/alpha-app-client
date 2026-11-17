import { axiosInstance } from "@/configs/axiosInstance";
import type { ApiResponse } from "@/types/api";
import type { CustomerRow, DistributorRow, ImportResult, ImportRow } from "@/types/dataTransfer";

const LONG = { timeout: 120_000 };

export async function exportDistributors(): Promise<ApiResponse<DistributorRow[]>> {
  return (await axiosInstance.get<ApiResponse<DistributorRow[]>>("/data-transfer/distributors")).data;
}

export async function importDistributors(rows: ImportRow[], dryRun: boolean): Promise<ApiResponse<ImportResult>> {
  return (await axiosInstance.post<ApiResponse<ImportResult>>("/data-transfer/distributors", { rows, dryRun }, LONG)).data;
}

export async function exportCustomers(): Promise<ApiResponse<CustomerRow[]>> {
  return (await axiosInstance.get<ApiResponse<CustomerRow[]>>("/data-transfer/customers")).data;
}

export async function importCustomers(rows: ImportRow[], dryRun: boolean): Promise<ApiResponse<ImportResult>> {
  return (await axiosInstance.post<ApiResponse<ImportResult>>("/data-transfer/customers", { rows, dryRun }, LONG)).data;
}

export async function importOpeningStock(
  rows: ImportRow[],
  dryRun: boolean,
  opts: { signedByUuid: string; defaultDistributorUuid?: string }
): Promise<ApiResponse<ImportResult>> {
  return (
    await axiosInstance.post<ApiResponse<ImportResult>>("/data-transfer/opening-stock", { rows, dryRun, ...opts }, LONG)
  ).data;
}
