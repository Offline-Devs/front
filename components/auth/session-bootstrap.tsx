/**
 * @file components/auth/session-bootstrap.tsx
 * @description Invisible client component that hydrates the auth store on mount.
 *
 * On first render it fires GET /api/auth/session to read the encrypted BFF
 * cookie server-side and return the current user object. The result is written
 * to the TanStack Query cache (queryKeys.session) and the Zustand auth store.
 *
 * Also subscribes to cross-tab auth events via auth-channel.ts:
 *   "logout"          — clears the query cache and marks the user as unauthenticated.
 *   "session-updated" — invalidates the session query key so a refreshed token
 *                       is picked up in all open tabs.
 *
 * Renders null — has no visible output.
 */
"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { authApi } from "@/services/api/auth.api";
import { queryKeys } from "@/services/api/query-keys";
import { subscribeToAuthEvents } from "@/lib/auth-channel";
import { useAuthStore } from "@/stores/auth-store";

export function SessionBootstrap() {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);
  const setUnauthenticated = useAuthStore((state) => state.setUnauthenticated);
  const session = useQuery({
    queryKey: queryKeys.session,
    queryFn: authApi.session,
    meta: { suppressErrorToast: true },
    retry: false,
    staleTime: 30_000,
  });
  useEffect(() => {
    if (session.data) setUser(session.data.user);
    else if (session.isError) setUnauthenticated();
  }, [session.data, session.isError, setUser, setUnauthenticated]);
  useEffect(
    () =>
      subscribeToAuthEvents((event) => {
        if (event === "logout") {
          queryClient.clear();
          setUnauthenticated();
        } else {
          void queryClient.invalidateQueries({ queryKey: queryKeys.session });
        }
      }),
    [queryClient, setUnauthenticated],
  );
  return null;
}
