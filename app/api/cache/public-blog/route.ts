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
