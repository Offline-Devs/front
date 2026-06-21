import { backendFetch } from "@/lib/server/backend-client";
import { copyResponse, errorResponse, isSameOriginMutation, responseBody } from "@/lib/server/route-utils";

export async function POST(request: Request) { if (!isSameOriginMutation(request)) return Response.json({ error: "invalid origin" }, { status: 403 }); try { const upstream = await backendFetch("/auth/request-otp", { method: "POST", headers: { "Content-Type": request.headers.get("content-type") ?? "application/json" }, body: await request.arrayBuffer() }); return copyResponse(upstream, await responseBody(upstream)); } catch (error) { return errorResponse(error); } }
