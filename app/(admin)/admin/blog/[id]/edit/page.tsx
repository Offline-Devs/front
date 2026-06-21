import type { Metadata } from "next"; import { EditPostEditor } from "@/components/blog/edit-post-editor"; import { requireRole } from "@/lib/server/auth-guard";
export const metadata: Metadata = { title: "ویرایش مقاله" };
export default async function EditBlogPage({ params }: { params: Promise<{ id: string }> }) { const [{ id }, session] = await Promise.all([params, requireRole("admin")]); return <div className="grid gap-6"><h1 className="text-2xl font-black">ویرایش مقاله</h1><EditPostEditor id={id} authorId={session.user.id} /></div>; }
