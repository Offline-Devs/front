/**
 * @file components/blog/post-card.tsx
 * @description Public blog post card for the blog listing page.
 *
 * Displays the post title (as a full-card link), publication date, and a
 * plain-text excerpt derived from the HTML content via articleExcerpt.
 * Hover animation lifts the card slightly. The title link spans the entire
 * card via an after::pseudo-element overlay.
 */
import Link from "next/link";
import { ArrowLeft, CalendarDays } from "lucide-react";
import type { BlogPost } from "@/types/blog";
import { blogPostPath } from "@/lib/blog-path";
import { articleExcerpt } from "@/lib/content/sanitize";
import { formatDate } from "@/lib/formatters";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export function PostCard({ post }: { post: BlogPost }) {
  return (
    <Card className="group relative flex h-full flex-col border-primary/10 transition-transform hover:-translate-y-1 hover:border-primary/25 hover:shadow-[var(--shadow-md)]">
      <CardHeader>
        <div className="mb-1 flex items-center gap-2 text-xs text-muted-foreground">
          <CalendarDays className="size-4" aria-hidden="true" />
          <time dateTime={post.created_at}>{formatDate(post.created_at)}</time>
        </div>
        <CardTitle className="leading-8">
          <Link href={blogPostPath(post.slug)} className="after:absolute after:inset-0">
            {post.title}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="line-clamp-3 text-sm leading-7 text-muted-foreground">
          {articleExcerpt(post.content)}
        </p>
      </CardContent>
      <CardFooter className="text-sm font-bold text-primary">
        ادامه مطلب
        <ArrowLeft
          className="size-4 transition-transform group-hover:-translate-x-1"
          aria-hidden="true"
        />
      </CardFooter>
    </Card>
  );
}
