"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Eye, Pencil, Plus, Send, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { ApiErrorState } from "@/components/shared/api-error-state";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { articleExcerpt } from "@/lib/content/sanitize";
import { blogApi } from "@/services/api/blog.api";
import { invalidation, invalidateDependencies } from "@/services/api/invalidation";

export function AdminPostList() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<"all" | "draft" | "published">("all");
  const posts = useQuery({ queryKey: ["admin", "blog"], queryFn: blogApi.adminList });
  async function refreshPublic() {
    await Promise.all([
      invalidateDependencies(queryClient, invalidation.blog),
      blogApi.revalidatePublicCache(),
    ]);
  }
  const publish = useMutation({
    meta: { successMessage: "مقاله منتشر شد." },
    mutationFn: blogApi.publish,
    onSuccess: async () => {
      await refreshPublic();
    },
  });
  const remove = useMutation({
    meta: { successMessage: "مقاله حذف شد." },
    mutationFn: blogApi.remove,
    onSuccess: async () => {
      await refreshPublic();
    },
  });
  if (posts.isLoading) return <div className="h-80 animate-pulse rounded-lg bg-muted" />;
  if (posts.isError)
    return <ApiErrorState error={posts.error} retry={() => void posts.refetch()} />;
  const filtered =
    posts.data?.filter(
      (post) => filter === "all" || (filter === "published" ? post.published : !post.published),
    ) ?? [];
  return (
    <div className="grid gap-5">
      <Tabs value={filter} onValueChange={(value) => setFilter(value as typeof filter)}>
        <TabsList>
          <TabsTrigger value="all">همه</TabsTrigger>
          <TabsTrigger value="draft">پیش‌نویس</TabsTrigger>
          <TabsTrigger value="published">منتشرشده</TabsTrigger>
        </TabsList>
      </Tabs>
      {filtered.length ? (
        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((post) => (
            <Card key={post.id}>
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <CardTitle>{post.title}</CardTitle>
                  <Badge variant={post.published ? "success" : "secondary"}>
                    {post.published ? "منتشرشده" : "پیش‌نویس"}
                  </Badge>
                </div>
                <code className="text-xs text-muted-foreground" dir="ltr">
                  /{post.slug}
                </code>
              </CardHeader>
              <CardContent>
                <p className="line-clamp-3 text-sm leading-6 text-muted-foreground">
                  {articleExcerpt(post.content)}
                </p>
              </CardContent>
              <CardFooter className="flex-wrap">
                <Button asChild size="sm" variant="outline">
                  <Link href={`/admin/blog/${post.id}/edit`}>
                    <Pencil className="size-4" />
                    ویرایش
                  </Link>
                </Button>
                {post.published && (
                  <Button asChild size="sm" variant="ghost">
                    <Link href={`/blog/${encodeURIComponent(post.slug)}`} target="_blank">
                      <Eye className="size-4" />
                      مشاهده
                    </Link>
                  </Button>
                )}
                {!post.published && (
                  <Button
                    size="sm"
                    loading={publish.isPending && publish.variables === post.id}
                    onClick={() => publish.mutate(post.id)}
                  >
                    <Send className="size-4" />
                    انتشار
                  </Button>
                )}
                <ConfirmDialog
                  trigger={
                    <Button size="sm" variant="ghost" className="text-destructive">
                      <Trash2 className="size-4" />
                      حذف
                    </Button>
                  }
                  title="حذف مقاله؟"
                  description="مقاله و محتوای آن برای همیشه حذف می‌شود."
                  confirmLabel="حذف مقاله"
                  loading={remove.isPending && remove.variables === post.id}
                  onConfirm={() => remove.mutate(post.id)}
                />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          title="مقاله‌ای در این وضعیت وجود ندارد"
          action={
            <Button asChild>
              <Link href="/admin/blog/new">
                <Plus className="size-4" />
                مقاله جدید
              </Link>
            </Button>
          }
        />
      )}
    </div>
  );
}
