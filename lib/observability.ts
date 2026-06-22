type TelemetryEvent = {
  type: "error" | "web-vital";
  name: string;
  value?: number;
  rating?: "good" | "needs-improvement" | "poor";
  route?: string;
  digest?: string;
};

const SENSITIVE_KEY = /authorization|cookie|token|secret|password|phone|email|name/i;

// Keep telemetry intentionally small and strip PII-like keys before transport or logging.
export function sanitizeTelemetry(input: unknown): TelemetryEvent | null {
  if (!input || typeof input !== "object" || Array.isArray(input)) return null;
  const source = input as Record<string, unknown>;
  if (source.type !== "error" && source.type !== "web-vital") return null;
  if (typeof source.name !== "string" || !source.name.trim() || source.name.length > 80)
    return null;
  const clean: Record<string, unknown> = { type: source.type, name: source.name.slice(0, 80) };
  for (const key of ["value", "rating", "route", "digest"] as const) {
    if (SENSITIVE_KEY.test(key)) continue;
    const value = source[key];
    if (key === "value" && typeof value === "number" && Number.isFinite(value)) clean.value = value;
    if (key === "rating" && ["good", "needs-improvement", "poor"].includes(String(value)))
      clean.rating = value;
    if ((key === "route" || key === "digest") && typeof value === "string")
      clean[key] = value.slice(0, 160).split("?")[0];
  }
  return clean as TelemetryEvent;
}

export function reportTelemetry(event: TelemetryEvent) {
  if (typeof window === "undefined") return;
  const body = JSON.stringify(event);
  if (navigator.sendBeacon)
    navigator.sendBeacon("/api/telemetry", new Blob([body], { type: "application/json" }));
  else
    void fetch("/api/telemetry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    });
}
