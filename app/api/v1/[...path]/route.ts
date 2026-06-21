import { backendFetch, refreshServerSession } from "@/lib/server/backend-client";
import { clearSession, readSession, writeSession } from "@/lib/server/session";
import { copyResponse, errorResponse, isSameOriginMutation } from "@/lib/server/route-utils";
import { serverEnv } from "@/config/server-env";
import { DOCUMENT_TYPES, PROFILE_IMAGE_TYPES, validateFileSignatures, validateUploadFiles } from "@/lib/upload-policy";

const DROPPED_HEADERS = new Set(["host", "content-length", "connection", "authorization", "cookie"]);

async function validateUpload(path: string[], url: URL, headers: Headers, body: ArrayBuffer) {
  if (path[0] !== "upload") return null;
  const kind = url.searchParams.get("type");
  if (kind !== "profile" && kind !== "document") return Response.json({ error: "invalid upload type" }, { status: 400 });
  const contentType = headers.get("content-type") ?? "";
  if (!contentType.startsWith("multipart/form-data;")) return Response.json({ error: "unsupported media type" }, { status: 415 });
  const policy = kind === "profile"
    ? { maxBytes: serverEnv.uploads.profileMaxBytes, maxFiles: 1, mimeTypes: PROFILE_IMAGE_TYPES }
    : { maxBytes: serverEnv.uploads.documentMaxBytes, maxFiles: path[1] === "multiple" ? serverEnv.uploads.maxFiles : 1, mimeTypes: DOCUMENT_TYPES };
  if (body.byteLength > policy.maxBytes + 64 * 1024) return Response.json({ error: "payload too large" }, { status: 413 });
  let form: FormData;
  try { form = await new Request("http://internal", { method: "POST", headers, body }).formData(); }
  catch { return Response.json({ error: "invalid multipart body" }, { status: 400 }); }
  const files = [...form.values()].filter((entry): entry is File => entry instanceof File);
  const error = validateUploadFiles(files, policy);
  if (error) return Response.json({ error }, { status: error.includes("حجم") ? 413 : error.includes("نوع") ? 415 : 400 });
  const signatureError = await validateFileSignatures(files);
  return signatureError ? Response.json({ error: signatureError }, { status: 415 }) : null;
}

async function proxyRequest(request: Request, context: { params: Promise<{ path: string[] }> }) {
  if (!isSameOriginMutation(request)) return Response.json({ error: "invalid origin" }, { status: 403 });
  const { path } = await context.params; const incomingUrl = new URL(request.url); const backendPath = `/${path.map(encodeURIComponent).join("/")}${incomingUrl.search}`;
  const headers = new Headers(); request.headers.forEach((value, key) => { if (!DROPPED_HEADERS.has(key.toLowerCase())) headers.set(key, value); });
  const body = request.method === "GET" || request.method === "HEAD" ? undefined : await request.arrayBuffer();
  if (body) { const invalidUpload = await validateUpload(path, incomingUrl, headers, body); if (invalidUpload) return invalidUpload; }
  let session = await readSession();

  try {
    if (session && session.accessExpiresAt <= Date.now() + 10_000) { session = await refreshServerSession(session); if (session) await writeSession(session); else await clearSession(); }
    const perform = (accessToken?: string) => { const requestHeaders = new Headers(headers); if (accessToken) requestHeaders.set("Authorization", `Bearer ${accessToken}`); return backendFetch(backendPath, { method: request.method, headers: requestHeaders, body }); };
    let upstream = await perform(session?.accessToken);
    if (upstream.status === 401 && session) { const refreshed = await refreshServerSession(session); if (refreshed) { await writeSession(refreshed); upstream = await perform(refreshed.accessToken); } else { await clearSession(); } }
    return copyResponse(upstream, upstream.body);
  } catch (error) { return errorResponse(error); }
}

export const GET = proxyRequest; export const POST = proxyRequest; export const PUT = proxyRequest; export const PATCH = proxyRequest; export const DELETE = proxyRequest; export const OPTIONS = proxyRequest;
