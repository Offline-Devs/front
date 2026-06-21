import type { Metadata } from "next"; import { PostEditor } from "@/components/blog/post-editor"; import { requireRole } from "@/lib/server/auth-guard";
export const metadata: Metadata = { title: "مقاله جدید" };
export default async function NewBlogPage() { const session = await requireRole("admin"); return <div className="grid gap-6"><div><h1 className="text-2xl font-black">مقاله جدید</h1><p className="mt-2 text-sm text-muted-foreground">محتوا را با HTML محدود بنویسید و پیش از انتشار بررسی کنید.</p></div><PostEditor authorId={session.user.id} /></div>; }
