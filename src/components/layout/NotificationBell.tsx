import type { JSX } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, BellOff, CheckCheck, Loader2 } from "lucide-react";

import { cn } from "@/utils/cn";
import { useLanguage } from "@/hooks/useLanguage";
import { useNotifications } from "@/hooks/useNotifications";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { AppNotification } from "@/types/notification";
import {
  NOTIFICATION_ICON,
  SEVERITY_CLASS,
  formatNotificationTime,
  notificationMessage,
} from "./notificationUtils";

/** Header bell: the pharmacy's daily alerts, unread count, mark as read. */
export function NotificationBell(): JSX.Element {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const [open, setOpen] = useState(false);
  const { data, isLoading, isError, markRead, markAllRead, isMarkingAll } = useNotifications();

  const unread = data?.unreadCount ?? 0;
  const items = data?.items ?? [];

  function handleOpen(n: AppNotification): void {
    if (!n.isRead) markRead(n.uuid);
    if (n.link) {
      setOpen(false);
      navigate(n.link);
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label={unread > 0 ? `${t.notifications} (${unread})` : t.notifications}
          className={cn(
            "relative flex h-8 w-8 items-center justify-center rounded-xl",
            "text-muted-foreground transition-all duration-150",
            "hover:bg-accent hover:text-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
          )}
        >
          <Bell className="h-4 w-4" />
          {unread > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold leading-none text-destructive-foreground">
              {unread > 9 ? "9+" : unread}
            </span>
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        collisionPadding={12}
        className="flex max-h-[min(28rem,calc(100dvh-5rem))] w-[min(23rem,calc(100vw-1.5rem))] flex-col overflow-hidden rounded-xl p-0"
      >
        <div className="flex items-center justify-between gap-2 border-b border-border px-4 py-3">
          <p className="text-sm font-semibold text-foreground">{t.notifications}</p>
          {unread > 0 && (
            <button
              type="button"
              onClick={markAllRead}
              disabled={isMarkingAll}
              className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary/10 disabled:opacity-50"
            >
              {isMarkingAll ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCheck className="h-3.5 w-3.5" />}
              {t.notificationsMarkAllRead}
            </button>
          )}
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex h-24 items-center justify-center">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : isError ? (
            <p className="px-4 py-8 text-center text-sm text-muted-foreground">{t.notificationsLoadError}</p>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center gap-2 px-6 py-8 text-center">
              <BellOff className="h-7 w-7 text-muted-foreground/40" />
              <p className="text-sm font-medium text-foreground">{t.notificationsEmpty}</p>
              <p className="text-xs text-muted-foreground">{t.notificationsEmptyDesc}</p>
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {items.map((n) => {
                const Icon = NOTIFICATION_ICON[n.type];
                return (
                  <li key={n.uuid}>
                    <button
                      type="button"
                      onClick={() => handleOpen(n)}
                      className={cn(
                        "flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-accent/60",
                        !n.isRead && "bg-primary/[0.04]"
                      )}
                    >
                      <span className={cn("mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg", SEVERITY_CLASS[n.severity])}>
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className={cn("block text-sm leading-snug", n.isRead ? "text-muted-foreground" : "font-medium text-foreground")}>
                          {notificationMessage(n, t)}
                        </span>
                        <span className="mt-0.5 block text-xs text-muted-foreground">
                          {formatNotificationTime(n.updatedAt, language)}
                        </span>
                      </span>
                      {!n.isRead && <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-primary" aria-hidden />}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
