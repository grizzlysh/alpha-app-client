import { isAxiosError } from "axios";
import type { Language } from "@/configs/i18n";
import { translations } from "@/configs/i18n";
import type { ApiResponse } from "@/types/api";

/**
 * Turns any thrown value into a message a pharmacy user can act on.
 *
 * Order of preference:
 *  1. The server's own bilingual message (our API always sends one).
 *  2. A specific explanation for transport failures — offline, timeout, server
 *     unreachable, or a response that isn't from our API (wrong base URL / proxy).
 *  3. The caller's fallback, only for errors we genuinely can't classify.
 */
export function getApiErrorMessage(error: unknown, language: Language, fallback: string): string {
  const t = translations[language];

  if (isAxiosError<ApiResponse<unknown>>(error)) {
    const response = error.response;
    const msg = response?.data?.message;
    if (msg && typeof msg === "object" && typeof msg[language] === "string") return msg[language];

    if (!response) {
      if (error.code === "ECONNABORTED" || error.code === "ETIMEDOUT") return t.errTimeout;
      if (typeof navigator !== "undefined" && navigator.onLine === false) return t.errOffline;
      return t.errNetwork;
    }

    const status = String(response.status);
    // A response without our envelope means something other than our API answered
    // (e.g. a different dev server on the same port, or a misconfigured proxy).
    if (response.status === 403) return t.errForbidden;
    if (response.status >= 500) return t.errServer.replace("{status}", status);
    return t.errBadResponse.replace("{status}", status);
  }

  return fallback;
}
