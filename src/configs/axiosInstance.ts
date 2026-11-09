import axios from "axios";
import { store } from "@/store";
import { logout, setAccessToken, clearPharmacy } from "@/store/authSlice";
import { TOKEN_KEY } from "@/utils/constants";
import { db } from "@/utils/db";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
type RefreshSubscriber = { resolve: (token: string) => void; reject: (reason: unknown) => void };
const refreshSubscribers: RefreshSubscriber[] = [];

function subscribeTokenRefresh(sub: RefreshSubscriber): void {
  refreshSubscribers.push(sub);
}

function notifySubscribers(token: string): void {
  refreshSubscribers.splice(0).forEach((sub) => sub.resolve(token));
}

// When the refresh itself fails, queued requests must fail too — retrying them
// with an empty token only produced a burst of extra 401s.
function rejectSubscribers(reason: unknown): void {
  refreshSubscribers.splice(0).forEach((sub) => sub.reject(reason));
}

const retriedRequests = new WeakSet<object>();

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const url = originalRequest?.url ?? "";
    // Only block these specific endpoints from the refresh flow — login/logout/refresh
    // should never retry with a refreshed token. /auth/me and /auth/select-pharmacy
    // should still benefit from token refresh.
    const isNonRefreshable =
      url === "/auth/login" || url === "/auth/logout" || url === "/auth/refresh";

    if (
      error.response?.status === 401 &&
      !isNonRefreshable &&
      originalRequest &&
      !retriedRequests.has(originalRequest)
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          subscribeTokenRefresh({
            resolve: (token) => {
              retriedRequests.add(originalRequest);
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(axiosInstance(originalRequest));
            },
            reject,
          });
        });
      }

      retriedRequests.add(originalRequest);
      isRefreshing = true;

      try {
        const refreshResponse = await axios.post<{
          success: boolean;
          data: { accessToken: string } | null;
        }>(
          `${import.meta.env.VITE_API_BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const newToken = refreshResponse.data?.data?.accessToken;
        if (!newToken) throw new Error("No access token in refresh response");

        store.dispatch(setAccessToken(newToken));
        axiosInstance.defaults.headers.common.Authorization = `Bearer ${newToken}`;
        notifySubscribers(newToken);

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
      } catch {
        rejectSubscribers(error);
        store.dispatch(logout());
        // Full reload below wipes memory; IndexedDB must be cleared explicitly.
        try {
          await db.queryCache.clear();
        } catch {
          // IndexedDB unavailable — nothing persisted to clear.
        }
        sessionStorage.setItem("auth_redirect_reason", "session_expired");
        window.location.href = "/login";
        return Promise.reject(error);
      } finally {
        isRefreshing = false;
      }
    }

    // Handle pharmacy-not-selected: user is authenticated but pharmacy context
    // is missing from the token. Clear pharmacy state and send back to home.
    if (
      error.response?.status === 403 &&
      (error.response?.data as { code?: string })?.code === "PHARMACY_NOT_SELECTED"
    ) {
      store.dispatch(clearPharmacy());
      sessionStorage.setItem("auth_redirect_reason", "pharmacy_context_lost");
      window.location.href = "/";
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

export { axiosInstance };
