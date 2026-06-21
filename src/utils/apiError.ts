import type { AxiosError } from "axios";
import type { Language } from "@/configs/i18n";
import type { ApiResponse } from "@/types/api";

export function getApiErrorMessage(error: unknown, language: Language, fallback: string): string {
  const axiosErr = error as AxiosError<ApiResponse<unknown>>;
  const msg = axiosErr.response?.data?.message;
  return msg ? msg[language] : fallback;
}
