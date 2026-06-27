/**
 * @file components/blog/edit-post-editor.tsx
 * @description Wrapper that locates a post by ID in the admin blog list cache
 * and passes it to PostEditor for editing.
 *
 * Uses the same ["admin", "blog"] query key as AdminPostList so the post data
 * is served from cache without a separate network request. Falls back to an
 * ApiErrorState if the post cannot be found.
 */
"use client";
import { useQuery } from "@tanstack/react-query";
import { ApiErrorState } from "@/components/shared/api-error-state";
import { blogApi } from "@/services/api/blog.api";
import { PostEditor } from "./post-editor";
export function EditPostEditor({ id, authorId }: { id: string; authorId: string }) {
  const posts = useQuery({ queryKey: ["admin", "blog"], queryFn: blogApi.adminList });
  if (posts.isLoading) return <div className="h-96 animate-pulse rounded-lg bg-muted" />;
  if (posts.isError)
    return <ApiErrorState error={posts.error} retry={() => void posts.refetch()} />;
  const post = posts.data?.find((item) => item.id === id);
  if (!post) return <ApiErrorState error={new Error("مقاله پیدا نشد.")} />;
  return <PostEditor authorId={authorId} post={post} />;
}
