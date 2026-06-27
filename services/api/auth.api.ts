/**
 * @file services/api/auth.api.ts
 * @description API client for OTP authentication flows and session management.
 *
 * All auth endpoints target the Next.js BFF routes (/api/auth/*) rather than
 * the Go backend directly. The BFF routes handle token storage in HttpOnly
 * cookies so the browser never touches JWT values.
 *
 * requestOtp(input)  — POST /api/auth/request-otp; triggers OTP SMS dispatch.
 * verifyOtp(input)   — POST /api/auth/verify-otp; validates the OTP and writes
 *                      the encrypted session cookie, returning { user, expires_in }.
 * session()          — GET /api/auth/session; reads the current session from the
 *                      cookie without a backend round-trip.
 * refresh()          — POST /api/auth/refresh; refreshes the access token using
 *                      the refresh token stored in the cookie.
 * logout()           — POST /api/auth/logout; clears the session cookie server-side.
 */
import { apiRequest } from "./client";
import type {
  AuthResponse,
  OtpRequest,
  OtpResponse,
  OtpVerifyRequest,
  SessionResponse,
} from "@/types/auth";

export const authApi = {
  requestOtp: (input: OtpRequest) =>
    apiRequest<OtpResponse>("/api/auth/request-otp", {
      method: "POST",
      body: JSON.stringify(input),
      auth: false,
    }),
  verifyOtp: (input: OtpVerifyRequest) =>
    apiRequest<AuthResponse>("/api/auth/verify-otp", {
      method: "POST",
      body: JSON.stringify(input),
      auth: false,
    }),
  session: () => apiRequest<SessionResponse>("/api/auth/session", { auth: false }),
  refresh: () => apiRequest<SessionResponse>("/api/auth/refresh", { method: "POST", auth: false }),
  logout: () => apiRequest<void>("/api/auth/logout", { method: "POST", auth: false }),
};
