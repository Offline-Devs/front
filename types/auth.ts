/**
 * @file types/auth.ts
 * @description Request and response type contracts for OTP authentication flows.
 *
 * The BFF authentication routes (/api/auth/*) mediate between the browser and
 * the Go backend. These types define the shapes of data crossing that boundary:
 *
 * OtpRequest / OtpVerifyRequest — browser → BFF payloads.
 * OtpResponse      — BFF → browser after requestOtp (may include a dev OTP).
 * BackendAuthResponse — raw Go backend response containing access/refresh tokens;
 *   consumed exclusively by the BFF verify-otp route and never sent to the browser.
 * BackendRefreshResponse — raw Go backend token refresh response; BFF-internal only.
 * SessionResponse  — what the BFF returns to the browser: user + expires_in.
 *   Tokens are excluded; they remain in the encrypted HttpOnly cookie.
 * AuthResponse     — alias for SessionResponse (used by the OTP form mutation).
 */
import type { User } from "./student";

// Defines request and response contracts for OTP request, OTP verification, and access-token refresh operations handled through the BFF.
export type UserRole = "student" | "admin";
export type OtpRequest = { phone: string };
export type OtpVerifyRequest = { phone: string; code: string };
export type OtpResponse = { message: string; otp?: string };
export type BackendAuthResponse = {
  access_token: string;
  refresh_token: string;
  user: User;
  expires_in: number;
};
export type BackendRefreshResponse = { access_token: string; expires_in: number };
export type SessionResponse = { user: User; expires_in: number };
export type AuthResponse = SessionResponse;
