"use client";

import { create } from "zustand";
import type { User } from "@/types/student";

type AuthState = { accessToken: string | null; refreshToken: string | null; user: User | null; setSession: (value: { accessToken: string; refreshToken: string; user: User }) => void; setAccessToken: (value: string) => void; clearSession: () => void };

// فقط state نشست را نگه می‌دارد؛ server-state در React Query است. production بهتر است refresh token را BFF در HttpOnly cookie نگه دارد.
export const useAuthStore = create<AuthState>((set) => ({ accessToken: null, refreshToken: null, user: null, setSession: ({ accessToken, refreshToken, user }) => set({ accessToken, refreshToken, user }), setAccessToken: (accessToken) => set({ accessToken }), clearSession: () => set({ accessToken: null, refreshToken: null, user: null }) }));
