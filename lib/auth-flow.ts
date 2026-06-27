/**
 * @file lib/auth-flow.ts
 * @description Client-side utilities for the OTP login flow and auth routing.
 *
 * normalizeNumericInput — converts Persian/Arabic-Indic digit strings to ASCII
 *   digits. Used by OTP digit inputs and date fields across the app.
 *
 * normalizeIranianPhone — accepts Iranian phone numbers in various formats
 *   (09xx, 9xx, 989xx, 00989xx) and normalises to the +989xxxxxxxxx E.164 form
 *   expected by the backend.
 *
 * savePendingPhone / getPendingPhone / clearPendingPhone — sessionStorage helpers
 *   that carry the phone number from the login page to the OTP verification page.
 *   Also stores the mock OTP returned by the development server for easy testing.
 *
 * getDevelopmentOtp — retrieves the stored development OTP for display in the
 *   OTP form's test mode banner.
 *
 * authDestination(role, hasProfile) — returns the correct post-login redirect
 *   path: /admin for admins, /dashboard for students with a profile, and
 *   /complete-profile for students without one.
 */
const PHONE_STORAGE_KEY = "auth.pending-phone";
const DEV_OTP_STORAGE_KEY = "auth.dev-otp";

export function normalizeNumericInput(value: string) {
  return value
    .replace(/[۰-۹]/g, (digit) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit)))
    .replace(/[٠-٩]/g, (digit) => String("٠١٢٣٤٥٦٧٨٩".indexOf(digit)));
}

export function normalizeIranianPhone(value: string) {
  const normalized = normalizeNumericInput(value).replace(/[\s()-]/g, "");
  if (/^09\d{9}$/.test(normalized)) return `+98${normalized.slice(1)}`;
  if (/^9\d{9}$/.test(normalized)) return `+98${normalized}`;
  if (/^989\d{9}$/.test(normalized)) return `+${normalized}`;
  if (/^00989\d{9}$/.test(normalized)) return `+${normalized.slice(2)}`;
  return normalized;
}

export function savePendingPhone(phone: string, developmentOtp?: string) {
  sessionStorage.setItem(PHONE_STORAGE_KEY, phone);
  if (developmentOtp) sessionStorage.setItem(DEV_OTP_STORAGE_KEY, developmentOtp);
  else sessionStorage.removeItem(DEV_OTP_STORAGE_KEY);
}

export function getPendingPhone() {
  return sessionStorage.getItem(PHONE_STORAGE_KEY);
}

export function clearPendingPhone() {
  sessionStorage.removeItem(PHONE_STORAGE_KEY);
  sessionStorage.removeItem(DEV_OTP_STORAGE_KEY);
}

export function getDevelopmentOtp() {
  return sessionStorage.getItem(DEV_OTP_STORAGE_KEY);
}

export function authDestination(role: "student" | "admin", hasProfile = false) {
  if (role === "admin") return "/admin";
  return hasProfile ? "/dashboard" : "/complete-profile";
}
