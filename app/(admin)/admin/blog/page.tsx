import type { Metadata } from "next";
import { Plus } from "lucide-react";
import Link from "next/link";
import { AdminPostList } from "@/components/blog/admin-post-list";
import { Button } from "@/components/ui/button";
export const metadata: Metadata = { title: "مدیریت مقالات" };
export default function AdminBlogPage() {
  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black">مدیریت مقالات</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            پیش‌نویس‌ها و محتوای منتشرشده را مدیریت کنید.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/blog/new">
            <Plus className="size-4" />
            مقاله جدید
          </Link>
        </Button>
      </div>
      <AdminPostList />
    </div>
  );
}
