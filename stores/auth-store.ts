/**
 * @file stores/auth-store.ts
 * @description Global Zustand store for client-side authentication state.
 *
 * Stores only the public User object and an authentication status enum.
 * Tokens are never held in JavaScript memory — they remain encrypted inside
 * the HttpOnly BFF session cookie and are injected server-side by the proxy.
 *
 * Status values:
 *   "loading"         — initial state; the session query has not yet resolved.
 *   "authenticated"   — a valid user object is present.
 *   "unauthenticated" — the session query returned 401 or the user explicitly
 *                       logged out.
 *
 * setUser(user)         — called by OtpForm and SessionBootstrap on successful auth.
 * setUnauthenticated()  — called by apiRequest on 401 and by the logout hook.
 * clearSession()        — alias for setUnauthenticated; called on explicit logout.
 */
"use client";

import { create } from "zustand";
import type { User } from "@/types/student";

type AuthStatus = "loading" | "authenticated" | "unauthenticated";
type AuthState = {
  user: User | null;
  status: AuthStatus;
  setUser: (user: User) => void;
  setUnauthenticated: () => void;
  clearSession: () => void;
};

// Browser state contains no token; credentials remain encrypted in the HttpOnly BFF cookie.
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  status: "loading",
  setUser: (user) => set({ user, status: "authenticated" }),
  setUnauthenticated: () => set({ user: null, status: "unauthenticated" }),
  clearSession: () => set({ user: null, status: "unauthenticated" }),
}));
