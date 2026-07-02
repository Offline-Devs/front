import { apiRequest } from "./client";
import type { StatusResponse } from "@/types/api";
import type { NotificationsResponse } from "@/types/notification";

export const notificationApi = {
  mine: () => apiRequest<NotificationsResponse>("/notifications"),
  markRead: (id: string) =>
    apiRequest<StatusResponse>(`/notifications/${id}/read`, { method: "PUT" }),
};
