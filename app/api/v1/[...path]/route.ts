/**
 * @file app/api/v1/[...path]/route.ts
 * @description Backend-for-Frontend (BFF) proxy that forwards all /api/v1/* requests
 * to the Go backend, injecting the Bearer token from the encrypted session cookie.
 *
 * Responsibilities:
 *
 * 1. Same-origin enforcement — mutations are rejected with 403 when the request
 *    Origin header does not match the public host.
 *
 * 2. Token injection and proactive refresh — reads the session cookie, refreshes
 *    the access token up to 10 seconds before expiry, and sets the Authorization
 *    header before forwarding. If the backend returns 401, one additional refresh
 *    attempt is made before clearing the session.
 *
 * 3. Upload validation (for /upload and /upload/multiple) — before forwarding a
 *    multipart body the BFF validates:
 *      • upload type query parameter ("profile" or "document")
 *      • content-type is multipart/form-data
 *      • total payload is within the per-request byte budget:
 *          single upload  → maxBytes × 1
 *          multiple upload → maxBytes × maxFiles   ← bug fix applied here
 *      • profile uploads match the allowed image MIME/signature set
 *      • document uploads accept any MIME type and are limited by size/count
 *    Rejections are returned as 400 / 413 / 415 before the body reaches the backend.
 *
 * 4. Header sanitisation — host, content-length, connection, authorization, and
 *    cookie headers are stripped before forwarding so the backend only sees the
 *    injected Bearer token.
 *
 * All HTTP methods are exported so the proxy handles GET, POST, PUT, PATCH,
 * DELETE, and OPTIONS transparently.
 */
import { backendFetch, refreshServerSession } from "@/lib/server/backend-client";
import { clearSession, readSession, writeSession } from "@/lib/server/session";
import { copyResponse, errorResponse, isSameOriginMutation } from "@/lib/server/route-utils";
import { serverEnv } from "@/config/server-env";
import {
  PROFILE_IMAGE_TYPES,
  validateFileSignatures,
  validateUploadFiles,
} from "@/lib/upload-policy";

const DROPPED_HEADERS = new Set([
  "host",
  "content-length",
  "connection",
  "authorization",
  "cookie",
]);

/**
 * Validates multipart upload requests before they are forwarded to the backend.
 * Returns a Response to reject the request early, or null to allow forwarding.
 *
 * Bug fix: total body budget is maxBytes × maxFiles for multi-file uploads,
 * not just maxBytes. Previously a second file of any size would exceed the limit.
 */
async function validateUpload(path: string[], url: URL, headers: Headers, body: ArrayBuffer) {
  if (path[0] !== "upload") return null;

  const kind = url.searchParams.get("type");
  if (kind !== "profile" && kind !== "document")
    return Response.json({ error: "invalid upload type" }, { status: 400 });

  const contentType = headers.get("content-type") ?? "";
  if (!contentType.startsWith("multipart/form-data;"))
    return Response.json({ error: "unsupported media type" }, { status: 415 });

  const isMultiple = path[1] === "multiple";
  const policy =
    kind === "profile"
      ? { maxBytes: serverEnv.uploads.profileMaxBytes, maxFiles: 1, mimeTypes: PROFILE_IMAGE_TYPES }
      : {
          maxBytes: serverEnv.uploads.documentMaxBytes,
          maxFiles: isMultiple ? serverEnv.uploads.maxFiles : 1,
        };

  // Total body budget accounts for all files in a multi-file request.
  // The extra 64 KiB covers multipart boundary overhead.
  const totalMaxBytes = policy.maxBytes * policy.maxFiles;
  if (body.byteLength > totalMaxBytes + 64 * 1024)
    return Response.json({ error: "payload too large" }, { status: 413 });

  let form: FormData;
  try {
    form = await new Request("http://internal", { method: "POST", headers, body }).formData();
  } catch {
    return Response.json({ error: "invalid multipart body" }, { status: 400 });
  }

  const files = [...form.values()].filter((entry): entry is File => entry instanceof File);

  const error = validateUploadFiles(files, policy);
  if (error)
    return Response.json(
      { error },
      { status: error.includes("حجم") ? 413 : error.includes("نوع") ? 415 : 400 },
    );

  if (kind !== "profile") return null;

  const signatureError = await validateFileSignatures(files);
  return signatureError ? Response.json({ error: signatureError }, { status: 415 }) : null;
}

async function proxyRequest(request: Request, context: { params: Promise<{ path: string[] }> }) {
  if (!isSameOriginMutation(request))
    return Response.json({ error: "invalid origin" }, { status: 403 });

  const { path } = await context.params;
  const incomingUrl = new URL(request.url);
  const backendPath = `/${path.map(encodeURIComponent).join("/")}${incomingUrl.search}`;

  const headers = new Headers();
  request.headers.forEach((value, key) => {
    if (!DROPPED_HEADERS.has(key.toLowerCase())) headers.set(key, value);
  });

  const body =
    request.method === "GET" || request.method === "HEAD" ? undefined : await request.arrayBuffer();

  if (body) {
    const invalidUpload = await validateUpload(path, incomingUrl, headers, body);
    if (invalidUpload) return invalidUpload;
  }

  let session = await readSession();

  try {
    // Proactively refresh the access token within 10 seconds of expiry.
    if (session && session.accessExpiresAt <= Date.now() + 10_000) {
      session = await refreshServerSession(session);
      if (session) await writeSession(session);
      else await clearSession();
    }

    const perform = (accessToken?: string) => {
      const requestHeaders = new Headers(headers);
      if (accessToken) requestHeaders.set("Authorization", `Bearer ${accessToken}`);
      return backendFetch(backendPath, { method: request.method, headers: requestHeaders, body });
    };

    let upstream = await perform(session?.accessToken);

    // On 401, attempt one token refresh before giving up.
    if (upstream.status === 401 && session) {
      const refreshed = await refreshServerSession(session);
      if (refreshed) {
        await writeSession(refreshed);
        upstream = await perform(refreshed.accessToken);
      } else {
        await clearSession();
      }
    }

    return copyResponse(upstream, upstream.body);
  } catch (error) {
    return errorResponse(error);
  }
}

export const GET = proxyRequest;
export const POST = proxyRequest;
export const PUT = proxyRequest;
export const PATCH = proxyRequest;
export const DELETE = proxyRequest;
export const OPTIONS = proxyRequest;
