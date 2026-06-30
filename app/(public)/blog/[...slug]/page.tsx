/**
 * @file app/(public)/blog/[...slug]/page.tsx
 * @description Public blog post detail page.
 */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CalendarDays } from "lucide-react";
import { JsonLd } from "@/components/seo/json-ld";
import { getBrandConfig } from "@/config/branding";
import { env } from "@/config/env";
import { blogPostPath } from "@/lib/blog-path";
import { articleExcerpt, sanitizeArticleHtml } from "@/lib/content/sanitize";
import { formatDate } from "@/lib/formatters";
import { articleJsonLd } from "@/lib/seo/json-ld";
import { getPublicPost } from "@/services/server/public-content";

type Props = { params: Promise<{ slug: string[] }> };
export const dynamic = "force-dynamic";

function slugFromParams(slug: string[]) {
  return slug.join("/").trim();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const brand = getBrandConfig();
  const { slug } = await params;
  const post = await getPublicPost(slugFromParams(slug));
  if (!post) return { title: "مقاله پیدا نشد" };
  const description = articleExcerpt(post.content);
  const path = blogPostPath(post.slug);
  return {
    title: post.title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "article",
      locale: "fa_IR",
      url: `${env.siteUrl}${path}`,
      siteName: brand.appName,
      title: post.title,
      description,
      publishedTime: post.created_at,
      modifiedTime: post.updated_at,
    },
  };
}

export default async function BlogDetailPage({ params }: Props) {
  if (!env.enableBlog) notFound();
  const { slug } = await params;
  const post = await getPublicPost(slugFromParams(slug));
  if (!post) notFound();
  const html = sanitizeArticleHtml(post.content);
  return (
    <>
      <JsonLd data={articleJsonLd(post)} />
      <article className="page-container max-w-3xl py-12 text-right sm:py-16" dir="rtl">
        <header className="mb-8 grid gap-4 border-b pb-8">
          <p className="text-sm font-bold text-primary">مقاله آموزشی</p>
          <h1 className="text-balance text-3xl font-black leading-tight sm:text-4xl">
            {post.title}
          </h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarDays className="size-4" aria-hidden="true" />
            <time dateTime={post.created_at}>{formatDate(post.created_at)}</time>
          </div>
        </header>
        <div className="article-content" dangerouslySetInnerHTML={{ __html: html }} />
      </article>
    </>
  );
}
