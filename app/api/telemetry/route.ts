import { sanitizeTelemetry } from "@/lib/observability";
import { isSameOriginMutation } from "@/lib/server/route-utils";

const MAX_BODY_BYTES = 2_048;

export async function POST(request: Request) {
  if (!isSameOriginMutation(request))
    return Response.json({ error: "invalid origin" }, { status: 403 });
  if (!request.headers.get("content-type")?.startsWith("application/json"))
    return Response.json({ error: "unsupported media type" }, { status: 415 });
  if (Number(request.headers.get("content-length") ?? 0) > MAX_BODY_BYTES)
    return Response.json({ error: "payload too large" }, { status: 413 });
  const raw = await request.text();
  if (new TextEncoder().encode(raw).byteLength > MAX_BODY_BYTES)
    return Response.json({ error: "payload too large" }, { status: 413 });
  const event = sanitizeTelemetry(
    JSON.parse(raw).catch?.(() => null) ??
      (() => {
        try {
          return JSON.parse(raw);
        } catch {
          return null;
        }
      })(),
  );
  if (!event) return Response.json({ error: "invalid event" }, { status: 400 });
  // Structured event contains no token, request headers, stack trace or user identity.
  process.stdout.write(
    `${JSON.stringify({ level: event.type === "error" ? "error" : "info", event, at: new Date().toISOString() })}\n`,
  );
  return new Response(null, { status: 204 });
}
