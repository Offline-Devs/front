// کلاینت فقط same-origin را می‌بیند؛ آدرس واقعی backend هرگز وارد bundle مرورگر نمی‌شود.
export const env = {
  apiBaseUrl: "/api/v1",
} as const;
