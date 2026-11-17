import { axiosInstance } from "@/configs/axiosInstance";
import type { ApiResponse } from "@/types/api";
import type { CatalogExport, CatalogImportPayload, CatalogImportResult } from "@/types/catalog";

/** The selected pharmacy's medicines and classifications, for copying to another branch. */
export async function exportCatalog(): Promise<ApiResponse<CatalogExport>> {
  const response = await axiosInstance.get<ApiResponse<CatalogExport>>("/catalog/export");
  return response.data;
}

/** Adds what the pharmacy doesn't have yet (matched by name). `dryRun` only counts. */
export async function importCatalog(payload: CatalogImportPayload): Promise<ApiResponse<CatalogImportResult>> {
  const response = await axiosInstance.post<ApiResponse<CatalogImportResult>>("/catalog/import", payload, {
    timeout: 120_000,
  });
  return response.data;
}
