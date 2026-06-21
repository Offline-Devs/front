"use client";
import { useAuthStore } from "@/stores/auth-store";

// facade احراز هویت برای componentها؛ logout باید cache خصوصی QueryClient را نیز clear کند.
export function useAuth() { const state = useAuthStore(); return { ...state, isAuthenticated: Boolean(state.accessToken && state.user), isAdmin: state.user?.role === "admin" }; }
