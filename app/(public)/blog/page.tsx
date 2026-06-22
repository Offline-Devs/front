import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BookOpenText } from "lucide-react";
import { PostCard } from "@/components/blog/post-card";
import { EmptyState } from "@/components/shared/empty-state";
import { SectionHeading } from "@/components/marketing/section-heading";
import { env } from "@/config/env";
import { getPublicPosts } from "@/services/server/public-content";

export const metadata: Metadata = {
  title: "مقالات",
  description: "مقالات تحلیل آزمون، برنامه‌ریزی و مهارت‌های مطالعه",
  alternates: { canonical: "/blog" },
};
export default async function BlogPage() {
  if (!env.enableBlog) notFound();
  const posts = await getPublicPosts();
  return (
    <>
      <section className="border-b bg-muted/40">
        <div className="page-container py-14 sm:py-20">
          <SectionHeading
            eyebrow="مجله آموزشی"
            title="مقالات و راهنماهای مطالعه"
            description="مطالب کاربردی برای تحلیل بهتر آزمون، مرور اشتباهات و ساختن برنامه‌ای قابل اجرا."
          />
        </div>
      </section>
      <section className="page-container py-14 sm:py-20">
        {posts.length ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<BookOpenText className="size-10 text-muted-foreground" />}
            title="هنوز مقاله‌ای منتشر نشده است"
            description="مقاله‌های جدید پس از انتشار در این بخش نمایش داده می‌شوند."
          />
        )}
      </section>
    </>
  );
}
