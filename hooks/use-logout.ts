"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authApi } from "@/services/api/auth.api";
import { broadcastAuthEvent } from "@/lib/auth-channel";
import { useAuthStore } from "@/stores/auth-store";
import { toast } from "@/components/ui/toast";

export function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();
  return async () => {
    let remoteLogoutFailed = false;
    try {
      await authApi.logout();
    } catch {
      remoteLogoutFailed = true;
    } finally {
      queryClient.clear();
      useAuthStore.getState().clearSession();
      broadcastAuthEvent("logout");
      router.replace("/login");
      router.refresh();
      if (remoteLogoutFailed) toast.warning("نشست محلی بسته شد؛ ارتباط با سرور برقرار نبود.");
      else toast.success("از حساب کاربری خارج شدید.");
    }
  };
}
