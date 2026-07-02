"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Bell } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { formatDate, formatNumber } from "@/lib/formatters";
import { notificationApi } from "@/services/api/notification.api";
import { queryKeys } from "@/services/api/query-keys";
import type { AppNotification } from "@/types/notification";

const NOTIFICATION_AUTO_CLOSE_MS = 7_000;

function safeHref(href?: string) {
  return href?.startsWith("/") ? href : "/dashboard";
}

export function StudentNotifications() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [remainingMs, setRemainingMs] = useState(NOTIFICATION_AUTO_CLOSE_MS);

  const notifications = useQuery({
    queryKey: queryKeys.notifications,
    queryFn: notificationApi.mine,
    staleTime: 30_000,
  });

  const markRead = useMutation({
    mutationFn: notificationApi.markRead,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.notifications });
    },
  });

  useEffect(() => {
    if (!open) return;
    const close = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const startedAt = Date.now();

    const intervalId = window.setInterval(() => {
      const remaining = Math.max(0, NOTIFICATION_AUTO_CLOSE_MS - (Date.now() - startedAt));
      setRemainingMs(remaining);

      if (remaining <= 0) {
        setOpen(false);
        window.clearInterval(intervalId);
      }
    }, 100);

    return () => window.clearInterval(intervalId);
  }, [open]);

  function toggleNotifications() {
    if (open) {
      setOpen(false);
      return;
    }

    setRemainingMs(NOTIFICATION_AUTO_CLOSE_MS);
    setOpen(true);
  }

  async function openNotification(notification: AppNotification) {
    setOpen(false);
    if (!notification.is_read) {
      try {
        await markRead.mutateAsync(notification.id);
      } catch {
        // Navigation should still work if marking the item as read fails.
      }
    }
    router.push(safeHref(notification.href));
  }

  const unreadCount = notifications.data?.unread_count ?? 0;
  const items = [...(notifications.data?.notifications ?? [])]
    .sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at))
    .slice(0, 5);
  const timerProgress = Math.max(
    0,
    Math.min(100, (remainingMs / NOTIFICATION_AUTO_CLOSE_MS) * 100),
  );

  return (
    <div ref={rootRef} className="relative">
      <Button
        variant="ghost"
        size="icon"
        aria-label="اعلان‌ها"
        aria-expanded={open}
        onClick={toggleNotifications}
      >
        <Bell className="size-5" />
        {unreadCount > 0 && (
          <Badge className="absolute -end-1 -top-1 min-w-5 justify-center px-1.5 py-0 text-[10px]">
            {formatNumber(unreadCount)}
          </Badge>
        )}
      </Button>

      {open && (
        <div className="absolute end-0 top-full z-50 mt-2 w-72 max-w-[calc(100vw-3rem)] overflow-hidden rounded-md border bg-card shadow-lg sm:w-80 sm:max-w-[calc(100vw-2rem)]">
          <div className="border-b px-3 py-2.5 sm:px-4 sm:py-3">
            <p className="text-sm font-bold">اعلان‌ها</p>
          </div>
          <div className="h-1 bg-muted">
            <div
              className="h-full bg-primary transition-[width] duration-100 ease-linear"
              style={{ width: `${timerProgress}%` }}
            />
          </div>
          {notifications.isLoading ? (
            <div className="grid gap-2 p-3">
              <div className="h-14 animate-pulse rounded-md bg-muted" />
              <div className="h-14 animate-pulse rounded-md bg-muted" />
            </div>
          ) : notifications.isError ? (
            <div className="p-4 text-sm text-muted-foreground">اعلان‌ها بارگذاری نشدند.</div>
          ) : items.length === 0 ? (
            <div className="p-4 text-sm text-muted-foreground">فعلا اعلانی نیست</div>
          ) : (
            <ul className="max-h-80 overflow-y-auto p-1.5 sm:max-h-96 sm:p-2">
              {items.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    className={cn(
                      "grid w-full gap-1 rounded-md p-2.5 text-right text-xs transition-colors hover:bg-muted sm:p-3 sm:text-sm",
                      !item.is_read && "bg-primary/5",
                    )}
                    onClick={() => void openNotification(item)}
                  >
                    <span className="flex items-center justify-between gap-3">
                      <span className="font-bold">{item.title}</span>
                      {!item.is_read && <span className="size-2 rounded-full bg-primary" />}
                    </span>
                    {item.body && (
                      <span className="line-clamp-2 text-xs leading-6 text-muted-foreground">
                        {item.body}
                      </span>
                    )}
                    <time className="text-xs text-muted-foreground" dateTime={item.created_at}>
                      {formatDate(item.created_at)}
                    </time>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
