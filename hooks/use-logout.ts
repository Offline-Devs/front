"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authApi } from "@/services/api/auth.api";
import { broadcastAuthEvent } from "@/lib/auth-channel";
import { useAuthStore } from "@/stores/auth-store";

export function useLogout() { const queryClient = useQueryClient(); const router = useRouter(); return async () => { try { await authApi.logout(); } finally { queryClient.clear(); useAuthStore.getState().clearSession(); broadcastAuthEvent("logout"); router.replace("/login"); router.refresh(); } }; }
