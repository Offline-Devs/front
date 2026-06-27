/**
 * @file hooks/use-logout.ts
 * @description Custom hook that encapsulates the full logout sequence.
 *
 * Returns an async function that:
 *  1. Calls POST /api/auth/logout to clear the server-side session cookie.
 *  2. Clears the entire TanStack Query cache.
 *  3. Resets the auth store to unauthenticated.
 *  4. Broadcasts the "logout" event to all open tabs via auth-channel.ts.
 *  5. Navigates to /login.
 *
 * If the remote logout request fails (network error, expired session), the
 * local session is still cleared and the user is redirected to /login.
 * A warning toast is shown when the remote call fails.
 */
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
