import { apiRequest } from "./client";
import type { AuthResponse, OtpRequest, OtpResponse, OtpVerifyRequest, SessionResponse } from "@/types/auth";

export const authApi = {
  requestOtp: (input: OtpRequest) => apiRequest<OtpResponse>("/api/auth/request-otp", { method: "POST", body: JSON.stringify(input), auth: false }),
  verifyOtp: (input: OtpVerifyRequest) => apiRequest<AuthResponse>("/api/auth/verify-otp", { method: "POST", body: JSON.stringify(input), auth: false }),
  session: () => apiRequest<SessionResponse>("/api/auth/session", { auth: false }),
  refresh: () => apiRequest<SessionResponse>("/api/auth/refresh", { method: "POST", auth: false }),
  logout: () => apiRequest<void>("/api/auth/logout", { method: "POST", auth: false }),
};
