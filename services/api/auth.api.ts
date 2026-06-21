import { apiRequest } from "./client";
import type { AuthResponse, OtpRequest, OtpResponse, OtpVerifyRequest, RefreshResponse } from "@/types/auth";
// endpointهای عمومی OTP و refresh.
export const authApi = { requestOtp: (input: OtpRequest) => apiRequest<OtpResponse>("/auth/request-otp", { method: "POST", body: JSON.stringify(input), auth: false }), verifyOtp: (input: OtpVerifyRequest) => apiRequest<AuthResponse>("/auth/verify-otp", { method: "POST", body: JSON.stringify(input), auth: false }), refresh: (refresh_token: string) => apiRequest<RefreshResponse>("/auth/refresh", { method: "POST", body: JSON.stringify({ refresh_token }), auth: false }) };
