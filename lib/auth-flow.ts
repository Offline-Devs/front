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
