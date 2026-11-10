import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Short enough that records added on another workstation show up within
      // a minute; this device's own writes invalidate immediately (see
      // queryInvalidation). Cached data still renders instantly meanwhile.
      staleTime: 1000 * 60,
      retry: 1,
    },
  },
});
