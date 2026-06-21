// تنها محل خواندن env عمومی؛ آدرس باید شامل prefix واقعی nginx (معمولاً /api/v1) باشد.
export const env = { apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080" } as const;
