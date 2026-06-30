/**
 * @file app/(admin)/admin/blog/new/page.tsx
 * @description Page for creating a new blog post.
 *
 * Server component that calls requireRole("admin") to obtain the
 * authenticated admin's user ID, then passes it to PostEditor as the
 * authorId prop so the post is attributed correctly on save.
 */
import type { Metadata } from "next";
import { PostEditor } from "@/components/blog/post-editor";
import { requireRole } from "@/lib/server/auth-guard";
export const metadata: Metadata = { title: "مقاله جدید" };
export default async function NewBlogPage() {
  const session = await requireRole("admin");
  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-2xl font-black">مقاله جدید</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          متن مقاله را با ابزارهای ویرایشگر آماده کنید و پیش از انتشار پیش‌نمایش بگیرید.
        </p>
      </div>
      <PostEditor authorId={session.user.id} />
    </div>
  );
}
