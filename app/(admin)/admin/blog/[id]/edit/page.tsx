/**
 * @file app/(admin)/admin/blog/[id]/edit/page.tsx
 * @description Page for editing an existing blog post.
 *
 * Resolves [id] and the admin session in parallel, then renders
 * EditPostEditor which loads the post from the admin blog query cache
 * and passes it to PostEditor. Changes are saved via blogApi.update()
 * with cache and ISR revalidation on success.
 */
import type { Metadata } from "next";
import { EditPostEditor } from "@/components/blog/edit-post-editor";
import { requireRole } from "@/lib/server/auth-guard";
export const metadata: Metadata = { title: "ویرایش مقاله" };
export default async function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
  const [{ id }, session] = await Promise.all([params, requireRole("admin")]);
  return (
    <div className="grid gap-6">
      <h1 className="text-2xl font-black">ویرایش مقاله</h1>
      <EditPostEditor id={id} authorId={session.user.id} />
    </div>
  );
}
