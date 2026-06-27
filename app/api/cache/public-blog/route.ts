/**
 * @file app/api/cache/public-blog/route.ts
 * @description BFF route: triggers ISR cache revalidation for the public blog.
 *
 * POST /api/cache/public-blog
 *   Validates same-origin and requires an authenticated admin session.
 *   Calls Next.js revalidateTag(publicCacheTags.blog) to purge the cached
 *   blog post list and individual post pages so changes made in the admin
 *   editor appear immediately on the public site without waiting for the
 *   revalidate timer. Called automatically by admin blog save and publish
 *   mutations via blogApi.revalidatePublicCache().
 */
import { revalidateTag } from "next/cache";
import { isSameOriginMutation } from "@/lib/server/route-utils";
import { readSession } from "@/lib/server/session";
import { publicCacheTags } from "@/services/server/public-content";

export async function POST(request: Request) {
  if (!isSameOriginMutation(request))
    return Response.json({ error: "invalid origin" }, { status: 403 });
  const session = await readSession();
  if (!session || session.user.role !== "admin")
    return Response.json({ error: "forbidden" }, { status: 403 });
  revalidateTag(publicCacheTags.blog, "max");
  return new Response(null, { status: 204 });
}
