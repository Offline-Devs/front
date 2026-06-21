"use client";

import { useAuthStore } from "@/stores/auth-store";

export function useAuth() { const state = useAuthStore(); return { ...state, isLoading: state.status === "loading", isAuthenticated: state.status === "authenticated", isAdmin: state.user?.role === "admin" }; }
