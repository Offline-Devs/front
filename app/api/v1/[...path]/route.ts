import { serverEnv } from "@/config/server-env";

const REQUEST_HEADERS_TO_DROP = new Set(["host", "content-length", "connection"]);
const RESPONSE_HEADERS_TO_FORWARD = ["content-type", "content-disposition", "cache-control", "etag", "last-modified"];

// gateway هم‌مبدا برای حذف CORS و پنهان‌کردن آدرس داخلی backend؛ session امن در فاز ۲ روی همین مرز سوار می‌شود.
async function proxyRequest(request: Request, context: { params: Promise<{ path: string[] }> }) {
  const { path } = await context.params;
  const incomingUrl = new URL(request.url);
  const targetUrl = new URL(`${serverEnv.apiBaseUrl}/${path.map(encodeURIComponent).join("/")}`);
  targetUrl.search = incomingUrl.search;

  const headers = new Headers();
  request.headers.forEach((value, key) => {
    if (!REQUEST_HEADERS_TO_DROP.has(key.toLowerCase())) headers.set(key, value);
  });

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), serverEnv.apiTimeoutMs);

  try {
    const upstream = await fetch(targetUrl, {
      method: request.method,
      headers,
      body: request.method === "GET" || request.method === "HEAD" ? undefined : await request.arrayBuffer(),
      cache: "no-store",
      redirect: "manual",
      signal: controller.signal,
    });
    const responseHeaders = new Headers();
    for (const name of RESPONSE_HEADERS_TO_FORWARD) {
      const value = upstream.headers.get(name);
      if (value) responseHeaders.set(name, value);
    }
    return new Response(upstream.body, { status: upstream.status, headers: responseHeaders });
  } catch (error) {
    const timedOut = error instanceof Error && error.name === "AbortError";
    return Response.json(
      { error: timedOut ? "backend request timed out" : "backend unavailable" },
      { status: timedOut ? 504 : 502 },
    );
  } finally {
    clearTimeout(timeout);
  }
}

export const GET = proxyRequest;
export const POST = proxyRequest;
export const PUT = proxyRequest;
export const PATCH = proxyRequest;
export const DELETE = proxyRequest;
export const OPTIONS = proxyRequest;
