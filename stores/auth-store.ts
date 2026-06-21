"use client";

import { create } from "zustand";
import type { User } from "@/types/student";

type AuthStatus = "loading" | "authenticated" | "unauthenticated";
type AuthState = { user: User | null; status: AuthStatus; setUser: (user: User) => void; setUnauthenticated: () => void; clearSession: () => void };

// Browser state contains no token; credentials remain encrypted in the HttpOnly BFF cookie.
export const useAuthStore = create<AuthState>((set) => ({ user: null, status: "loading", setUser: (user) => set({ user, status: "authenticated" }), setUnauthenticated: () => set({ user: null, status: "unauthenticated" }), clearSession: () => set({ user: null, status: "unauthenticated" }) }));
