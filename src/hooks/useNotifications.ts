import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";

import {
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "@/service/notificationService";
import type { RootState } from "@/store";
import type { NotificationList } from "@/types/notification";

/** Alerts are written once a day by the server; a few minutes of staleness is fine. */
const REFRESH_MS = 5 * 60 * 1000;

interface UseNotificationsReturn {
  data: NotificationList | undefined;
  isLoading: boolean;
  isError: boolean;
  markRead: (uuid: string) => void;
  markAllRead: () => void;
  isMarkingAll: boolean;
}

export function useNotifications(): UseNotificationsReturn {
  const queryClient = useQueryClient();
  const pharmacyUuid = useSelector((state: RootState) => state.auth.currentPharmacy?.uuid);
  const queryKey = ["notifications", pharmacyUuid];

  const query = useQuery({
    queryKey,
    queryFn: async () => (await getNotifications()).data ?? { items: [], unreadCount: 0 },
    enabled: !!pharmacyUuid,
    staleTime: 60 * 1000,
    refetchInterval: REFRESH_MS,
  });

  const invalidate = (): Promise<void> => queryClient.invalidateQueries({ queryKey: ["notifications"] });

  const markOne = useMutation({ mutationFn: markNotificationRead, onSuccess: invalidate });
  const markAll = useMutation({ mutationFn: markAllNotificationsRead, onSuccess: invalidate });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    markRead: (uuid) => markOne.mutate(uuid),
    markAllRead: () => markAll.mutate(),
    isMarkingAll: markAll.isPending,
  };
}
