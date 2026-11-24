/**
 * The access token lives in memory only, so an injected script cannot lift it
 * from localStorage. After a reload it is re-issued from the httpOnly refresh
 * cookie (see refreshSession in configs/axiosInstance).
 *
 * localStorage keeps a non-secret "has_session" hint so the app knows whether a
 * silent refresh is worth attempting on startup.
 */
const SESSION_HINT_KEY = "has_session";
const LEGACY_TOKEN_KEY = "accessToken";

let accessToken: string | null = null;

function safe(fn: () => void): void {
  try {
    fn();
  } catch {
    // storage unavailable (private mode) — the in-memory token still works
  }
}

// One-time cleanup: earlier builds persisted the token itself.
safe(() => localStorage.removeItem(LEGACY_TOKEN_KEY));

export function getToken(): string | null {
  return accessToken;
}

export function storeToken(token: string): void {
  accessToken = token;
  safe(() => localStorage.setItem(SESSION_HINT_KEY, "1"));
}

export function clearToken(): void {
  accessToken = null;
  safe(() => localStorage.removeItem(SESSION_HINT_KEY));
}

export function hasSessionHint(): boolean {
  try {
    return localStorage.getItem(SESSION_HINT_KEY) === "1";
  } catch {
    return false;
  }
}
