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
